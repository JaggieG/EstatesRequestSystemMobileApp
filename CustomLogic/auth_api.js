import { Platform } from 'react-native';

import { 
  Linking,
  Alert
} from 'react-native';



import { getTranslatedMessage } from '../CustomLogic/messages.js'

import {
  forceDevCreditionals, 
  forced_dev_emailAdddress,
  forced_dev_displayName,
  forced_dev_JWTToken,
  force_dev_intSystemRole,
  force_settings_reload_at_restart,
} from './globalSettings.js'

import appInfoStore from './appInfoStore.js';
import { getAppInfo, clearStorage } from './storage';

import { defaultAppInfo } from './globalSettings';


export const authenticateMe = (appInfo, appInfoStore, refreshMe) => {
  // Go off an do Google oAuth
  Linking.getInitialURL().then(function(initialUrl) {
    
    var platform = Platform.OS

    const authURL = appInfo.api_details.api_server_url + appInfo.api_details.api_path + appInfo.api_details.authentication_endpoint
    if (forceDevCreditionals) {
    
      Alert.alert(getTranslatedMessage('forced_dev', appInfoStore))
        
      const api_details = defaultAppInfo.api_details
        
        appInfoStore.dispatch({
        type: "LOGIN",
        payload: { 
          email_address: forced_dev_emailAdddress, 
          display_name: forced_dev_displayName, 
          JWT_Token: forced_dev_JWTToken,
          api_details : api_details,
          int_SystemRole: force_dev_intSystemRole,
        }
      });
      
      // as we have some fake login data
      refreshMe()
    } else {
      if (initialUrl.indexOf("?")>-1){
        initialUrl = initialUrl.substring(0,initialUrl.indexOf("?"));
        }

      if (platform == 'web') {
        // We need to make an http call rather than a deep link
        const completeURL = authURL + '?returnURL=' + encodeURI(initialUrl)
        //Linking.openURL(completeURL)

        const api_details = defaultAppInfo.api_details
        Alert.alert(getTranslatedMessage('forced_dev',appInfoStore))
        appInfoStore.dispatch({
          type: "LOGIN",
          payload: { 
            email_address: forced_dev_emailAdddress, 
            display_name: forced_dev_displayName, 
            JWT_Token: forced_dev_JWTToken,
            api_details : api_details, 
            int_SystemRole: force_dev_intSystemRole,
          }
        });  
        refreshMe()
      } else {
        const completeURL = authURL + '?returnURL=' + encodeURI(initialUrl)
        console.log(completeURL)
        if(initialUrl) {
        
          Linking.openURL(completeURL)
        } else {
          Alert.alert(getTranslatedMessage('url_failure', appInfoStore))
        }
        
      } 
    }
      
  });  
}

export const processAuthReturn = (url_, appStoreInfo, refreshMe) => {
  const url = url_.url
  if (url) {
    if (url.indexOf("?retrieval_token") !== -1) {
        // now we have a  retreiva token we have 1 minute to use to to get our JWT token. We post it to the endpoint for security
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
            while (match = regex.exec(url)) {
                params[match[1]] = match[2];
            }  

        const appInfo = appStoreInfo.getState()
        const retrieval_url = appInfo.api_details.api_server_url + appInfo.api_details.api_path + appInfo.api_details.retrieval_endpoint
          console.log(url)
        fetch(retrieval_url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            retrieval_token: params["retrieval_token"],
          })
        }).then((response) => response.json())
          .then((json) => {
            console.log(json)
            var record_count = json.record_count

            if (record_count == 0) {
              Alert.alert(getTranslatedMessage('authentication_failure_noRecords', appInfoStore))
            } else {
              var the_record = json.data[0]
              appInfoStore.dispatch({
                type: "LOGIN",
                payload: { 
                  email_address: the_record.text_emailAddress, 
                  display_name: the_record.text_displayName,
                  JWT_Token: the_record.text_jwtToken,
                  int_SystemRole: the_record.int_SystemRole,
                }
              });
              
              
            }
            refreshMe()
          })
          .catch((error) => {
            console.error(error);
            refreshMe(!newState)
          });
        }
      }
}

export async function processAuthAtStartUp(appInfoStore, callback) {
 
  var appInfoFromStorage = await getAppInfo()
 
  // If there is nothing in the app Info Store then this is the first time the app launched - use the default
  if (force_settings_reload_at_restart) {  
    const local_state = appInfoStore.getState()
      const local_JWT_token = local_state.JWT_Token
      const local_api_details = JSON.stringify(local_state.api_details)
      const local_app_language = local_state.app_language 
      const local_display_name = local_state.display_name
      const local_email_address = local_state.email_address
      const local_intSystemRole = local_state.int_SystemRole

    const default_state = defaultAppInfo
      const default_JWT_token = default_state.JWT_Token
      const default_api_details = JSON.stringify(default_state.api_details)
      const default_app_language = default_state.app_language 
      const default_display_name = default_state.display_name
      const default_email_address = default_state.email_address
      const default_intSystemRole = default_state.int_SystemRole
      
      var changeFound = false
      if (local_api_details != default_api_details) {
        changeFound = true
      }

      if (local_app_language != default_app_language) {
        changeFound = true
      }

      if (local_intSystemRole != default_intSystemRole) {
        changeFound = true
      }
    
    if (changeFound) {
      appInfoStore.dispatch({
        type: "STARTUP",
        payload: defaultAppInfo
      });
      callback(true)
    } else {
      callback(true)
      // console.log('Global Settings Default State macthes with current state for:')
      // console.log(local_api_details)
      // console.log('=')
      // console.log(default_api_details)
      // console.log('LANG: ' + local_app_language + ' = ' + default_app_language) 
      // console.log('ROLE: ' + local_intSystemRole + ' = ' + default_intSystemRole) 
      
    }
    
  } else {
        if (appInfoFromStorage) {
            appInfoStore.dispatch({
              type: "STARTUP",
              payload: appInfoFromStorage
            });
          } else {
            appInfoStore.dispatch({
              type: "STARTUP",
              payload: defaultAppInfo
            });
          }
          callback(true)
    }
}

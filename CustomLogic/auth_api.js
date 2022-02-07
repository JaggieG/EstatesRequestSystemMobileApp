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
} from './globalSettings.js'

import appInfoStore from './appInfoStore.js';
import { getAppInfo } from './storage.js';

import { defaultAppInfo } from './globalSettings';


export const authenticateMe = (appInfo, appInfoStore, refreshMe) => {
  // Go off an do Google oAuth
  Linking.getInitialURL().then(function(initialUrl) {
    
    var platform = Platform.OS
    const authURL = appInfo.api_details.api_server_url + appInfo.api_details.api_path + appInfo.api_details.authentication_endpoint
    if (forceDevCreditionals) {
      Alert.alert(getTranslatedMessage('forced_dev', appInfoStore))
        const api_details = defaultAppInfo.appInfo.api_details
        console.log('defaultAppInfo: ' + JSON.stringify(api_details))
      appInfoStore.dispatch({
        type: "LOGIN",
        payload: { 
          email_address: forced_dev_emailAdddress, 
          display_name: forced_dev_displayName, 
          JWT_Token: forced_dev_JWTToken,
          api_details : api_details,     
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
          }
        });  
        refreshMe()
      } else {
        const completeURL = authURL + '?returnURL=' + encodeURI(initialUrl)
        if(initialUrl) {
        
          Linking.openURL(completeURL)
        } else {
          Alert.alert(getTranslatedMessage('url_failure',appInfoStore))
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
            //console.log(json)
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

export async function processAuthAtStartUp(appInfoStore, setReadyToLoad) {
  var appInfoFromStorage = await getAppInfo()
  appInfoStore.dispatch({
    type: "STARTUP",
    payload: { 
      email_address: appInfoFromStorage.email_address, 
      display_name: appInfoFromStorage.display_name,
      JWT_Token: appInfoFromStorage.JWT_Token,
    }
  });
  setReadyToLoad(true)
  
}

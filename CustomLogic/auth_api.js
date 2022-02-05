import { Platform } from 'react-native';
import { useState, useContext } from 'react';

import { 
  Linking
} from 'react-native';



export const authenticateMe = (appInfo) => {
  // Go off an do Google oAuth
  Linking.getInitialURL().then(function(initialUrl) {
    
    const authURL = appInfo.api_details.api_server_url + appInfo.api_details.api_path + appInfo.api_details.authentication_endpoint
    const completeURL = authURL + '?returnURL=' + encodeURI(initialUrl)
    console.log(completeURL)
    Linking.openURL(completeURL)
  });  
}


export const processAuthReturn = (url_, store, newState, setNewState) => {

  const url = url_.url
  
    if (url.indexOf("?email") !== -1) {
      if (url) {
       
        console.log(url)
        //consider security implications of this
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
            while (match = regex.exec(url)) {
            params[match[1]] = match[2];
            }  
            store.dispatch({
              type: "LOGIN",
              payload: { 
                email_address: params["email"], 
                display_name: params["displayname"].replace("%20"," "),
                JWT_Token: params["JWT_Token"],
              }
            });

            setNewState(!newState)

      }
      }
}

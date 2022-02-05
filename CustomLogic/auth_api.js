import { Platform } from 'react-native';
import React, { useContext } from 'react';
import { 
  Linking
} from 'react-native';



export const authenticateMe = (appInfo) => {
  // Go off an do Google oAuth
  
  Linking.getInitialURL().then(function(initialUrl) {
    const authURL = appInfo.api_details.api_server_url + appInfo.api_details.api_path + appInfo.api_details.authentication_endpoint
    const completeURL = authURL + '?returnURL=' + encodeURI(initialUrl)

    Linking.openURL(completeURL)
  });  
}


export const processAuthReturn = ({ url }) => {
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
        console.log(params["email"])
        console.log(params["displayname"].replace("%20"," "))
        console.log(params["jwtToken"])
            // appInfo["email_address"] =  params["email"]
            // appInfo["display_name"] =  params["displayname"].replace("%20"," ")
            // appInfo["JWT_Token"] = params["jwtToken"]

            //setAppInfo(appInfo)
        
      }
      }
}

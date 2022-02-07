export const forceDevCreditionals = true
export const forced_dev_emailAdddress = 'jag@aiglon.ch'
export const forced_dev_displayName = 'John Gerhardt'
export const forced_dev_JWTToken = 'FORCED_DEV'


export const getCurrentActiveLanguage = (appInfoStore) => {
    if (appInfoStore == undefined) {
        return 'en'
    } else {
        var appinfo = appInfoStore.getState()
        return appinfo.app_language
    }
    
}


// API URLs
const api_server_url_testing = "http://jaglocaltesttemp.aiglon.ch:8080"
const api_server_url_testing_no_auth = "http://192.168.1.128:8080"
const api_server_url_prod = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url = api_server_url_testing_no_auth
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"

export const defaultAppInfo = {
    appInfo : {
      email_address : null,
      display_name : null,
      JWT_Token : null,
      api_details :  {
            api_server_url : api_server_url,
            api_path : api_path,
            authentication_endpoint : authentication_endpoint
       }
     }
    }

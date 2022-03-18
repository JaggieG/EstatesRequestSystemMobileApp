// Make some global settings available to the reset of the application

/*
  Note to Marker

  The forceDevCreditionals variable will toggle whether the application uses the oAuth or a forced developement
  version for testing. This should be activated, althoug, I have provided a username that you can test the oAuth
  with in the documentation

*/
export const forceDevCreditionals = false
export const force_settings_reload_at_restart = false
export const forced_dev_emailAdddress = 'jag@aiglon.ch'
export const forced_dev_displayName = 'John Gerhardt'
export const forced_dev_JWTToken = 'FORCED_DEV'
export const force_dev_intSystemRole = 1

// returns the active language
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
const api_server_url_staging = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url_prod = "https://googlesystemadmin.aiglon.ch"
const retrieval_endpoint = "retrieval"

var api_server_url = api_server_url_prod
if (forceDevCreditionals) {
    // This is off when the testing with non local clients
    //api_server_url = api_server_url_testing_no_auth
} else {
    api_server_url = api_server_url_prod
}
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"

// This is the default information that the application will use if nothing exists (on first launch)
export const defaultAppInfo = {
    email_address: null,
    display_name: null,
    JWT_Token: null,
    int_SystemRole: 1,
    app_language: 'en',
    api_details: {
        api_server_url: api_server_url,
        api_path: api_path,
        authentication_endpoint: authentication_endpoint,
        retrieval_endpoint : retrieval_endpoint
    }
}
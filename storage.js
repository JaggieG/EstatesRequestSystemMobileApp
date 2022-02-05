import * as SecureStore from 'expo-secure-store';


// API URLs
const api_server_url_testing = "http://jaglocaltesttemp.aiglon.ch:8080"
const api_server_url_prod = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url = api_server_url_testing
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"

const initialState = {
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

const store_key = 'AiglonEstatesStore'

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    return result
  }

  export async function updateAppInfo(appInfo) {
    await save(store_key, appInfo)
    return true
  }

  export async function getAppInfo(appInfo) {
      // if there is no value in the store then we should add one as we need it
    var result =  await getValueFor(store_key)
    if (result) {
        await updateAppInfo(initialState)
        return await getValueFor(store_key)
    } else {
        return result
    }
  }
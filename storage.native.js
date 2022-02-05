import AsyncStorage from '@react-native-async-storage/async-storage';

// API URLs
const api_server_url_testing = "http://jaglocaltesttemp.aiglon.ch:8080"
const api_server_url_prod = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url = api_server_url_testing
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"

const initialState = {
      email_address : null,
      display_name : null,
      JWT_Token : null,
      api_details :  {
            api_server_url : api_server_url,
            api_path : api_path,
            authentication_endpoint : authentication_endpoint
       }
}

const store_key = '@AiglonEstatesStore'

export async function updateAppInfo(appInfo) {
    await storeData(store_key, JSON.stringify(appInfo))
    return true
}

export function getAppInfo(callback) {
    getData(store_key).then(appInfo => {
        if (appInfo) {
            callback(JSON.parse(appInfo))
        } else {
            updateAppInfo(initialState).then(stored => {
                if (stored) {
                    getData(store_key).then(appInfo => {
                        callback(JSON.parse(appInfo))
                    })
                }
            })
        }
    })
}

const storeData = async (key,value) => {
    try {
       const data = await AsyncStorage.setItem(key, value)
       return  data
    } catch (e) {
      // saving error
      console.log(e)
      return {}
    }
}

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        return value
    } catch(e) {
        // error reading value
        console.log(e)
        return null
    }
}
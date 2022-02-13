//Implement async storage when we are on webpack (NOT SECURE ONLY FOR TEST)
import AsyncStorage from '@react-native-async-storage/async-storage';

const store_key = '@AiglonEstatesStore'

import { defaultAppInfo } from './globalSettings'


export async function updateAppInfo(appInfo) {
    await storeData(store_key, JSON.stringify(appInfo))
    return true
}

export async function getAppInfo() {
  //await clearAsyncStorage()//

  var appInfo = await getData(store_key)
  console.log('appInfo: ' + appInfo)
    if (appInfo) {
        return JSON.parse(appInfo)
    } else {
        var stored = await updateAppInfo(defaultAppInfo)
        if (stored) {
          var appInfo = await getData(store_key)
          console.log(appInfo)
          return JSON.parse(appInfo)  
        }
    }
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

const clearAsyncStorage = async() => {
  AsyncStorage.clear();
}
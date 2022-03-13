//Implement async storage when we are on webpack (NOT SECURE ONLY FOR TEST)
import AsyncStorage from '@react-native-async-storage/async-storage';

const store_key = '@AiglonEstatesStore'

import { defaultAppInfo } from './globalSettings'


export async function updateAppInfo(appInfo) {
  try {
    var parsedJSON = JSON.parse(appInfo)
    var stringify = appInfo
  } catch(err) {
    stringify = JSON.stringify(appInfo)
  }
    await storeData(store_key, stringify)
    return true
}



export async function getAppInfo() {

  var appInfo = await getData(store_key)
    if (appInfo) {
        return JSON.parse(appInfo)
    } else {
        var stored = await updateAppInfo(defaultAppInfo)
        if (stored) {
          var appInfo2 = await getData(store_key)
          return JSON.parse(appInfo2)  
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

export const clearStorage = async() => {
  AsyncStorage.clear();
}
//Implement secure storage when we are on Android or iOS

import { defaultAppInfo } from './globalSettings'

import * as SecureStore from 'expo-secure-store';

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

  export async function getAppInfo() {
    //await updateAppInfo(JSON.stringify(defaultState)) // to force a state back in
      // if there is no value in the store then we should add one as we need it
    var result =  await getValueFor(store_key)

    if (result == null) {
        await updateAppInfo(JSON.stringify(defaultAppInfo))
        return await JSON.parse(getValueFor(store_key))
    } else {
        return JSON.parse(result)
    }
  }

import * as SecureStore from 'expo-secure-store';

import { defaultAppInfo } from './globalSettings';

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
        await updateAppInfo(defaultAppInfo)
        return await getValueFor(store_key)
    } else {
        return result
    }
  }
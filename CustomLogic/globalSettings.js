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


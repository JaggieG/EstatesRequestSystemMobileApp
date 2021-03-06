// import the message from the JSON file
const messages  = require('./messages.json');

//get active language from the global Settings
import { getCurrentActiveLanguage } from './globalSettings'

// helper function to return the correct message - used everywhere in application
export const getTranslatedMessage = (withKey, appInfoStore) => {
    var currentActiveLanguage = getCurrentActiveLanguage(appInfoStore)
    try {
        var message = messages.allMessages[withKey][currentActiveLanguage]
        if (message) {
            return message
        } else {
            return 'UNKNOWN'
        }
    } catch(err) {
        console.error(err)
        return 'UNKNOWN'
    }
    
   
}


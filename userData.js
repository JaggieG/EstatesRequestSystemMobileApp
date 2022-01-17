// This module handles get user data of the applicatio


export class userDataClass {
    static email_address = null; 
    static display_name = null;
    static oAuthURL = 'http://jaglocaltesttemp.aiglon.ch:8080/genericsolutions/estatesrequestsystem/mobile_api/test'
}

export function setUserEmailAddress(newEmailAddress) {
    userDataClass.email_address = newEmailAddress
    return userDataClass.email_address
}

export function setUserDisplayName(newDisplayName) {
    userDataClass.display_name = newDisplayName
    return userDataClass.display_name
}


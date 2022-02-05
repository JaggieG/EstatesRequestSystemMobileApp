export const getAllMyRequests = async (appInfo,callback) => {
    const baseURL = getBaseURL(appInfo)
    var myRequestEndpoint = 'getMyRequests'
    var completeURL = baseURL + myRequestEndpoint
    var email_address = getEmailAddress(appInfo)
    var JWT_Token = getJWTToken(appInfo)

    try {
        let response = await fetch(completeURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authentication' : 'Bearer ' + JWT_Token
            },
            body: JSON.stringify({
                email_address: email_address
            })
        });
        
        let json = await response.json();
        callback(null, json)
    } catch(err) {
        console.log(err)
        callback(err,null)
        return err
    }


}

function getBaseURL(appInfo) {
    return appInfo.api_details.api_server_url + appInfo.api_details.api_path
}

function getEmailAddress(appInfo) {
    return appInfo.email_address
}

function getJWTToken(appInfo) {
    return appInfo.JWT_Token
}
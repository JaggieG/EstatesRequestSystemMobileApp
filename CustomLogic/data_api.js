export const getAllMyRequests = async (appInfo, callback) => {
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
                authObject : {
                    email_address: email_address
                },
                payload : {

                }
            })//
        });
        
        let json = await response.json();
        callback(null, json)
    } catch(err) {
        console.log(err)
        callback(err,null)
        return err
    }
}

export const createANewRequst = async (appInfo, 
                                        building,
                                        building_id,
                                        urgency,
                                        urgency_id, 
                                        description,
                                        callback) => {
    const baseURL = getBaseURL(appInfo)
    var myRequestEndpoint = 'createARequest'
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
                authObject : {
                    email_address: email_address
                },
                payload : {
                    building: building,
                    building_id: building_id,
                    urgency: urgency,
                    urgency_id: urgency_id,
                    description: description,
                    userDisplayName : appInfo.display_name
                }
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

const getBaseURL = (appInfo)  => {
    return appInfo.api_details.api_server_url + appInfo.api_details.api_path
}

const getEmailAddress = (appInfo) => {
    return appInfo.email_address
}

const getJWTToken = (appInfo) => {
    return appInfo.JWT_Token
}
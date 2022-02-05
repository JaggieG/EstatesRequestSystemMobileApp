import { createStore} from 'redux'

// API URLs
const api_server_url_testing = "http://jaglocaltesttemp.aiglon.ch:8080"
const api_server_url_prod = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url = api_server_url_testing
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"

const defaultState = {
    loginSuccess: false,
    email_address : null,
    display_name : null,
    JWT_Token : null,
    api_details :  {
          api_server_url : api_server_url,
          api_path : api_path,
          authentication_endpoint : authentication_endpoint
     }
  }

function appInfo(state=defaultState, action) {
  switch(action.type) {
    case "LOGIN":
      return {...state,
        email_address: action.payload.email_address, 
        display_name: action.payload.display_name, 
        JWT_Token: action.payload.JWT_Token, 
        loginSuccess: true,
        };
    default:
      return state;
  }
}
export default createStore(appInfo);
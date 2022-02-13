import { createStore} from 'redux'
import { updateAppInfo } from './storage.js'

// API URLs
const api_server_url_testing = "http://jaglocaltesttemp.aiglon.ch:8080"
const api_server_url_prod = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url = api_server_url_testing
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"
const retrieval_endpoint = "retrieval"

import { defaultAppInfo } from './globalSettings'

function appInfo(state=defaultAppInfo, action) {
  switch(action.type) {
    case "LOGIN":
      if (action.payload.api_details) {
        var new_state = {...state,
          email_address: action.payload.email_address, 
          display_name: action.payload.display_name, 
          JWT_Token: action.payload.JWT_Token, 
          api_details : action.payload.api_details,
          int_SystemRole : action.payload.int_SystemRole,
          loginSuccess: true,
        }
      } else {
        var new_state = {...state,
          email_address: action.payload.email_address, 
          display_name: action.payload.display_name, 
          JWT_Token: action.payload.JWT_Token, 
          loginSuccess: true,
        }
      }
    
        updateAppInfo(JSON.stringify(new_state))
        return new_state;
     case "LOGOUT":
        var new_state = {...state,
                        email_address: null, 
                        display_name: null, 
                        JWT_Token: null, 
                        loginSuccess: false,
          }
          updateAppInfo(JSON.stringify(new_state))
        return new_state ;
      case "STARTUP":
        var new_state = action.payload
          updateAppInfo(JSON.stringify(new_state))
          return new_state;
       case "LANG_UPDATE":
            var new_state = {...state,
                app_language: action.payload.app_language, 
              }
              updateAppInfo(JSON.stringify(new_state))
              return new_state;
     default:
       return state
  }
}

export default createStore(appInfo);
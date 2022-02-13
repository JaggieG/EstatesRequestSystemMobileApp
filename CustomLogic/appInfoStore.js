// import the required funcitons from redux to create a store
import { createStore } from 'redux'

// import the updateApp Info and defualt app info from the settings and storage classes
import { updateAppInfo } from './storage'
import { defaultAppInfo } from './globalSettings'

// reducer that updated the root appInfo that is used everywhere in the application (Auth info etc.)

function appInfo(state = defaultAppInfo, action) {
  switch (action.type) {
      case "LOGIN":
          if (action.payload.api_details) {
              var new_state = {
                  ...state,
                  email_address: action.payload.email_address,
                  display_name: action.payload.display_name,
                  JWT_Token: action.payload.JWT_Token,
                  api_details: action.payload.api_details,
                  int_SystemRole: action.payload.int_SystemRole,
                  loginSuccess: true,
              }
          } else {
              var new_state = {
                  ...state,
                  email_address: action.payload.email_address,
                  display_name: action.payload.display_name,
                  JWT_Token: action.payload.JWT_Token,
                  int_SystemRole: action.payload.int_SystemRole,
                  loginSuccess: true,
              }
          }

          updateAppInfo(JSON.stringify(new_state))
          return new_state;
      case "LOGOUT":
          var new_state = {
              ...state,
              email_address: null,
              display_name: null,
              JWT_Token: null,
              loginSuccess: false,
          }
          updateAppInfo(JSON.stringify(new_state))
          return new_state;
      case "STARTUP":
          var new_state = action.payload
          updateAppInfo(JSON.stringify(new_state))
          return new_state;
      case "LANG_UPDATE":
          var new_state = {
              ...state,
              app_language: action.payload.app_language,
          }
          updateAppInfo(JSON.stringify(new_state))
          return new_state;
      default:
          return state
  }
}

export default createStore(appInfo);
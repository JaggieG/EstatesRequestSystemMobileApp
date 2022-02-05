// Create a context
import { useState, useEffect, createContext} from 'react';

// API URLs
const api_server_url_testing = "http://jaglocaltesttemp.aiglon.ch:8080"
const api_server_url_prod = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url = api_server_url_testing
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"

const initialState = {
  appInfo : {
    email_address : null,
    display_name : null,
    JWT_Token : null,
    api_details :  {
          api_server_url : api_server_url,
          api_path : api_path,
          authentication_endpoint : authentication_endpoint
     }
   }
  }





  /*
  
const AuthContext = createContext(initialState);
AuthContext.displayName = 'App Information';

const AuthProvider = ({ children }) => {
  
  const [appInfo, setAppInfoState] = useState(initialState);

  console.log(appInfo)
  // Get current auth state from AsyncStorage
  const getAppInfoState = async () => {
    try {
      const appInfoDataString = await AsyncStorage.getItem("appInfo");
      const appInfoData = JSON.parse(appInfoDataString || {});
      // Configure axios headers
      //configureAxiosHeaders(authData.token, authData.phone);

      setAppInfoState(appInfoData);
    } catch (err) {
      setAppInfoState({});
    }
  };

  // Update AsyncStorage & context state
  const setAppInfo = async (appInfo) => {
    try {
      await AsyncStorage.setItem("appInfo", JSON.stringify(appInfo));
      // // Configure axios headers
      // configureAxiosHeaders(auth.token, auth.phone);
      setAppInfoState(auth);
    } catch (error) {
      Promise.reject(error);
    }
  };

  useEffect(() => {
    getAppInfoState();
  }, []);

  return (
    <AuthContext.Provider value={{ appInfo, setAppInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
*/
export { AuthContext, AuthProvider };
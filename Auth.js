// Create a context
import React, { createContext} from 'react';

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

const AuthContext = createContext(initialState);

const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(initialState);

  // Get current auth state from AsyncStorage
  const getAuthState = async () => {
    try {
      const authDataString = await AsyncStorage.getItem("auth");
      const authData = JSON.parse(authDataString || {});
      // Configure axios headers
      configureAxiosHeaders(authData.token, authData.phone);
      setAuthState(authData);
    } catch (err) {
      setAuthState({});
    }
  };

  // Update AsyncStorage & context state
  const setAuth = async (auth) => {
    try {
      await AsyncStorage.setItem("auth", JSON.stringify(auth));
      // Configure axios headers
      configureAxiosHeaders(auth.token, auth.phone);
      setAuthState(auth);
    } catch (error) {
      Promise.reject(error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
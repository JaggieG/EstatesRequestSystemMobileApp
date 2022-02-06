// imprt the required items from React native
import { 
  Dimensions, 
  Linking,
} from 'react-native';

import { NavigationContainer} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

// Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Custom Components Info
import { CustomTabNavigatorComponent } from './CustomComponents/TabNavigator'
//import {ErrorView} from './CustomComponents/ErrorView'

//custom logic
import {processAuthReturn} from './CustomLogic/auth_api' 
import appInfoStore from './appInfoStore'


// Here is the main applicatoin
export default function App() {
  // This state allows the application to be refresh when a use is authentication
  const [refreshValue, _setRefreshValue] = useState(false); 
  const refreshMe = () => {
    _setRefreshValue(!refreshValue);
  };

  useEffect(() => {
    // Listening for the return URL when authenticating, we pass the url along with the store and a refreshMe function to refresh the root
    // nav controller
    Linking.addEventListener('url', function(url) {
      processAuthReturn(url, appInfoStore, refreshMe)
    })   
  }, []);
  
  return (
      <NavigationContainer refreshValue={refreshValue}>
         <CustomTabNavigatorComponent appInfoStore={appInfoStore} refreshMe={refreshMe}></CustomTabNavigatorComponent>
      </NavigationContainer>
    
  );
}


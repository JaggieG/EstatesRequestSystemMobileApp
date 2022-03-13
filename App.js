// import the required items from React native
import { 
  Dimensions, 
  Linking,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { NavigationContainer} from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';

// Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Custom Components Info
import { CustomTabNavigatorComponent } from './CustomComponents/TabNavigator'

//custom logic
import appInfoStore from './CustomLogic/appInfoStore'
import {processAuthReturn, processAuthAtStartUp} from './CustomLogic/auth_api' 

// Here is the main application
export default function App() {
  // This state allows the application to be refreshed when a user is authenticated
  const [refreshValue, _setRefreshValue] = useState(false); 

  // As we pull the current logged on user from the secure storage we need to wait for it to return
  // to be able to have access to the data.
  const [readyToLoad, setReadyToLoad] = useState(false)
  
  const refreshMe = useCallback(() => {
    _setRefreshValue(!refreshValue);
  }, [])

  useEffect(() => {
    // Listening for the return URL when authenticating, we pass the url along with the store and a refreshMe function to refresh the root
    // nav controller
    processAuthAtStartUp(appInfoStore, function(readyToLoad) {
      setReadyToLoad(readyToLoad)  
    })
    
    Linking.addEventListener('url', function(url) {
      processAuthReturn(url, appInfoStore, refreshMe)
    })   
  }, [refreshMe]);

  if (readyToLoad) {
    // simple top level application
    return (
      <NavigationContainer refreshValue={refreshValue}>
         <CustomTabNavigatorComponent appInfoStore={appInfoStore} refreshMe={refreshMe}></CustomTabNavigatorComponent>
      </NavigationContainer>
    );
  } else {
    // this is so quick that probably will never be seen, but put an activity indicator to be nice!
    return (
      <View style={baseStyles.baseView}>
          <ActivityIndicator size="large" />
      </View>
    );
  }
}

// Styles
const baseStyles = StyleSheet.create({
  baseView : {
      flex: 1, 
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center' ,
  },
})
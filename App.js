import { 
  Dimensions, 
  Linking,
  Text,
} from 'react-native';


import { NavigationContainer} from '@react-navigation/native';

import React, { useEffect, useState, useContext } from 'react';

// Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Custom Components Info

import { CustomTabNavigatorComponent } from './CustomComponents/TabNavigator'
import {ErrorView} from './CustomComponents/ErrorView'

//custom logic
import  { AuthContext, AuthProvider } from './Auth.js'
import {authenticateMe, processAuthReturn} from './CustomLogic/auth_api' 

authenticateMe()
// Here is the main applicatoind
export default function App() {
 
  useEffect(() => {
    // Listening for the return URL when authenticating
    // this is not 100% secure, so should be looked at
    Linking.addEventListener('url', processAuthReturn);
  }, []);

  return (
    
     <NavigationContainer>
       <CustomTabNavigatorComponent appInfoContext={AuthContext}></CustomTabNavigatorComponent>
     </NavigationContainer>
  );
}


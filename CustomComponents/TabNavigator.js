// add the stack navigator as this is going to be the main navigation of our app
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();


import { 
  Text,
} from 'react-native';

import React, { useEffect, useState, useContext } from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { ConnectionTabComponent } from '../CustomComponents/ConnectionTab'
import { MyRequestsTabComponent } from '../CustomComponents/MyRequestsTab'
import { MakeARequestTabComponent } from '../CustomComponents/MakeARequestTab'

const CustomTabNavigatorComponent = (props) => {
    const AuthContext = props.appInfoContext
    const { appInfo } = useContext(AuthContext);
    return (
    
       <Tab.Navigator
            screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'My Requests') {
                iconName = focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline';
                } else if (route.name === 'Make A Request') {
                iconName = focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline';
                } else if (route.name === 'Connection') {
                iconName = focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            })}
        >
        
        {/* Only show the connection page if we are not logged in! */}
        {appInfo.email_address == null ? (
          
              <Tab.Screen 
              name="Connection" 
              children={()=><ConnectionTabScreenComponent appInfoContext={AuthContext}/>}
               />
            ) : (
            <>
            
            <Tab.Screen 
              name="My Requests" 
              options={{ tabBarBadge: 3 }}
              children={()=><MyRequestsTabScreenComponent appInfoContext={AuthContext}/>}
            />

            <Tab.Screen 
              name="Make A Request" 
              children={()=><MakeARequestTabScreenComponent appInfoContext={AuthContext}/>}
            />

            <Tab.Screen 
              name="Connection" 
              children={()=><ConnectionTabScreenComponent appInfoContext={AuthContext}/>}
            />
            </>
            )}  
        </Tab.Navigator>
    )
  }

  const MyRequestsTabScreenComponent = (props) => {
    return (
        <MyRequestsTabComponent {...props}></MyRequestsTabComponent>
      )
  }

  const ConnectionTabScreenComponent = (props) => {
    return (
       <ConnectionTabComponent {...props}></ConnectionTabComponent>
      )
  }

    function MakeARequestTabScreenComponent ({ navigation })  {
    return (
      <MakeARequestTabComponent navigation={navigation}></MakeARequestTabComponent>
    )
  }
  
  export {CustomTabNavigatorComponent}
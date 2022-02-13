// add the stack navigator as this is going to be the main navigation of our app
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import React, {useState, useEffect } from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

// get global funciton for translation
import { getTranslatedMessage } from '../CustomLogic/messages'

import { getRequestRecordCounts } from "../CustomLogic/data_api"

// Are are all of the custom tab components
import { ConnectionTabComponent } from '../CustomComponents/ConnectionTab'
import { MyRequestsTabComponent } from '../CustomComponents/MyRequestsTab'
import { MakeARequestTabComponent } from '../CustomComponents/MakeARequestTab'
import { SettingsTabComponent } from '../CustomComponents/SettingsTab'
import { AssignedRequestTabComponent } from '../CustomComponents/AssignedRequestsTab'

const CustomTabNavigatorComponent = (props) => {
  //get the application global variables that we might need to accces when we are processing items

    var appInfoStore = props.appInfoStore
    var refreshMe = props.refreshMe
    const appInfo = appInfoStore.getState()

    const [myOpenRequests, setMyOpenRequest] = useState(0)
    const [myOpenAssignedRequests, setMyOpenAssignedRequests] = useState(0)


    // helper function to update get the record counts from the API and refresh them on the badges
    const updateRecordCounts = () => {
      if (appInfo.email_address != null ) {
        getRequestRecordCounts(appInfo, 0, function(err, api_return) {   
            if (err) {
              console.log(err)
            } else {
              setMyOpenRequest(api_return.my_requests)
              setMyOpenAssignedRequests( api_return.assigned_requests)
            }
          })
       }
    
    }
    // update the bages every x (60000 = 1min)
    const MINUTE_MS = 60000;

    useEffect(() => {   
      //Update record count on load
       updateRecordCounts()
       const interval = setInterval(() => {
        //update record count every x minutes
        updateRecordCounts()
      }, MINUTE_MS);
      return () => clearInterval(interval);
    }, []);


    return (
       <Tab.Navigator appInfo = {appInfo}
            options={{ unmountOnBlur: true }}
            listeners={({ navigation }) => ({
              blur: () => navigation.setParams({ screen: undefined }),
            })}
            screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === getTranslatedMessage('my_requests_tab',appInfoStore)) {
                iconName = focused
                    ? 'ios-archive'
                    : 'ios-archive-outline';
                } else if (route.name === getTranslatedMessage('make_request_tab',appInfoStore)) {
                iconName = focused
                    ? 'ios-color-wand'
                    : 'ios-color-wand-outline';
                } else if (route.name === getTranslatedMessage('assigned_requests_tab',appInfoStore)) {
                  iconName = focused
                      ? 'md-hammer'
                      : 'md-hammer-outline';
                } else if (route.name === getTranslatedMessage('connection_tab',appInfoStore)) {
                iconName = focused
                    ? 'ios-git-network'
                    : 'ios-git-network-outline';
                } else if (route.name === getTranslatedMessage('settings_tab',appInfoStore)) {
                  iconName = focused
                      ? 'ios-settings'
                      : 'ios-settings-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            })}
        >
        
        {/* Only show the connection page if we are not logged in! */}
        {appInfo.email_address == null ? (
           <>
                <Tab.Screen 
                name={getTranslatedMessage('connection_tab', appInfoStore)} 
                  children={()=><ConnectionTabScreenComponent updateBadges={updateRecordCounts} {...props}/>}
                />
           
              </>
            ) : (
            <>
            
            <Tab.Screen 
              name={getTranslatedMessage('make_request_tab', appInfoStore)}
              children={()=><MakeARequestTabScreenComponent updateBadges={updateRecordCounts} {...props}/>}
            /> 
            {appInfo.int_SystemRole > 0 &&
                <Tab.Screen 
                  name={getTranslatedMessage('assigned_requests_tab', appInfoStore)} 
                  options={{ tabBarBadge: myOpenAssignedRequests }}
                  children={()=><AssignedRequestsTabScreenComponent updateBadges={updateRecordCounts} {...props}/>}
                />
            }
            <Tab.Screen 
              name={getTranslatedMessage('my_requests_tab', appInfoStore)} 
              options={{ tabBarBadge: myOpenRequests }}
              children={()=><MyRequestsTabScreenComponent updateBadges={updateRecordCounts} {...props}/>}
            />
            <Tab.Screen 
                name={getTranslatedMessage('settings_tab', appInfoStore)} 
                children={()=><SettingsTabScreenComponent updateBadges={updateRecordCounts} {...props}/>}
                />
            </>
            )}  
        </Tab.Navigator>
    )
  }
  // For ease of future use, each tab component is a custom component
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

  const MakeARequestTabScreenComponent = (props) =>  {
    return (
      <MakeARequestTabComponent {...props}></MakeARequestTabComponent>
    )
  }

  const SettingsTabScreenComponent = (props) =>  {
    return (
      <SettingsTabComponent {...props}></SettingsTabComponent>
    )
  }

  const AssignedRequestsTabScreenComponent = (props) =>  {
    return (
      <AssignedRequestTabComponent {...props}></AssignedRequestTabComponent>
    )
  }

 // export the custom tab navigator to the App root
  export {CustomTabNavigatorComponent}
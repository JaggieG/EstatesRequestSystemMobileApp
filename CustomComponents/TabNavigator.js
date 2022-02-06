// add the stack navigator as this is going to be the main navigation of our app
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();


import Ionicons from 'react-native-vector-icons/Ionicons';

// get global funciton for translation
import { getTranslatedMessage } from '../messages.js'

// Are are all of the custom tab components
import { ConnectionTabComponent } from '../CustomComponents/ConnectionTab'
import { MyRequestsTabComponent } from '../CustomComponents/MyRequestsTab'
import { MakeARequestTabComponent } from '../CustomComponents/MakeARequestTab'

const CustomTabNavigatorComponent = (props) => {
    
  //get the application global variables that we might need to accces when we are processing items

    var appInfoStore = props.appInfoStore
    var refreshMe = props.refreshMe
    const appInfo = appInfoStore.getState()

    return (
       <Tab.Navigator appInfo = {appInfo}
            screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === getTranslatedMessage('my_requests_tab')) {
                iconName = focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline';
                } else if (route.name === getTranslatedMessage('make_request_tab')) {
                iconName = focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline';
                } else if (route.name === getTranslatedMessage('connection_tab')) {
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
              name={getTranslatedMessage('connection_tab')} 
            children={()=><ConnectionTabScreenComponent {...props}/>}
               />
            ) : (
            <>
            
            <Tab.Screen 
              name={getTranslatedMessage('my_requests_tab')} 
              options={{ tabBarBadge: 3 }}
              children={()=><MyRequestsTabScreenComponent {...props}/>}
            />

            <Tab.Screen 
              name={getTranslatedMessage('make_request_tab')}
              children={()=><MakeARequestTabScreenComponent {...props}/>}
            />

            <Tab.Screen 
              name={getTranslatedMessage('connection_tab')} 
              children={()=><ConnectionTabScreenComponent {...props}/>}
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

    function MakeARequestTabScreenComponent (props)  {
    return (
      <MakeARequestTabComponent {...props}></MakeARequestTabComponent>
    )
  }
  
  export {CustomTabNavigatorComponent}
import { StatusBar } from 'expo-status-bar';
import { 
  Image, 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  SafeAreaView, 
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState, useContext } from 'react';
import {store, useGlobalState} from 'state-pool';

import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

// add the stack navigator as this is going to be the main navigation of our app
const Tab = createBottomTabNavigator();

// API URLs
const api_server_url_testing = "http://jaglocaltesttemp.aiglon.ch:8080"
const api_server_url_prod = "https://webapp-googleclassroomadmin-staging.azurewebsites.net"
const api_server_url = api_server_url_testing
const api_path = "/genericsolutions/estatesrequestsystem/mobile_api/"
const authentication_endpoint = "authMobileDevice"

import {getAllMyRequests} from './data_api.js'

var currentStateAppInfo = {}

try {
  currentStateAppInfo = store.getState("app_info", {
    persist: true
  })
} catch(err) {
  var currentStateAppInfoValue = {
    email_address : null,
    display_name : null,
    JWT_Token : null,
    api_details :  {
      api_server_url : api_server_url,
      api_path : api_path,
      authentication_endpoint : authentication_endpoint
   }
  }
  currentStateAppInfo["value"] = currentStateAppInfoValue
}

store.setState("app_info", {
  email_address : currentStateAppInfo.value.email_address,
  display_name : currentStateAppInfo.value.display_name,
  JWT_Token : currentStateAppInfo.value.JWT_Token,
  api_details :  {
    api_server_url : currentStateAppInfo.value.api_details.api_server_url,
    api_path : currentStateAppInfo.value.api_details.api_path,
    authentication_endpoint : currentStateAppInfo.value.api_details.authentication_endpoint
 }
},
{
  persist: true
});

var currentStateMyRequests = {}

try {
  currentStateMyRequests = store.getState("my_requests", {
    persist: true
  })
} catch(err) {
  var currentStateMyRequestsValue = {
    my_requests : null
  }
  currentStateMyRequests["value"] = currentStateMyRequestsValue
}

store.setState("my_requests", {
  my_requests :  currentStateMyRequests.value.my_request
},
{
  persist: true
});


// Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Here is the main applicatoind
export default function App() {
  const [appInfo, setAppInfo] = useGlobalState("app_info",{ persist: true})

  const handleOpenURL = ({ url }) => {
    if (url.indexOf("?email") !== -1) {
      if (url) {
       
       //consider security implications of this
       var regex = /[?&]([^=#]+)=([^&#]*)/g,
       params = {},
       match;
        while (match = regex.exec(url)) {
          params[match[1]] = match[2];
        }  
      
        setAppInfo({
          email_address : params["email"],
          display_name : params["displayname"].replace("%20"," "),
          JWT_Token : params["jwtToken"],
          api_details :  {
            api_server_url : appInfo.api_server_url,
            api_path : appInfo.api_path,
            authentication_endpoint : appInfo.authentication_endpoint
         }
        })

      }
      }
      
  };


  useEffect(() => {
    // Listening for the return URLs
    Linking.addEventListener('url', handleOpenURL);
  }, []);

  return (
    <NavigationContainer>
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
            }else if (route.name === 'Connection') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="My Requests" component={MyRequestsScreen} options={{ tabBarBadge: 3 }}/>
        <Tab.Screen name="Make A Request" component={MakeARequestScreen} />
        <Tab.Screen name="Connection" component={Connection} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


function MyRequestsScreen({ navigation }) {
  const [myRequests, setMyRequest] = useGlobalState("my_requests",{ persist: true})
  const [appInfo, setAppInfo] = useGlobalState("app_info",{ persist: true})

  React.useEffect(() => {
    getAllMyRequests(appInfo,function(err, api_return) {   
        if (err) {
         console.log(err)
         
        } else {
          console.log(api_return)
          setMyRequest(api_return)
          
        }
    })
  }, []);
  

  //
  if (appInfo.email_address) {
   return (
        <View style={styles.container}>
        <StatusBar style = "dark"  />
        <SafeAreaView style={styles.mainView}>
          <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
          <Text>Loading!</Text>
          <Text>{myRequests.my_request}</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
   )
  } else {
    return (
      <NoConnectionView></NoConnectionView>
    );
  }
  
}

function MakeARequestScreen({ navigation })  {
  const [appInfo, setAppInfo] = useGlobalState("app_info",{ persist: true})
  
  if (appInfo.email_address) {
    return (
      <View style={styles.container}>
      <StatusBar style = "dark"  />
      <SafeAreaView style={styles.mainView}>
        <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
        <Text>make a request</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
    );
  } else {
    return (
      <NoConnectionView></NoConnectionView>
    );
  }
}

function Connection({ navigation })  {
  const [appInfo, setAppInfo] = useGlobalState("app_info",null,{ persist: true})
  const authURL =  appInfo.api_details.api_server_url + appInfo.api_details.api_path + appInfo.api_details.authentication_endpoint
  if (appInfo.email_address) {
    
    return (
      <View style={connectionStyles.baseView}>
        <StatusBar style = "dark"  />
        <SafeAreaView>
        <Image style={{height : 50, width: 50}}source={require('./assets/googlelogo.jpg')}></Image>
         <Text style={{marginBottom: 50}}>Connection Details</Text>
         <Text>Email Address: {appInfo.email_address}</Text>
         <Text>Display Name: {appInfo.display_name}</Text>
         <Text>JWT_Token: {appInfo.JWT_Token}</Text>
         <TouchableOpacity style={connectionStyles.appButtonContainer}
             onPress={() => Linking.openURL(authURL)}>
             <Text style={connectionStyles.appButtonText}>Refresh Details</Text>
           </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  } else {
    return (
      <View style={connectionStyles.baseView}>
        <StatusBar style = "dark"  />
        <SafeAreaView>
        <Image style={{height : 50, width: 50}}source={require('./assets/googlelogo.jpg')}></Image>
          <TouchableOpacity style={connectionStyles.appButtonContainer}
             onPress={() => Linking.openURL(authURL)}>
             <Text style={connectionStyles.appButtonText}>Click here to login with Google</Text>
           </TouchableOpacity>
          
        </SafeAreaView>
      </View>
    );
  }
  
}
const NoConnectionView = (props) => {
  const navigation = useNavigation();
  return (
    <View style={noConnectionStyles.baseView}>
    <StatusBar style = "dark"  />
    <SafeAreaView>
       <TouchableOpacity style={noConnectionStyles.appButtonContainer}
           onPress={() => navigation.navigate('Connection')}>
           <Text style={noConnectionStyles.appButtonText}>Please login in to start</Text>
         </TouchableOpacity>
    </SafeAreaView>
  </View>     
  ) 
}

const ErrorView = (props) => {
  const navigation = useNavigation();
  return (
    <View style={noConnectionStyles.baseView}>
    <StatusBar style = "dark"  />
    <SafeAreaView>
        <Text style={noConnectionStyles.appButtonText}>Oops looks like there was no error</Text>
    </SafeAreaView>
  </View>     
  ) 
}

const noConnectionStyles = StyleSheet.create({
  baseView : {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center' 
  },
  mainView: {
    backgroundColor: '#CCC',
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
})

const connectionStyles = StyleSheet.create({
  baseView : {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center' 
  },
  mainView: {
    backgroundColor: '#CCC',
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
})



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    backgroundColor: '#FFF',
    width: "100%",
    height: "100%",
    justifyContent: 'flex-end',
  },
  tableCell : {
    height : "290",
  }
});

const other = StyleSheet.create({
  body: {
    backgroundColor: "#FFFFFF",
  },
  socialBtn: {
    margin: 30,
    backgroundColor: '#1f5c9e',
    paddingVertical: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center'
  },
 });
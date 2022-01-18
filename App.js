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

const currentState = store.getState("user_info", {
  persist: true
})
console.log('START:' + JSON.stringify(currentState))

store.setState("user_info", {
  email_address : currentState.value.email_address,
  display_name : currentState.value.display_name,
  JWT_Token : currentState.value.JWT_Token,
  connection_url : "http://jaglocaltesttemp.aiglon.ch:8080/genericsolutions/estatesrequestsystem/mobile_api/test"
},
{
  persist: true
});

// Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Here is the main applicatoind
export default function App() {
  const [userInfo, setUserInfo] = useGlobalState("user_info",{ persist: true})
  

  const handleOpenURL = ({ url }) => {
    if (url.indexOf("?email") !== -1) {
      if (url)
      //consider security implications of this
          var url_split = url.split("email=")
          var url_split2 = url_split[1].split("&displayname=")

          var email_address = url_split2[0]
          var display_name = url_split2[1]
          var JWT_Token  = 'fdshyd87745u3brgfb'       
          
          setUserInfo({
            email_address : email_address,
            display_name : display_name,
            JWT_Token : JWT_Token,
            connection_url : userInfo.connection_url
          })
        
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
  const [userInfo, setUserInfo] = useGlobalState("user_info",{ persist: true})
  if (userInfo.email_address) {
    return (
      <View style={styles.container}>
      <StatusBar style = "dark"  />
      <SafeAreaView style={styles.mainView}>
        <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
        <Text>my  requests</Text>
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

function MakeARequestScreen({ navigation })  {
  const [userInfo, setUserInfo] = useGlobalState("user_info",{ persist: true})
  if (userInfo.email_address) {
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
  const [userInfo, setUserInfo] = useGlobalState("user_info",{ persist: true})
  if (userInfo.email_address) {
    return (
      <View style={connectionStyles.baseView}>
        <StatusBar style = "dark"  />
        <SafeAreaView>
        <Image style={{height : 50, width: 50}}source={require('./assets/googlelogo.jpg')}></Image>
         <Text style={{marginBottom: 50}}>Connection Details</Text>
         <Text>Email Address: {userInfo.email_address}</Text>
         <Text>Display Name: {userInfo.display_name}</Text>
         <Text>JWT_Token: {userInfo.JWT_Token}</Text>
         <TouchableOpacity style={connectionStyles.appButtonContainer}
             onPress={() => Linking.openURL(userInfo.connection_url)}>
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
             onPress={() => Linking.openURL(userInfo.connection_url)}>
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
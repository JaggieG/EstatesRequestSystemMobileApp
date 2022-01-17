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
import { createStackNavigator, navigation } from '@react-navigation/stack';
import React, { useEffect, useState, useContext } from 'react';

// add the stack navigator as this is going to be the main navigation of our app
const Stack = createStackNavigator();



// Global device setup

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


import {setUserEmailAddress, setUserDisplayName, userDataClass } from './userData.js';

// Here is the main applicatoin
export default function App() {

  const handleOpenURL = ({ url }) => {
    if (url.indexOf("?email") !== -1) {
      if (url)
      //consider security implications of this
          var url_split = url.split("email=")
          var url_split2 = url_split[1].split("&displayname=")

          var email_address = url_split2[0]
          var display_name = url_split2[1]          

          setUserEmailAddress(email_address)
          setUserDisplayName(display_name)
          
      
      }
  };


  useEffect(() => {
    // Listening for the return URL
    Linking.addEventListener('url', handleOpenURL);
  }, []);


  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Estates Home" component={HomeScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}


function HomeScreen({route, navigation}) {
  const [displayName, setDisplayName] = useState(userDataClass.display_name)
  const [emailAddress, setEmailAddress] = useState(userDataClass.email_address)

  return (
    
    <View style={styles.container}>
      <StatusBar style = "dark"  />
      <SafeAreaView style={styles.mainView}>
        <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
         <TouchableOpacity style={styles.socialBtn}
             onPress={() => Linking.openURL(userDataClass.oAuthURL)}>
             <Text style={other.buttonText} >
               {emailAddress === null ? "Connect via Google" : "You are connected !"}</Text>
           </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

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
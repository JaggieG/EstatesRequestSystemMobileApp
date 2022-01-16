import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';

// add the stak navigator as this is going to be the main navigation of our app
const Stack = createStackNavigator();

// Global device setup

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Here is the main applicatoin
export default function App() {
  const [userData, setUserData] = useState("");



  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Estates Home" component={HomeScreen} params={,null}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}


function HomeScreen({route, navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar style = "dark"  />
      <SafeAreaView style={styles.mainView}>
        <ScrollView style={{height:"100%", backgroundColor: "#ccc"}}>
        <Text>
           {userData === "" ? null : userData}
         </Text>
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
    backgroundColor: '#ccc',
    width: "100%",
    height: "100%",
    justifyContent: 'flex-end',
  },
  tableCell : {
    height : "290",
  }
});

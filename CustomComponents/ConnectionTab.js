

// Nice sign in with Google Button
import GoogleButton from 'react-google-button'

// react status bar
import { StatusBar } from 'expo-status-bar';
import React, {useContext } from 'react';

//standard react ocmponents
import { 
    Text, 
    View, 
    SafeAreaView, 
    StyleSheet,
    Linking,
    TouchableOpacity
  } from 'react-native';

  import {authenticateMe} from '../CustomLogic/auth_api'

// the connection tab
const ConnectionTabComponent = (props) => {
    const { appInfo } = useContext(props.appInfoContext);
    const navigation = props.navigation
        if (appInfo.email_address != null) {
            // we have auth info      
            return (
                <View style={connectionStyles.baseView}>
                    <StatusBar style = "dark"  />
                    <SafeAreaView>
                    <Image style={{height : 50, width: 50}}source={require('../assets/googlelogo.jpg')}></Image>
                    <Text style={{marginBottom: 50}}>Connection Details</Text>
                    <Text>Email Address: {appInfo.email_address}</Text>
                    <Text>Display Name: {appInfo.display_name}</Text>
                    <Text>JWT_Token: {appInfo.JWT_Token}</Text>
                    <TouchableOpacity style={connectionStyles.appButtonContainer}
                        onPress={() => authenticateMe(appInfo)}>
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
                    <Text style={{marginBottom: 50}}>You aren't logged in!</Text>
                    <TouchableOpacity style={connectionStyles.appButtonContainer}
                        onPress={() => authenticateMe(appInfo)}>
                        <Text style={connectionStyles.appButtonText}>Log In</Text>
                    </TouchableOpacity>
                    {/* <GoogleButton onClick={() => Linking.openURL(authURL)} /> */}
                </SafeAreaView>
            </View>
            );
        }
  }

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


// export the custom tab for later use
export {ConnectionTabComponent}




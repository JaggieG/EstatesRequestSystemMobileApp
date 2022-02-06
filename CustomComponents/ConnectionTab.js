// react status bar
import { StatusBar } from 'expo-status-bar';
import React, {useContext } from 'react';

//standard react ocmponents
import { 
    Text, 
    View, 
    SafeAreaView, 
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
  } from 'react-native';

  import {authenticateMe} from '../CustomLogic/auth_api'


  
// Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
  // get global funciton for translation
import { getTranslatedMessage } from '../CustomLogic/messages.js'

// the connection tab
const ConnectionTabComponent = (props) => {
    const appInfo = props.appInfoStore.getState()    
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
                        onPress={() => authenticateMe(appInfo, props.appInfoStore, props.refreshMe)}>
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
                    <Image source={require('../assets/aiglon_logo.png')} style={connectionStyles.aiglonLogo}/>      
                        <Text style={connectionStyles.welcomeText}> 
                        {getTranslatedMessage('not_logged_in', props.appInfoStore)}
                        </Text>
                    
                        <TouchableOpacity activeOpacity = { .5 } 
                            onPress={() => authenticateMe(appInfo, props.appInfoStore, props.refreshMe)}
                        > 
                            <Image source={require('../assets/google-signin-button.png')} style={connectionStyles.signInButton}/>          
                        </TouchableOpacity>
                    
                </SafeAreaView>
            </View>
            );
        }
  }

const connectionStyles = StyleSheet.create({
    baseView : {
        flex: 1, 
        backgroundColor: '#FFF',
    },
    signInButton : {
        width : windowWidth - 20,
        resizeMode : "contain",
        marginLeft: 'auto',
        marginRight: 'auto',
    }, 
    welcomeText : {
        fontSize : 20,
        marginTop : 60,
        justifyContent: 'center',
        alignItems: 'center' ,
        marginLeft: 'auto',
        marginRight: 'auto',
        width : windowWidth - 40,
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
    }, 
    aiglonLogo : {
        justifyContent: 'center',
        alignItems: 'center' ,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop : 30,
    }
})


// export the custom tab for later use
export {ConnectionTabComponent}




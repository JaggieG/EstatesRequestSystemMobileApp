// react status bar
import { StatusBar } from 'expo-status-bar';

//standard react ocmponents
import { 
    Text, 
    View,
    Image,
    TouchableOpacity,
    SafeAreaView, 
    StyleSheet,
    Dimensions,
    ScrollView
  } from 'react-native';


  import {authenticateMe} from '../CustomLogic/auth_api'
// Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

  // get global funciton for translation
  import { getTranslatedMessage } from '../CustomLogic/messages.js'


// the connection tab
const SettingsTabComponent = (props) => {
    const appInfo = props.appInfoStore.getState()    

            // we have auth info      
            return (
                <View style={connectionStyles.baseView}>
                <StatusBar style = "dark"  />
                <SafeAreaView>
                <ScrollView>
                     <Image source={require('../assets/aiglon_logo.png')} style={connectionStyles.aiglonLogo}/>       
                   
                        <Text style={connectionStyles.welcomeText}> 
                             {getTranslatedMessage('logged_in', props.appInfoStore)}
                        </Text>

                        <View style={connectionStyles.connectionDetails}>
                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>Email Address:</Text>
                                <Text> {appInfo.email_address}</Text>
                            </View>

                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>Display Name:</Text>
                                <Text> {appInfo.display_name}</Text>
                            </View>

                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>JWT Token:</Text>
                                <Text> {appInfo.JWT_Token}</Text>
                            </View>

                             
                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>Lang:</Text>
                                <Text> {appInfo.app_language}</Text>
                            </View>

                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>System Role:</Text>
                                <Text> {appInfo.int_SystemRole}</Text>
                            </View>

                    

                            
                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>api_server_url:</Text>
                                <Text> {appInfo.api_details.api_server_url}</Text>
                            </View>

                            
                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>authentication_endpoint</Text>
                                <Text> {appInfo.api_details.authentication_endpoint}</Text>
                            </View>

                            
                            <View style={{flexDirection: 'row' }}>
                                <Text style={{fontWeight : "bold"}}>api_path</Text>
                                <Text> {appInfo.api_details.api_path}</Text>
                            </View>
                        </View>

                        <Text style={connectionStyles.welcomeText}> 
                             {getTranslatedMessage('log_in_again', props.appInfoStore)}
                        </Text>
                    
                        <TouchableOpacity activeOpacity = { .5 } 
                            onPress={() => authenticateMe(appInfo, props.appInfoStore, props.refreshMe)}
                        > 
                            <Image source={require('../assets/google-signin-button.png')} style={connectionStyles.signInButton}/>          
                        </TouchableOpacity>
                
                <Text style={connectionStyles.languageChooser}>
                 {getTranslatedMessage('choose_language',props.appInfoStore)}
                </Text>
            <View style={connectionStyles.flagContainer}> 
           
            <TouchableOpacity activeOpacity = { .5 } onPress={() => swapLanguageTo(props.appInfoStore, props.refreshMe, 'en')}>   
                <Image source={require('../assets/GB.png')} style={connectionStyles.gbFlag}/> 
            </TouchableOpacity>    
            <TouchableOpacity activeOpacity = { .5 } onPress={() => swapLanguageTo(props.appInfoStore, props.refreshMe, 'fr')}>     
                <Image source={require('../assets/CH.png')} style={connectionStyles.swissFlag}/>       
                </TouchableOpacity>    
            </View>
                
                
            </ScrollView>
                </SafeAreaView>
            </View>
        
                );
     
  }

  const swapLanguageTo = (appInfoStore, refreshMe,langCode) => {
      appInfoStore.dispatch({
        type: "LANG_UPDATE",
        payload: { 
            app_language : langCode,
        }
      });  
      refreshMe()
  }

const connectionStyles = StyleSheet.create({
    baseView : {
        flex: 1, 
        backgroundColor: '#FFF',
    },
    signInButton : {
        width : windowWidth - 20,
        height : 100,
        resizeMode : "contain",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop : 20,
        marginBottom : 20,
    }, 
    welcomeText : {
        fontSize : 20,
        justifyContent: 'center',
        alignItems: 'center' ,
        marginLeft: 'auto',
        marginRight: 'auto',
        width : windowWidth - 40,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop : 10,
    }, 
    aiglonLogo : {
        justifyContent: 'center',
        alignItems: 'center' ,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop : 30,
    },
    flagContainer : {
        justifyContent: 'center',
        alignItems: 'center' ,
        flexDirection: 'row',
    },
    swissFlag : {
        height : 100,
        width : 100,
        marginLeft : 20,
        resizeMode : "contain",
    },
    gbFlag : {
        height : 100,
        width : 100,
        resizeMode : "stretch",
    },
    connectionDetails : {
        fontSize : 30,
        marginTop : 10,
        justifyContent: 'center',
        alignItems: 'center' ,
        marginLeft: 'auto',
        marginRight: 'auto',
        width : windowWidth - 40,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom : 10,
    },
    languageChooser : {
        fontSize : 15,
        justifyContent: 'center',
        alignItems: 'center' ,
        marginLeft: 'auto',
        marginRight: 'auto',
        width : windowWidth - 40,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom : 10,
    }
})

// export the custom tab for later use
export {SettingsTabComponent}




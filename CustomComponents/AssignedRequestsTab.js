

// react status bar
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
//standard react ocmponents
import { 
    Text, 
    View, 
    SafeAreaView, 
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    Alert,
    Image,
    Pressable,
    Switch,
  } from 'react-native';

// custom Logic
import {getAllMyAssignedRequests} from '../CustomLogic/data_api.js'
import { getCurrentActiveLanguage } from '../CustomLogic/globalSettings.js'

// get global funciton for translation
import { getTranslatedMessage } from '../CustomLogic/messages.js'

import { Cell, Section, TableView } from 'react-native-tableview-simple';
import appInfoStore from '../CustomLogic/appInfoStore.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// the assigned request tab
const AssignedRequestTabComponent = (props) => {
  var appInfoStore = props.appInfoStore
  const appInfo = appInfoStore.getState()
  const navigation = useNavigation()
  
  // get some base information about the user and therefore waht to display

  const [refreshing, setRefreshing] = useState(false);
  const [errorDetected, setErrorDetected] = useState(false)
  const [errorDetails, setErrorDetails] = useState('')

  const [myRequests, setMyRequests] = useState('LOADING')

  const [activeRequstType, setActiveRequestType] = useState('MY_REQS')

  // get the role of the user in the system
  const [systemRole, setSystemRole] = useState(0)

    // Switch controls

    const [boolCompleted, setBoolCompleted] = useState(false);
    const toggleSwitch = () => {
      setBoolCompleted(previousState => !previousState);
      showRequests(navigation, appInfoStore)
    }
    
    const showRequests = (navigation, appInfoStore) => {    
      if (systemRole == 0) {
        setActiveRequestType('MY_REQS')
        getRequiredData(appInfo)
      } else {
        setActiveRequestType('MY_ASSIGNED_REQS')
        getRequiredData(appInfo)
      }
    }

    const getRequiredData = (appInfo) => {
       setRefreshing(true);
     
      // var temp_boolComplete = 0 // boolCompleted == 0 ? 1 : 0
       //need to swap as we get true and false and our text logic is the other way around!
       console.log('before call boolCompleted: ' + boolCompleted)
       if (boolCompleted) {
        temp_boolComplete = 1
       } else {
        temp_boolComplete = 0
       }
       console.log('temp_boolComplete: ' + temp_boolComplete)
       getAllMyAssignedRequests(appInfo, temp_boolComplete, function(err, api_return) {   
          if (err) {
          setErrorDetected(true)
          setErrorDetails(err.toString())
          setRefreshing(false);
          } else {
            setErrorDetected(false)
            setErrorDetails('')
            setMyRequests(api_return)
            setRefreshing(false)
          }
      })
    }

    const onRefresh = React.useCallback(() => {
      showRequests(navigation, appInfo)
    }, []);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        showRequests(navigation, appInfo)
      });
      return unsubscribe;
    }, []);
    
    if (errorDetected) {
      return (
        <View style={styles.container}>
        <StatusBar style = "dark"  />
        <SafeAreaView style={{height:"100%", backgroundColor: "#FFF"}}>
        <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }>
          <View style={styles.mainView}>
          <Image source={require('../assets/error.jpg')}  style={[styles.errorImage]}/> 
          
          
            <Text>{getTranslatedMessage('generic_error', props.appInfoStore)}</Text>
            <Text>{errorDetails}</Text>
            </View> 
          </ScrollView>
        </SafeAreaView>
      </View>
      )
    } else {

    if (myRequests == 'LOADING') {
      return (
        <View style={styles.container}>
        <StatusBar style = "dark"  />
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
              <ActivityIndicator size="large" color="#0000ff"  />
            </ScrollView>
            </SafeAreaView>
        </View>
      )
    } else {

      
        if (myRequests.record_count == 0) {
          return (
            <View style={styles.container}>
            <StatusBar style = "dark"  />
              <SafeAreaView style={styles.mainView}>
                <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }>
          
                    <TableView style={{backgroundColor : "#FFF"}}>
                    <Section headerComponent={<CustomSectionHeader boolCompleted={boolCompleted} toggleSwitch={toggleSwitch}/>}>
                        <View style={customCellStyles.noRecordBubble}>
                          <Text>{getTranslatedMessage('no_records_found', appInfoStore)}</Text>
                      </View>
                    
                    </Section>
                </TableView>
                {/* <Text>{JSON.stringify(myRequests)}</Text> */}
              
        
            </ScrollView>
        </SafeAreaView>
        </View>


          )
        } else {
          return (

            
            
              <View style={styles.container}>
              <StatusBar style = "dark"  />
                <SafeAreaView style={styles.mainView}>
                  <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }>
                      <TableView style={{backgroundColor : "#FFF"}}>
                      <Section  headerComponent={<CustomSectionHeader boolCompleted={boolCompleted} toggleSwitch={toggleSwitch} />}>
                          {myRequests.data.map((item, i) => (
                                <RequestCustomCell 
                                {...props}
                                key ={i.toString()}
                                onPress={() => {
                                  var alertMessage = ''
                                  alertMessage += getTranslatedMessage('assigned_to', appInfoStore) + ':  ' + item.text_assignedTo
                                  alertMessage += '\r\n'
                                  alertMessage += getTranslatedMessage('desc_en', appInfoStore) + ':  ' + item.text_englishDesc
                                  alertMessage += '\r\n'
                                  alertMessage += getTranslatedMessage('desc_fr', appInfoStore) + ':  ' + item.text_frenchhDesc
                                  Alert.alert(alertMessage)
                                }}
                                title= {item.text_requestTitle}
                                submittedDateTime={item.date_submittedDateTime}
                                urgency={item.int_urgency}
                                building={item.text_building}
                                >
                                </RequestCustomCell>
                          ))}
                      </Section>
                  </TableView>
                  {/* <Text>{JSON.stringify(myRequests)}</Text> */}
                
          
              </ScrollView>
          </SafeAreaView>
          </View>
          )
        }
      }
    }
  }

  const CustomSectionHeader = (props) => {
    const boolCompleted = props.boolCompleted
    const toggleSwitch = props.toggleSwitch

    return (
      <View style={{height :40}}>
        <Text style={{paddingLeft : 10, marginTop: 6,  fontSize : 15, fontWeight : "bold",}}>{getTranslatedMessage('assigned_requests_tab', props.appInfoStore)}</Text>
        
        <View style={{position:'absolute', right: 10, flexDirection : 'row'}}>
          <Text style={{marginRight: 10, marginTop: 6}}>{getTranslatedMessage('completed_requests', props.appInfoStore)}</Text>
        <Switch
        
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={boolCompleted ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={boolCompleted}
    />
          
          </View>
      </View>    
    )
  }

  const RequestCustomCell = (props) => {
    if (props.title == null) {
      var title = 'UNKNOWN'
    } else {
      var title = props.title
    }
    return (
        <Cell key={props.id}
          {...props}//
          backgroundColor= "#FFF"
          cellContentView = {
            <View style={{width: "100%", height: 100} }>

              <View style={customCellStyles.titleBubble}>
                <Text>{title}</Text>
              </View>

              <View style={customCellStyles.timeBubble}>
                 <Text>{formatDateTimeNicely(props.appInfoStore, props.submittedDateTime)}</Text>
              </View>
              
              
              
              <View style={customCellStyles.urgencyBubble}>
                <Text>{props.urgency}</Text>
              </View>
              
              <View style={customCellStyles.buildingBubble}>
                <Text>{props.building}</Text>
              </View>
              
            </View>
          }
          />
        
    ) 
  }

  const formatDateTimeNicely = (appInfoStore, thisDate) => {
    var active_lang = getCurrentActiveLanguage(appInfoStore)
    const thisDateAsDate = new Date(thisDate)
    //consider this is in Zulu
    const theTime = str_pad(thisDateAsDate.getHours()) + ':' + str_pad(thisDateAsDate.getMinutes())
    if (active_lang =='en') {
      return str_pad(thisDateAsDate.getDate()) + '/' + str_pad((thisDateAsDate.getMonth() + 1)) + '/' + thisDateAsDate.getFullYear() + ' ' + theTime
    } else if (active_lang =='fr') {
      return str_pad(thisDateAsDate.getDate()) + '.' + str_pad((thisDateAsDate.getMonth() + 1)) + '.' + thisDateAsDate.getFullYear() + ' ' + theTime
    } else {
      return str_pad(thisDateAsDate.getDate()) + '/' + str_pad((thisDateAsDate.getMonth() + 1)) + '/' + thisDateAsDate.getFullYear() + ' ' + theTime
    }
    
  }

  function str_pad(theNumber) {
    return ('0' + theNumber).slice(-2)
  }
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    mainView: {
      backgroundColor: '#FFF',
      width: "100%",
      height: "100%",
      marginTop: 20,
      paddingLeft: 10,
      paddingRight: 10,
    },
    tableCell : {
      height : "290",
    },
    errorImage : {
      justifyContent: 'center',
      alignItems: 'center' ,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: windowWidth - 40,
      height : 200,
      marginBottom : 20
  
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


  const customCellStyles = StyleSheet.create({
    generalView : {
      paddingTop: 10, 
      paddingBottom: 50, 
      backgroundColor : "#ccc"
    },
    urgencyBubble : {
      backgroundColor : "red",
      borderRadius : 75,
      paddingTop : 10,
      paddingBottom : 10,
      paddingLeft : 20,
      paddingRight : 20,
      justifyContent: "center",
      position : "absolute",
      right : 0,
      top: 10,
    },
    buildingBubble : {
      backgroundColor : "#78F2FF",
      borderRadius : 75,
      paddingTop : 10,
      paddingBottom : 10,
      paddingLeft : 20,
      paddingRight : 20,
      justifyContent: "center",
      position : "absolute",
      right : 0,
      bottom: 10,  
    },
    titleBubble : {
      backgroundColor : "#67FF6C",
      borderRadius : 75,
      paddingTop : 10,
      paddingBottom : 10,
      paddingLeft : 20,
      paddingRight : 20,
      justifyContent: "center",
      position : "absolute",
      left : 0,
      top: 10,
    },
    timeBubble : {
      backgroundColor : "#EDFF67",
      borderRadius : 75,
      paddingTop : 10,
      paddingBottom : 10,
      paddingLeft : 20,
      paddingRight : 20,
      justifyContent: "center",
      position : "absolute",
      left : 0,
      bottom: 10,
    },
    noRecordBubble : {
      backgroundColor : "#67FF6C",
      borderRadius : 75,
      paddingTop : 10,
      paddingBottom : 10,
      paddingLeft : 20,
      paddingRight : 20,
      marginLeft: 10,
      justifyContent: "center",
      position : "absolute",
      left : 0,
      top: 10,
    },

    
});

const buttons = StyleSheet.create({
  buttonContainer : {
    flexDirection : 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
button: {
  width : (windowWidth / 2) -20,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: '#47C46F',
  marginTop : 10,
  marginLeft: 10
  
},
text: {
  fontSize: 16,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: 'white',
},
});

// export the custom tab for later use
export {AssignedRequestTabComponent}




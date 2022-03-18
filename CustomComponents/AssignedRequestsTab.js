

// import react components
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback } from 'react';

// get the nvaigation stack if we have to move from one tab to the next
import { useNavigation } from '@react-navigation/native';

//standard react components
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
    Modal,
    Switch,
    Pressable,
  } from 'react-native';

 import { Cell, Section, TableView } from 'react-native-tableview-simple';

// custom Logic
import {getAllMyAssignedRequests, closeRequestWithId} from '../CustomLogic/data_api.js'
import { getCurrentActiveLanguage } from '../CustomLogic/globalSettings.js'

// get global funciton for translation
import { getTranslatedMessage } from '../CustomLogic/messages.js'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// the connection tab
const AssignedRequestTabComponent = (props) => {
  // get variable from the props that we need to update and control the component
  var appInfoStore = props.appInfoStore
  const updateBadges = props.updateBadges


  const appInfo = appInfoStore.getState()
  const navigation = useNavigation()
  
  // states of the modals so that we can show and hide them!
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({})
  
  // get some base information about the user and therefore what  to display
  const [refreshing, setRefreshing] = useState(false);
  const [errorDetected, setErrorDetected] = useState(false)
  const [errorDetails, setErrorDetails] = useState('')

  // holds the request to show
  const [myRequests, setMyRequests] = useState('LOADING')

  // switch controls to show completed requests or not
  const [boolCompleted, setBoolCompleted] = useState(false);
  const toggleSwitch = () => {
    // easy toggle helper
    setBoolCompleted(!boolCompleted) 
  }

  // function that closes a request using a request id
  const closeRequest = (request_id) => {
    setModalVisible(!modalVisible) // hide the modal
    // we need to make sure that users is sure!
    Alert.alert(getTranslatedMessage('sure_close', appInfoStore), "",
      [
        {
          text: getTranslatedMessage('yes', appInfoStore),
          onPress: () => {
            // they are sure - we can tell the API to close this request.
            closeRequestWithId(appInfo, request_id, function(err, api_return) { 
              if (err) {
                  Alert.alert(err.toString())
                  setRefreshing(false);
              } else {
                  getAllMyAssignedRequests(appInfo, boolCompleted, function(err, api_return) {   
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
            })
          },
        },
        {
          text: getTranslatedMessage('no', appInfoStore),
        },
      ]
    );
  }
    
// function to go and get the data that we need for the component
  const getRequiredData = useCallback(() => {
    setRefreshing(true); // show the spinner
    getAllMyAssignedRequests(appInfo, boolCompleted, function(err, api_return) {   
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
  }, [boolCompleted, appInfo])

  
  // this is called when we refresh the application
  const onRefresh = React.useCallback(() => {
    updateBadges()
    getRequiredData()
  }, [updateBadges, getRequiredData ]);

  //use Effect run when the component load - relies on the boolComplete
  useEffect(() => {
    getRequiredData()
    const unsubscribe = navigation.addListener('focus', () => {
      updateBadges()
      getRequiredData()
    });
    return unsubscribe;
  }, [boolCompleted, getRequiredData, updateBadges, navigation]);
  
  // if there is an error detected then we should show the error view!
  if (errorDetected) {
    return (
          <View style={styles.container}>
            <StatusBar style = "dark"  />
            <SafeAreaView style={{height:"100%", backgroundColor: "#FFF"}}>
              <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
      // no error but we are waiting for the data
      if (myRequests == 'LOADING') {
        return (
          <View style={styles.container}>
             <StatusBar style = "dark"  />
               <SafeAreaView style={styles.mainView}>
                  <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
                    <View>
                      <ActivityIndicator size="large" color="#0000ff"  />
                    </View>
                   </ScrollView>
              </SafeAreaView>
          </View>
        )
      } else {
          // data is loaded
        if (myRequests.record_count == 0) {
          return (
            <View style={styles.container}>
               <StatusBar style = "dark"  />
                  <SafeAreaView style={styles.mainView}>
                    <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                        refreshControl={<RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />}>
                      <TableView style={{backgroundColor : "#FFF"}}>
                        <Section sectionPaddingTop={0} headerComponent={<CustomSectionHeader appInfoStore={appInfoStore} boolCompleted={boolCompleted} toggleSwitch={toggleSwitch}/>}>
                          <View style={customCellStyles.noRecordBubble}>
                            <Text>{getTranslatedMessage('no_records_found', appInfoStore)}</Text>
                          </View>
                        </Section>
                      </TableView>
                    </ScrollView>
                  </SafeAreaView>
              </View>
          )
        } else {
          // MAIN AREA - we have data!
          return (
              <View style={styles.container}>
                <StatusBar style = "dark"  />
                    <SafeAreaView style={styles.mainView}>
                      {/* This is the modal that will be shown - is hidden is not made visible */}
                          <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => { 
                              Alert.alert("Modal has been closed.");
                              setModalVisible(!modalVisible);
                            }}
                          >
                          <View style={modalStyles.centeredView}>
                            <View style={modalStyles.modalView}>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('make_request_building', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.text_building}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('submitted_data_time', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{formatDateTimeNicely(appInfoStore,modalContent.date_submittedDateTime,)}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('make_request_urgency', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.int_urgency}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('desc_fr', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.text_frenchDesc}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('desc_en', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.text_englishDesc}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('creator_email', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.text_requesterEmail}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('creator_name', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.text_requesterName}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('assigned_to', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.text_assignedTo}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('assigned_to_email', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.text_assignee_emailaddress}</Text>
                              </View>
                              <View style={{flexDirection : "row"}}>
                                <Text style={modalStyles.modalTextTitle}>{getTranslatedMessage('completed', appInfoStore)} : </Text>
                                <Text style={modalStyles.modalText}>{modalContent.bool_complete ? getTranslatedMessage('yes', appInfoStore) : getTranslatedMessage('no', appInfoStore)} {modalContent.bool_complete}</Text>
                              </View>
                                <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={modalStyles.textStyle}>{getTranslatedMessage('hide_modal', appInfoStore)}</Text>
                              </Pressable>
                              {/* Only show Close if the request is open! */}
                                { modalContent.bool_complete == 0 &&
                                <Pressable style={[styles.button, styles.buttonClose]} onPress={() => closeRequest(modalContent.request_id)}>
                                      <Text style={modalStyles.textStyle}>{getTranslatedMessage('close_request', appInfoStore)}</Text>
                                </Pressable>
                                }
                            </View>
                          </View>
                        </Modal>
                  {/* The rest of the page */}
                  <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                           refreshControl={<RefreshControl efreshing={refreshing} onRefresh={onRefresh} /> }>
                    <TableView style={{backgroundColor : "#FFF"}}>
                      <Section  sectionPaddingTop={0} headerComponent={<CustomSectionHeader appInfoStore={appInfoStore} boolCompleted={boolCompleted} toggleSwitch={toggleSwitch} />}>
                          {myRequests.data.map((item, i) => (
                                <RequestCustomCell 
                                {...props}
                                key ={i.toString()}
                                iterator = {i}
                                onPress={() => {
                                  setModalContent(item)
                                  setModalVisible(!modalVisible)
                                }}
                                title= {item.text_requestTitle}
                                requester = {item.text_requesterName}
                                submittedDateTime={item.date_submittedDateTime}
                                urgency={item.int_urgency}
                                building={item.text_building}
                                >
                                </RequestCustomCell>
                          ))}
                      </Section>
                  </TableView>
                  
          
                  </ScrollView>
              </SafeAreaView>
           </View>
          )
        }
      }
    }
  }
  // Custom header showing the toggle Switch
  const CustomSectionHeader = (props) => {
    const boolCompleted = props.boolCompleted
    const toggleSwitch = props.toggleSwitch

    return (
      <View style={{height :40}}>
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
  
  // Custom table cell
  const RequestCustomCell = (props) => {
    return (
        <Cell key={props.iterator}
          {...props}
          accessory = "DisclosureIndicator"
          backgroundColor= {props.iterator % 2 == 0 ? "#ffff" : "#f4f3f4"}
          cellContentView = {
            <View style={{width: "95%", height: 100} }>
              <View style={customCellStyles.titleBubble}>
                <Text>{props.requester}</Text>
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
  // helper function to show a nice date and time and not a SQL formatted date and time!
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

  // helper padding function
  function str_pad(theNumber) {
    return ('0' + theNumber).slice(-2)
  }
  
  //styles
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
    errorImage : {
      justifyContent: 'center',
      alignItems: 'center' ,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: windowWidth - 40,
      height : 200,
      marginBottom : 20
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  });
  

  const modalStyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
    },
    modalText: {
      marginBottom: 15,
    },
    modalTextTitle : {
      marginBottom: 15,
      fontWeight : 'bold'
    }
  });

  const customCellStyles = StyleSheet.create({
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

// export the custom tab for later use
export {AssignedRequestTabComponent}




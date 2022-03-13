

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
    Image,
    Pressable,
    Modal,
    Switch,
  } from 'react-native';

// custom Logic
import {getAllMyRequests} from '../CustomLogic/data_api.js'
import { getCurrentActiveLanguage } from '../CustomLogic/globalSettings.js'

// get global funciton for translation
import { getTranslatedMessage } from '../CustomLogic/messages.js'

import { Cell, Section, TableView } from 'react-native-tableview-simple';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// The My Requests tab

/*
Read the comment from MakeARequestTab as the two are similiar
*/
const MyRequestsTabComponent = (props) => {
  var appInfoStore = props.appInfoStore
  const appInfo = appInfoStore.getState()
  const navigation = useNavigation()
  const  updateBadges = props.updateBadges

  // get some base information about the user and therefore waht to display
  const [refreshing, setRefreshing] = useState(false);
  const [errorDetected, setErrorDetected] = useState(false)
  const [errorDetails, setErrorDetails] = useState('')


  // holds the request obkect
  const [myRequests, setMyRequests] = useState('LOADING')

  // controls for the Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({})


 // Switch controls
  const [boolCompleted, setBoolCompleted] = useState(false);
  const toggleSwitch = () => {
    //helper function to toggle the switch
    setBoolCompleted(!boolCompleted) 
  }
    
 // go and get the data that we need
  const getRequiredData = React.useCallback(() => {
    setRefreshing(true);
        getAllMyRequests(appInfo, boolCompleted, function(err, api_return) {   
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
  }, [boolCompleted,appInfo]);
 
   

    const onRefresh = React.useCallback(() => {
      updateBadges() // needs the badges to update too!
      getRequiredData()
    }, [getRequiredData, updateBadges]);

    useEffect(() => {
      getRequiredData()
      const unsubscribe = navigation.addListener('focus', () => {
        updateBadges()
        getRequiredData()
      });
      return unsubscribe;
    }, [boolCompleted, getRequiredData, updateBadges, navigation]);
    
    if (errorDetected) {
      return (
        <View style={styles.container}>
          <StatusBar style = "dark"  />
          <SafeAreaView style={{height:"100%", backgroundColor: "#FFF"}}>
            <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <TableView style={{backgroundColor : "#FFF"}}>
                      <Section sectionPaddingTop={0} headerComponent={<CustomSectionHeader boolCompleted={boolCompleted} toggleSwitch={toggleSwitch}/>}>
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
          return (
              <View style={styles.container}>
                <StatusBar style = "dark"  />
                <SafeAreaView style={styles.mainView}>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
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
                        <Pressable
                          style={[modalStyles.button, modalStyles.buttonClose]}
                          onPress={() => setModalVisible(!modalVisible)}
                        >
                          <Text style={modalStyles.textStyle}>{getTranslatedMessage('hide_modal', appInfoStore)}</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>

                  <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                      <TableView style={{backgroundColor : "#FFF"}}>
                        <Section  sectionPaddingTop={0} headerComponent={<CustomSectionHeader boolCompleted={boolCompleted} toggleSwitch={toggleSwitch} />}>
                            {myRequests.data.map((item, i) => (
                                  <RequestCustomCell 
                                      {...props}
                                      key ={i.toString()}
                                      iterator = {i}
                                      onPress={() => {
                                        setModalContent(item)
                                        setModalVisible(!modalVisible)
                                      }}
                                      onPressDetailAccessory={() => {
                                        setModalVisible(!modalVisible)
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
                   </ScrollView>
              </SafeAreaView>
          </View>
          )
        }
      }
    }
  }


  // the custom header
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
  
  // the custom cell
  const RequestCustomCell = (props) => {
    var title = "";
    if (props.title == null) {
      title = 'UNKNOWN'
    } else {
      title = props.title
    }
    return (
        <Cell key={props.iterator}
            {...props}//
            accessory = "DisclosureIndicator"
            backgroundColor= {props.iterator % 2 == 0 ? "#ffff" : "#f4f3f4"}
            cellContentView = {
            <View style={{width: "95%", height: 100} }>
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
  
  // format date and time nicely
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
   
  //Styles
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
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

// export the custom tab for later use
export {MyRequestsTabComponent}




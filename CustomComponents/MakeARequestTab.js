// react status bar
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import { useNavigation } from '@react-navigation/native';


//standard react ocmponents
import { 
    TextInput, 
    Text,
    View, 
    SafeAreaView, 
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Button,
    Alert,
    Keyboard,
    Image
  } from 'react-native';

  // Global device setups

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

  // get global funciton for translation
  import { getTranslatedMessage } from '../CustomLogic/messages.js'


  // custom Logic
import {
  createANewRequst,
  getItemList,
  getUrgencyList
  } from '../CustomLogic/data_api.js'

  
// the connection tab
const MakeARequestTabComponent = (props) => {
  var appInfoStore = props.appInfoStore
  const appInfo = appInfoStore.getState()
  const navigation = useNavigation()

  const [descriptionText, onChangeDescriptionText] = useState("");
  
  const [buildingText, onChangeBuildingText] = useState("");
  const [urgencyText, onChangeUrgencyText] = useState("");


  const [buildingIndex, onChangeBuildingIndex] = useState("");
  const [urgencyId, onChangeUrgencyId] = useState("");

  const [pageDataLoaded, setPageDataLoaded] = useState(false)

   const [buildingArray, setBuildingArray] = useState([])
   const [buildingInfo, setBuildingInfo] = useState([])

   const [urgencyArray, setUrgencyArray] = useState([])

   const [errorDetected, setErrorDetected] = useState(false)
   const [errorDetails, setErrorDetails] = useState('')
    
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // The screen is focused
        // Call any action
        var appInfo = appInfoStore.getState()
        getUrgencyList(appInfo, function(err, urgencyReturnData) {
              if(err) {
                setErrorDetected(true)
                setErrorDetails(err.toString())
              } else {
                var urgencyArray = urgencyReturnData.message
                setUrgencyArray(urgencyArray)

                getItemList(appInfo, function(err, buildingReturnData) {
                  if(err) {
                    setErrorDetails(err.toString())
                    setErrorDetected(true)
                  } else {
                    var buildingDetails = buildingReturnData.message
                    var buidlingInfo = {}
                    var buildingArray = []
                    for (var i = 0; i < buildingDetails.data.length ; i++) {
                    buildingArray.push(buildingDetails.data[i].text_name)
                    buidlingInfo[buildingDetails.data[i].text_name] = buildingDetails.data[i].id
                    }
                    setBuildingInfo(buidlingInfo)
                    setBuildingArray(buildingArray)    
                    setPageDataLoaded(true)   
                  }
                })
            }
        })
      });
  
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, []);

    const submitForm = (navigation, appInfoStore) => {
      var okToSubmit = true
      if (okToSubmit) {
        if (!buildingText) {
          Alert.alert(getTranslatedMessage('make_request_no_building', appInfoStore))
          okToSubmit = false
        }
      }
      if (okToSubmit) {
        if (!urgencyText) {
          Alert.alert(getTranslatedMessage('make_request_no_urgency', appInfoStore))
          okToSubmit = false
        }
      }
      if (okToSubmit) {
        if (!descriptionText) {
          Alert.alert(getTranslatedMessage('make_request_no_description', appInfoStore))
          okToSubmit = false
        }
      }

      if (okToSubmit) {
        setPageDataLoaded(false)
        var buildingId = buildingInfo[buildingText]
        
        createANewRequst(appInfo, buildingText, buildingId, urgencyText, urgencyId, descriptionText, function(err, api_return) {  
          if (err) {
            setErrorDetails(err.toString())
            setErrorDetected(true)
        //   Alert.alert(err.toString())
           setPageDataLoaded(true)
          } else {
            setPageDataLoaded(true)
            if (api_return.error) {
              Alert.alert('ERROR: ' + api_return.message)
            } else {
              Alert.alert(api_return.message)
            }


            //set all varibales back to blank
            onChangeBuildingText("")
            onChangeUrgencyText("")
            onChangeBuildingIndex("")
            onChangeUrgencyId("")
            onChangeDescriptionText("")
            
            navigation.navigate(getTranslatedMessage('my_requests_tab',appInfoStore))
          
          }
      })
       
      }

    }


      if (pageDataLoaded) {
        return (
          <View style={styles.container}>
          <StatusBar style = "dark"  />
          <SafeAreaView style={{ backgroundColor: "#FFF"}}>
            <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.mainView}>
              <Text> {getTranslatedMessage('make_request_title', props.appInfoStore)}</Text>
              <View style={{ backgroundColor: "#FFF"}}>
              <Text style={formStyles.fieldTitle}>{getTranslatedMessage('make_request_building', props.appInfoStore)}</Text>
                <SelectDropdown
                    data={buildingArray}
                    defaultButtonText = {getTranslatedMessage('please_choose', props.appInfoStore)}
                    buttonStyle={formStyles.dropdownBtnStyle}
                    buttonTextStyle={formStyles.dropdownBtnTxtStyle}
                    onSelect={(selectedItem, index) => {
                      onChangeBuildingText(selectedItem)
                      onChangeBuildingIndex(index)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item
                    }}
                />
              </View>

              <View>
                <Text style={formStyles.fieldTitle}>{getTranslatedMessage('make_request_urgency', props.appInfoStore)}</Text>
                <SelectDropdown
                    data={urgencyArray}
                    defaultButtonText = {getTranslatedMessage('please_choose', props.appInfoStore)}
                    buttonStyle={formStyles.dropdownBtnStyle}
                    buttonTextStyle={formStyles.dropdownBtnTxtStyle}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index)
                      onChangeUrgencyText(selectedItem)
                      onChangeUrgencyId(index)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item
                    }}
                />
              </View>

              <View>
              <Text style={formStyles.fieldTitle}>{getTranslatedMessage('make_request_description', props.appInfoStore)}</Text>
                <TextInput
                  multiline={true}
                  numberOfLines = {10}
                  style={formStyles.descriptionField}
                  placeholder={getTranslatedMessage('make_request_description', props.appInfoStore)}
                  onChangeText= {onChangeDescriptionText}
                  value= {descriptionText}
                />
              </View>

              <Button
                  title={getTranslatedMessage('submit', appInfoStore)}
                  color="#f194ff"
                  onPress={() => submitForm(navigation, appInfoStore)}
                />
              </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </SafeAreaView>
        </View>
        );
      } else {

        if (errorDetected) {
          return (
            <View style={styles.container}>
            <StatusBar style = "dark"  />
            <SafeAreaView>
              <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
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
          return (
            <View style={styles.container}>
            <StatusBar style = "dark"  />
            <SafeAreaView style={styles.mainView}>
              <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
                <View style={[activityIndicatorStyles.container]}>
                  <ActivityIndicator size="large" color="#0000ff"  />
                </View> 
              </ScrollView>
            </SafeAreaView>
          </View>
          )
        }
       
      }

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
      backgroundColor: '#FFF',
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
  
  const formStyles = StyleSheet.create({
    fieldTitle : {
        fontSize : 15,
        fontWeight : "bold",
        marginTop: 20,
        marginBottom: 20,
    },
    dropdownBtnStyle: {
      width: "80%",
      height: 50,
      backgroundColor: "#FFF",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#444",
    },
    dropdownBtnTxtStyle: { 
      color: "#444", 
      textAlign: "left" 
    },
    descriptionField: {
      width: "80%",
      height: 250,
      backgroundColor: "#FFF",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#444",
    },
  });


  const activityIndicatorStyles = StyleSheet.create({
    container: {
      backgroundColor: '#FFF',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center' ,
      marginTop: 50,
    },
  });

// export the custom tab for later use
export {MakeARequestTabComponent}






// react status bar
import { StatusBar } from 'expo-status-bar';
import React, {useState } from 'react';

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
  } from 'react-native';

// custom Logic
import {getAllMyRequests} from '../CustomLogic/data_api.js'
import { getCurrentActiveLanguage } from '../CustomLogic/globalSettings.js'

// get global funciton for translation
import { getTranslatedMessage } from '../CustomLogic/messages.js'

import { Cell, Section, TableView } from 'react-native-tableview-simple';
import appInfoStore from '../CustomLogic/appInfoStore.js';


// the connection tab
const MyRequestsTabComponent = (props) => {
  var appInfoStore = props.appInfoStore
  const appInfo = appInfoStore.getState()
  const navigation = useNavigation()
  
  const [myRequests, setMyRequests] = useState('LOADING')
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllMyRequests(appInfo, function(err, api_return) {   
      if (err) {
       console.log(err)
       
      } else {
        console.log(api_return)
        setMyRequests(api_return)
        setRefreshing(false)
      }
  })
  }, []);

    React.useEffect(() => {
      getAllMyRequests(appInfo, function(err, api_return) {   
          if (err) {
           console.log(err)
           Alert.alert(err.toString() + JSON.stringify(appInfo))
          } else {
            console.log(api_return)
            setMyRequests(api_return)
          }
      })
    }, []);
    


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

    } else if (myRequests.error) {
      return (
        <View style={styles.container}>
        <StatusBar style = "dark"  />
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
              <Text>{getTranslatedMessage('generic_error', appInfoStore)}</Text>  
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
                  <Section header={getTranslatedMessage('my_requests_tab', props.appInfoStore)}>
                     
                            <RequestCustomCell {...props}
                            onPress={() => {
                              Alert.alert("Price",item.price)
                            }}
                            title="No Records Found"
                            submittedDateTime=""
                            urgency=""
                            building=""
                            >
                            </RequestCustomCell>
                   
                  </Section>
               </TableView>
               <Text>{JSON.stringify(myRequests)}</Text>
            
      
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
                    <Section header={getTranslatedMessage('my_requests_tab', props.appInfoStore)}>
                        {myRequests.data.map((item, i) => (
                              <RequestCustomCell {...props}
                              onPress={() => {
                                Alert.alert("Price",item.price)
                              }}
                              title={item.text_requesterName}
                              submittedDateTime={item.date_submittedDateTime}
                              urgency={item.int_urgency}
                              building={item.text_building}
                              >
                              </RequestCustomCell>
                        ))}
                    </Section>
                 </TableView>
                 <Text>{JSON.stringify(myRequests)}</Text>
              
        
            </ScrollView>
         </SafeAreaView>
        </View>
        )
      }
    }

  }

  const RequestCustomCell = (props) => {
    return (
        <Cell 
          {...props}//

          backgroundColor= "#FFF"
          cellContentView = {
            <View style={{width: "100%", height: 100} }>
              <Text>{props.title}</Text>
              <Text>{formatDateTimeNicely(props.appInfoStore, props.submittedDateTime)}</Text>
              <Text style={{position: 'absolute', bottom: 0, right: 0}}>{props.urgency}</Text>
              <Text style={{position: 'absolute', top: 0, right: 0}}>{props.building}</Text>
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


   const customCellStyles = StyleSheet.create({
  generalView : {
     paddingTop: 10, 
     paddingBottom: 50, 
     backgroundColor : "#ccc"
  },
  etaBubble : {
    backgroundColor : "#FFF",
    borderRadius : 75,
    paddingTop : 10,
    paddingBottom : 10,
    paddingLeft : 20,
    paddingRight : 20,
    justifyContent: "center",
    position : "absolute",
    right : 20,
    bottom: 20,
  },
  etaText : {
    color : "#000",
    fontWeight : "bold",
    fontSize : 15,
    justifyContent : "center",
    alignItems : "center"
  },
  tagLine : {
    position: "absolute",
    paddingTop : 5,
    bottom: 0,
    left : 5,
    color : "grey"
  },
  title : {
    color : "#000",
    fontWeight : "bold",
    fontSize : 22,
    marginTop : 5,
    position: "absolute",
    bottom: 20,
    left : 5,
    zIndex: 5,
    justifyContent : "center"
  },
  headerImage : {
    borderRadius : 10,
    width : 800 - 30,
  }
});

// export the custom tab for later use
export {MyRequestsTabComponent}




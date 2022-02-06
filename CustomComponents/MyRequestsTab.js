

// react status bar
import { StatusBar } from 'expo-status-bar';
import React, {useState } from 'react';

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
  } from 'react-native';

// custom Logic
import {getAllMyRequests} from '../CustomLogic/data_api.js'

// get global funciton for translation
import { getTranslatedMessage } from '../CustomLogic/messages.js'

import { Cell, Section, TableView } from 'react-native-tableview-simple';


// the connection tab
const MyRequestsTabComponent = (props) => {
  var appInfoStore = props.appInfoStore
  const appInfo = appInfoStore.getState()

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
           
          } else {
            console.log(api_return)
            setMyRequests(api_return)
          }
      })
    }, []);
    
    return (
        <View style={styles.container}>
        <StatusBar style = "dark"  />
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />}
            
            >
            {myRequests == 'LOADING' ? (
             <ActivityIndicator size="large" />
            ) : (
              <>
              <TableView style={{backgroundColor : "#ccc"}}>
              <Section
                header={getTranslatedMessage('my_requests_tab', props.appInfoStore)}
              >
            {myRequests.data.map((item, i) => (
                  <RequestCustomCell 
                  onPress={() => {
                    Alert.alert("Price",item.price)
                  }}
                  title={item.request_text_requesterName}>
               
                  </RequestCustomCell>
            ))}
            </Section>
          </TableView>
          <Text>{JSON.stringify(myRequests)}</Text>
              </>
            )}  
            </ScrollView>
        </SafeAreaView>
        </View>
    )    
  }

  const RequestCustomCell = (props) => {
    return (
        <Cell 
          {...props}
         
          backgroundColor= "#ccc"
          cellContentView = {
            <View>
              <Text>{props.title}</Text>
            </View>
          }
          />
        
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




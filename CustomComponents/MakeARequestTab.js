// react status bar
import { StatusBar } from 'expo-status-bar';
import React, {useState } from 'react';

//standard react ocmponents
import { 
    TextInput, 
    Text,
    View, 
    SafeAreaView, 
    StyleSheet,
    ScrollView,
    Dimensions,
  } from 'react-native';

  // Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// the connection tab
const MakeARequestTabComponent = (props) => {
  var appInfoStore = props.appInfoStore
  const appInfo = appInfoStore.getState()

  const [buildingText, onChangeBuildingText] = useState("");

      return (
        <View style={styles.container}>
        <StatusBar style = "dark"  />
        <SafeAreaView style={styles.mainView}>
          <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
            <View>
              <Text>Building</Text>
              <TextInput
                style={formStyles.input}
                placeholder="Bulding"
                onChangeText= {onChangeBuildingText}
                value= {buildingText}
              />
            </View>

           
            
          </ScrollView>
        </SafeAreaView>
      </View>
      );
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
  
  const formStyles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

// export the custom tab for later use
export {MakeARequestTabComponent}




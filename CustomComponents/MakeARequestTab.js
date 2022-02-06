

// react status bar
import { StatusBar } from 'expo-status-bar';

//standard react ocmponents
import { 
    Text, 
    View, 
    SafeAreaView, 
    StyleSheet,
    ScrollView,
  } from 'react-native';

  // Global device setupss

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// the connection tab
const MakeARequestTabComponent = (props) => {
  var appInfoStore = props.appInfoStore
  const appInfo = appInfoStore.getState()
      return (
        <View style={styles.container}>
        <StatusBar style = "dark"  />
        <SafeAreaView style={styles.mainView}>
          <ScrollView style={{height:"100%", backgroundColor: "#FFF"}}>
          <Text>make a request</Text>
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

// export the custom tab for later use
export {MakeARequestTabComponent}




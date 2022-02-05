
import { 
    Text, 
    View, 
    SafeAreaView, 
    StyleSheet,
  } from 'react-native';

const ErrorViewComponent = (props) => {
    const { appInfo } = useContext(props.appInfoContext);
    const navigation = useNavigation();
    return (
      <View style={noConnectionStyles.baseView}>
      <StatusBar style = "dark"  />
      <SafeAreaView>
          <Text style={errorStyles.errorText}>Oops looks like there was an error</Text>
      </SafeAreaView>
    </View>     
    ) 
  }


  const errorStyles = StyleSheet.create({
    errorText: {
      fontSize: 18,
      color: "#000",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    }
  })

  export {ErrorViewComponent}
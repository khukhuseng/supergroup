import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, SafeAreaView, Alert,Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import OneSignal from 'react-native-onesignal'
import Modal from "react-native-modal";
import Pdf from 'react-native-pdf';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from "react-native-elements";
import { Left } from "native-base";
import { responsiveFontSize, responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions";
import Loader from './components/Loader';
import NetInfo from "@react-native-community/netinfo";
import HTML_FILE from '../resources/index.html';

class Main extends Component {

    state = {
        url: '',
        OneSignalID: '',
        deviceID:'',
        pdfurl:'',
        isModalVisible: false,
        title : '',
        isLoading: true,
        webViewOpacity: 0,
        status:'',
        popupBrowser:'',
        //origin: 'https://supergroup.trip4asia.com/test.php',
        //session=07690e8efbe7ba39dcf0b7de4d7e50197e1e034f-14
        //
    }

    getStorage = async( ) => {
      var sessionvalue = await AsyncStorage.getItem('@session');
     
      console.log(" session value: "+ sessionvalue);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {

          if (Platform.OS == 'android') {
            if (sessionvalue) {
              this.setState({ url: 'https://supergroup-client.trip4asia.com/index.html' + "#" + sessionvalue + '+' + this.state.deviceID });
            }else{
              this.setState({ url: 'https://supergroup-client.trip4asia.com/index.html#uuid=' + this.state.deviceID });
            }
          }else{

            if (sessionvalue) {
              this.setState({ url: 'https://supergroup-client.trip4asia.com/index.html' + "#" + sessionvalue + '+' + this.state.deviceID });
            }else{
              this.setState({ url: 'https://supergroup-client.trip4asia.com/index.html#uuid=' + this.state.deviceID });
            }

          }

        } else {
         
          if (Platform.OS == 'android') {
            if (sessionvalue) {
              this.setState({ url: 'file:///android_asset/index.html' + "#" + sessionvalue + '+' + this.state.deviceID });
            }else{
              this.setState({ url: 'file:///android_asset/index.html#uuid=' + this.state.deviceID });
            }
          }else{

              this.setState({ status: 'iosnointernet' });

          }

        }
      })

      

      if (Platform.OS == 'android') {

      }else{

        if (sessionvalue) {
          this.setState({ url: 'file:///android_asset/index.html' + "#" + sessionvalue + '+' + this.state.deviceID });
        }else{
          this.setState({ url: 'file:///android_asset/index.html#uuid=' + this.state.deviceID });
        }

      }

    }

    toggleModal = () => {
      this.setState({isModalVisible: !this.state.isModalVisible});
    };

    componentDidMount = async () => {
      
      var UUID = await AsyncStorage.getItem('@deviceID');
      if (UUID){
        this.setState({deviceID: UUID});
      }else{
        AsyncStorage.setItem('@deviceID', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
        //console.log('NO Serial : ' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
        this.setState({deviceID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)});
        this.props.dispatch({
          type: "LOGIN",
          deviceID: this.state.deviceID,
        });
      }

      this.getStorage();

      OneSignal.init("563bcfa1-1736-41d2-9b60-f623ad6bc540");
      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      await OneSignal.addEventListener('ids', this.onIds.bind(this));
        //this.setState({ url: 'file:///android_asset/index.html#session=07690e8efbe7ba39dcf0b7de4d7e50197e1e034f-14' });
        //this.setState({ url: 'file:///android_asset/index.html' });
        
    }

    componentWillUnmount() {
      OneSignal.removeEventListener('ids', this.onIds);
    }

    async onIds(device) {
      this.setState({ OneSignalID: device.userId });
      var sessionvalue2 = await AsyncStorage.getItem('@session');

      fetch('https://supergroup-app.trip4asia.com/api/agent/update_onesignal_device_id.php', {
       method: "POST",
       headers: new Headers({
           "Content-Type": "application/x-www-form-urlencoded", // <-- Specifying the Content-Type
       }),
       body: 'onesignal_device_id=' + this.state.OneSignalID + '&device_id=' + this.state.deviceID + "&session=" +  sessionvalue2  // <-- Post parameters
       })
       .then(response => response.json())
       .then(responseJson => {
         
       })
       .catch(error => {
           console.error(error);   
       });

      
    }

    _onMessage = (event: Event) => {
      
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
        } else {
          Alert.alert(
            "Error",
            "There is no internet connection.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        }
      })

       
        let arrayData = JSON.parse(event.nativeEvent.data);
        var str = arrayData.action;
        console.log('log:' + arrayData.action )
        if (str != null){
          if (str == 'logout'){
            //console.log('logout')
            AsyncStorage.clear();
            this.props.dispatch({ type: 'LOGOUT' });
          }else{

            this.setState({ isLoading: true });
            if (str.substring(0, 10) == 'windowopen' ){
              
             var titleposition = str.indexOf('@+@'); 
             var urlpopup = str.substring(11, titleposition)
             var param = str.substring(titleposition + 3, str.length)
             //console.log("fullurl : " + str + " ,path : " + urlpopup + " ,param : " + param);
             this.setState({ pdfurl: urlpopup });
             this.setState({isModalVisible: true});
             this.setState({ title: param });
             this.setState({ isLoading: false });
            }else{

              if (str.substring(0, 11) == 'browseropen'){
                var titleposition = str.indexOf('@+@'); 
                var popupBrowser = str.substring(12, titleposition)
                //Linking.openURL(popupBrowser);
                console.log(popupBrowser);
                Linking.openURL(popupBrowser);
              
              }else{
                this.props.dispatch({
                  type: "LOGIN",
                  //agentID: '',
                  session: str,
                });
                AsyncStorage.setItem('@session', str);
                this.setState({ isLoading: false });
              }
            }
          }

        }

       
        //this.setState({ url: 'file:///android_asset/index.html' + "#" + arrayData });

        //this.props.dispatch({ type: 'LOGOUT' });
      };

    render() {

      let urlpdf = this.state.pdfurl;

      return (
        <SafeAreaView style={{flex:1}} forceInset={{bottom:0}}>
            {/* <Loader loading={this.state.isLoading} text={'Loading'} /> */}
        {this.state.url != null ? (
          <View style={{flex:1,backgroundColor: 'purple',overflow:'hidden'}}>
          <WebView
          source={ this.state.status == 'iosnointernet' ? HTML_FILE :  { uri: this.state.url }  }
          startInLoadingState={true} 
          javaScriptEnabled={true}
          allowFileAccess={true}
          allowsFullscreenVideo={true}
          onMessage={this._onMessage}
          // onLoadStart={event => {
          //   this.setState({
          //       isLoading: true
          //   })
          // }}
          // onLoadEnd={event => {
          //     this.setState({
          //         isLoading: false,
          //         webViewOpacity: 1
          //     });
          // }}
          />
          <Modal isVisible={this.state.isModalVisible} style={styles.modal}  >
          <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
          <View style={styles.viewstyle}>
          <LinearGradient
            colors={['#3fa4e8','#3fa4e8','#2e4f8b']}
            style={[StyleSheet.absoluteFill]}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
          >
          </LinearGradient>
          <View style={{flexDirection: 'row', alignItems:'center'}} >
              <View style={{ flex: 1, alignItems:'flex-start',paddingLeft:responsiveWidth(5),paddingTop:15}}>
                  <Icon name='chevron-left' type='font-awesome' color='#fff'
                    onPress={()=>this.toggleModal()}
                    size={responsiveFontSize(3)}
                    underlayColor={'transparent'}
                    />
              </View>
              <View style={{ flex: 1, alignItems:'center',paddingTop:15}}>
                    <Text style={{ fontSize:20,fontWeight:'bold',color:'white'}} >{this.state.title}</Text>
              </View>
              <View style={{ flex: 1, justifyContent:'flex-end',flexDirection: 'row'}}>
          </View>
          </View> 
          <Pdf
                  source={{ uri: `${urlpdf}` }}
                  onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page, numberOfPages) => {
                      console.log(`current page: ${page}`);
                  }}
                  onError={(error) => {
                      console.log(error);
                  }}
                  onPressLink={(uri) => {
                      console.log(`Link presse: ${uri}`)
                  }}
                  style={styles.pdf} />
          </View>  
          </Modal>
      </View>
        ) : null}       
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  viewstyle:{
    backgroundColor:'white',
    height: Dimensions.get('window').height,
  },
  pdf: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
  },
  headerLeftContainer:{
    width: responsiveWidth(15),
    justifyContent: "center",
    alignItems: 'flex-start',
    paddingLeft: responsiveWidth(3)
},
  headerTitle:{
     height: responsiveHeight(20)
  },
});

const mapStateToProps = state => {
    const { auth } = state;

    return {
        session: auth.session,
       
    };
};

export default connect(mapStateToProps)(Main);
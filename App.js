
import React, { Component } from 'react';
import {
  BackHandler,
  Alert
} from 'react-native';
import Main from './src';
import { Provider as StoreProvider } from 'react-redux'
import { configureStore } from './src/store'
import codePush from "react-native-code-push"

const store = configureStore();

class App extends Component<Props>{

    componentDidMount = async () => {
      codePush.sync({
        // updateDialog: {
        //   title: "New Update",
        //   mandatoryUpdateMessage: "An update is available that must be installed.",
        //   mandatoryContinueButtonLabel: "Update"
        // },
        installMode: codePush.InstallMode.IMMEDIATE
      });

      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
      Alert.alert(
        'Exit App',
        'Are you sure to exit App?',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
    );
    return true;
        //ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        //return true;
        //this.setState({ url: this.state.origin + '#1234' });
    }

    render() {
      return (
        <StoreProvider store={store}>
          <Main />
        </StoreProvider>
      )
    }

};

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
App = codePush(codePushOptions)(App);
export default App;


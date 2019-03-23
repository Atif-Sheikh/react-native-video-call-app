import React, { Component } from 'react';
import { StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { Container } from 'native-base';
import Routes from './src/routes';
import { Provider } from 'react-redux';
import {store} from './src/store/index';

export default class App extends Component{
  render() {
    return (
      <Provider store={store}>
          {/* <TouchableWithoutFeedback onPress={()=>{window.onBodyPress()}} >   */}
        <Container>
          <Routes />
        </Container>
          {/* </TouchableWithoutFeedback> */}
        
      </Provider>  
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

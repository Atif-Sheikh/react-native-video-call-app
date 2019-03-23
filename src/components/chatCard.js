import React, { Component } from 'react';
import { Image, Dimensions, ScrollView } from 'react-native';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
// import red from '../images/red.png';
// import green from '../images/green.png';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import { screenHeight, Styles } from "../config";

export default class ChatCard extends Component {
  render() {
    const { userName, online, photo, Uid, deviceToken } = this.props.item;
    // let onlineOffline;
    // if(typeof(online) === "number"){
    //   onlineOffline = moment(online).fromNow();
    // }else{
    //   if(online){
    //     return onlineOffline = 'online';
    //   }else if(!online){
    //     return onlineOffline = 'offline';
    //   }
    // }
    return (
        <List>
          <ListItem style={{ height: screenHeight / 12 }} onPress={() => Actions.chatRoom({ name: userName, online, Uid, deviceToken })} avatar>
            <Thumbnail small source={photo ? { uri: photo } : require('../images/face.jpg')} />
            <Body style={{ height: screenHeight / 12,justifyContent:"center" }}>
              <Text style={{ fontSize: Styles.fonts.regular,fontFamily:Styles.fonts.Bold }}>{userName}</Text>
            </Body>
            <Right style={{ marginLeft: -15,justifyContent:"center" }}>
              {/* <Image style={{width: fontScale*}} src={green} /> */}
              <Text style={{fontFamily:Styles.fonts.Normal}} note>{typeof (online) == "number" ? moment(online).fromNow() : 'online'}</Text>
            </Right>
          </ListItem>
        </List>
    );
  };
};
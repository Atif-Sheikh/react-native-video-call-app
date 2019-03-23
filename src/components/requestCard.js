import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button, Item } from 'native-base';
import { Styles, screenWidth, screenHeight } from "../config";
export default class RequestCard extends Component {
  render() {
    // console.log(this.props.item);
    const { name, mutualFriends } = this.props.item;
    return (
      <Content>
        <List>
          <ListItem avatar style={{ flexDirection: "row", justifyContent: "space-around", width: screenWidth/1.1,alignSelf:"center",height:screenHeight/8,marginBottom:7,marginTop:7 }}>
            <View style={{ width: "20%",height:screenHeight/7,justifyContent:"center",alignItems:"center" }}>
              <Thumbnail source={require('../images/face.jpg')} style={{borderWidth:2,borderColor:"grey"}} />
            </View>
            <View style={{ width: "80%",padding:10 }}>
              <View style={{alignSelf:"flex-start"}}>
                <Text>{name}</Text>
                <Text note>{mutualFriends} mutual Friend</Text>
              </View>
              <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row"}}>
                <Button style={{ width: '47%', height: 30, backgroundColor: Styles.theme.buttonBackgroundColor,alignItems:"center" }}>
                <Text style={{ color: Styles.theme.buttonTextColor, fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h3 }}> Accept </Text>
                </Button>
                <Button style={{ width: '47%', height: 30,borderWidth:1,borderColor:"grey",alignItems:"center" }} iconRight transparent light>
                  <Text style={{ color: 'grey',alignSelf:"center",fontFamily:Styles.fonts.Bold,fontSize:Styles.fonts.h3 }}> Decline </Text>
                </Button>
              </View>
            </View>
          </ListItem>
        </List>
      </Content>
    );
  };
};

const styles = StyleSheet.create({
});

import React, { Component } from 'react';
import { Image, Dimensions, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text,
  Button, Icon, Left, Body, Right, Item, View, Badge, Title
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import firebase from 'react-native-firebase';
import Sound from 'react-native-sound';
import { screenHeight, screenWidth, fontScale, Styles } from "../config"
import { user } from 'firebase-functions/lib/providers/auth';
const { height, width } = Dimensions.get('window');

const whoosh = new Sound('thumbsup.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
});

export default class CardsItem extends Component {
  constructor() {
    super();
    this.state = {
      like: false,
      modalVisible: false
    };
  };
  _onLike = (likes) => {

    this.setState({ like: !this.state.like }, () => {
      if (!this.state.like) {
        firebase.database().ref(`/status/${this.props.pushKey}`).update({ likes: likes - 1 })
          .then(() => {
            firebase.database().ref(`/status/${this.props.pushKey}/${this.props.Uid}`).remove();
          })
          .catch(() => {
            this.setState({ like: !this.state.like });
          })
      } else {
        // whoosh.setVolume(0.4);
        whoosh.play((success, error) => {
          if (success) {
            // alert(success)
            console.log('successfully finished playing');
          } else {
            // alert('error')

            console.log('playback failed due to audio decoding errors');
            // reset the player to its uninitialized state (android only)
            // this is the only option to recover after an error occured and use the player again
            whoosh.reset();
          }
        });
        firebase.database().ref(`/status/${this.props.pushKey}`).update({ likes: likes + 1 })
          .then(() => {
            firebase.database().ref(`/status/${this.props.pushKey}/${this.props.Uid}`).update({ like: true });
          })
          .catch(() => {
            this.setState({ like: !this.state.like });
          })
      }
    })
  };
  componentDidMount() {
    let obj = this.props.item;
    for (let key in obj) {
      if (key == this.props.Uid) {
        this.setState({ like: true });
        break;
      }
    }
  };
  openModel = () => {
    return <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={() => {
        this.setState({ modalVisible: false })
      }}>
      <View style={{ height: screenHeight }}>
        <Header style={{ backgroundColor: Styles.theme.headerBackgroundColor }}>
          <Left>
            <Button onPress={() => {
              this.setState({ modalVisible: false }, () => {
                Actions.pop()
              })
            }} transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: Styles.theme.headerTextColor, fontFamily: Styles.fonts.BoldItalic }}>Post Details</Title>
          </Body>
        </Header>
      </View>
    </Modal>
  }
  render() {
    // console.log(this.props.item);
    const { time, likes, comments, title, shares, postType, photo, name, coveredContent,userPhoto } = this.props.item;
    return (
      <Card>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
          <View style={{ height: screenHeight }}>
            <Header style={{ backgroundColor: Styles.theme.headerBackgroundColor }}>
              <Left>
                <Button onPress={() => {
                  this.setState({ modalVisible: false })
                }} transparent>
                  <Icon name='arrow-back' />
                </Button>
              </Left>
              <Body>
                <Title style={{ color: Styles.theme.headerTextColor, fontFamily: Styles.fonts.BoldItalic }}>Post Details</Title>
              </Body>
            </Header>
            {/* <ScrollView style={{flex:1,paddingTop:10,backgroundColor:"black"}}> */}
            <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", paddingTop: 5, backgroundColor: "#000000" }}>
              <View style={{ height: "70%", width: screenWidth }}>
                <Image source={photo ? { uri: photo } : require('../images/home.jpg')} resizeMode="contain" style={{ height: "100%", width: "100%" }} />
              </View>
              <View style={{ height: "30%" }}>
                <View style={{ height: "60%", width: "100%", padding: 15, paddingTop: 5 }}>
                  <Text style={{ color: "#fff", maxWidth: "90%", fontFamily: Styles.fonts.Normal }} numberOfLines={3}>{coveredContent}</Text>
                </View>
                <View style={{ height: "40%", width: "100%", justifyContent: "space-around", flexDirection: "row", borderTopWidth: 0.5, borderTopColor: "grey", paddingBottom: 20 }}>
                  <TouchableOpacity onPress={() => this._onLike(likes)} style={{ height: "100%", width: "50%", justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="thumbs-up" style={{ color: this.state.like ? "#0291D4" : "#fff", paddingRight: 5 }} />
                    <Text style={{ color: this.state.like ? "#0291D4" : "#fff", fontFamily: Styles.fonts.Normal }}>Like</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.setState({ modalVisible: false }, () => {
                      Actions.message({ pushKey: this.props.pushKey, comments: comments })
                    })
                  }}
                    style={{ height: "100%", width: "50%", justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="chatboxes" style={{ color: "#fff", paddingRight: 5 }} />
                    <Text style={{ color: "#fff", fontFamily: Styles.fonts.Normal }}>Comment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <CardItem>
          <Left>
            {
              // photo && <Thumbnail style={{ width: width / 10, height: height / 18 }} source={{ uri: photo }} /> 
              <Thumbnail small circular style={{ borderWidth: 2, borderColor: Styles.theme.borderColor }} source={userPhoto ? { uri: userPhoto } : require('../images/face.jpg')} />
            }
            <Body>
              <Text style={{ fontSize: Styles.fonts.h2, color: Styles.theme.textColor, fontFamily: Styles.fonts.BoldItalic }}>{name}</Text>
              <Text style={{ fontSize: Styles.fonts.regular, fontFamily: Styles.fonts.Normal, color: Styles.theme.textColor }} note>{moment(time).fromNow()}</Text>
            </Body>
          </Left>
          <Right>
            {/* {
              postType == 'Tip' ? <Thumbnail style={{ width: width / 8, height: height / 20, marginTop: -height / 40 }} source={require('../images/tip.png')} />
                : <Thumbnail style={{ width: width / 4, height: height / 14, marginTop: -height / 40 }} source={require('../images/update.png')} />
            } */}
            <Text style={{ marginTop: -screenHeight / 40, fontFamily: Styles.fonts.BoldItalic, color: Styles.theme.textColor }}>{postType}</Text>
          </Right>
        </CardItem>
        <CardItem>
          <Text style={{ fontSize: Styles.fonts.h3, flex: 1, color: Styles.theme.textColor, fontFamily: Styles.fonts.Bold }}>{title}</Text>
          {/* <Text style={{ fontSize: 12, flex: 1, color: 'purple' }}>{coveredContent && coveredContent}</Text> */}
        </CardItem>
        <CardItem cardBody >
          <TouchableOpacity onPress={() => this.setState({ modalVisible: true })} style={{ height: screenHeight / 3, width: screenWidth }}>
            <Image source={photo ? { uri: photo } : require('../images/home.jpg')} style={{ height: "100%", width: "100%", flex: 1 }} />
          </TouchableOpacity>
        </CardItem>
        {/* <CardItem cardBody>
          {photo && <Thumbnail source={{ uri: photo }} style={{ height: "100%", width: "100%" }} />}
        </CardItem> */}
        <CardItem style={{ flex: 1 }}>
          {/* <Text style={styles.reactionStyle}>{likes} likes</Text>
          <Text style={styles.reactionStyle}> {comments} Comments</Text> */}
          {/* <Text style={{ fontSize: fontScale * 10, color: 'purple', marginRight: 10 }}> {shares} Shares</Text> */}
        </CardItem>
        <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor: Styles.theme.backgroundColor, height: screenHeight / 10, alignItems: "center" }}>
          <TouchableOpacity style={styles.actionDiv} onPress={() => this._onLike(likes)}>
            {/* <Badge danger style={{ top: 4 }}>
              <Text>{likes}</Text>
            </Badge> */}
            <Icon name="thumbs-up" style={{ fontSize: Styles.fonts.h1, color: this.state.like ? "blue" : Styles.theme.normalColor, }} />
            <Text style={{ color: this.state.like ? "blue" : Styles.theme.normalColor, fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h3, paddingLeft: 10 }}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionDiv} onPress={() => Actions.message({ pushKey: this.props.pushKey, comments: comments })}>
            {/* <Badge danger style={{ top: 4 }}>
              <Text>{comments}</Text>
            </Badge> */}
            <Icon name="chatboxes" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>Comment</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionDiv}>
            <Badge danger style={{ top: 4 }}>
              <Text>{comments}</Text>
            </Badge>
            <Icon name="share" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity> */}
        </View>
      </Card >
    );
  };
};
const styles = StyleSheet.create({
  reactionStyle: {
    fontSize: Styles.fonts.regular,
    color: Styles.theme.textColor,
    marginRight: 10,
    fontFamily: Styles.fonts.Bold
  },
  actionDiv: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: screenHeight / 10
  },
  actionButtonIcon: {
    fontSize: Styles.fonts.h1,
    color: Styles.theme.normalColor,
  },
  actionButtonText: {
    color: Styles.theme.normalColor,
    fontFamily: Styles.fonts.Bold,
    fontSize: Styles.fonts.h3,
    paddingLeft: 7
  }
})
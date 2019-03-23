import React, { Component } from 'react';
import { Content, List, Text, Item, Input, Icon, Header, Left, Button, Body, Title, Right } from 'native-base';
import { View, StyleSheet, ListView, Modal, Platform, TouchableOpacity, Keyboard, Dimensions, Thumbnail, FlatList } from "react-native";
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { DataAction, AuthAction } from '../store/action';
import firebase from 'react-native-firebase';
import moment from 'moment';
import { Loader } from "./";
import AutoScroll from 'react-native-auto-scroll';
import InCallManager from 'react-native-incall-manager';
import { screenHeight, screenWidth, Styles } from "../config";
// import webrtc from 'react-native-webrtc';
// const { RTCPeerConnection } = webrtc;
let { fontScale, height, width } = Dimensions.get('window');
// var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'beaver','username': 'atifsiddiquissg@gmail.com'}]};
// var pc = new RTCPeerConnection(servers);
//=========================== New Code ==============================//

import io from 'socket.io-client';
var {
    mapHash,
    leave,
    saveCompReference,
    RTCView,
    _press,
    _switchVideoType,
    callUser
} = require('../config/webRtc.js');

import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    // RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
        this.state = {
            messages: [],
            message: '',
            path: '',
            modal: false,
            info: 'Initializing',
            status: 'init',
            roomID: '',
            isFront: false,
            selfViewSrc: null,
            remoteList: {},
            textRoomConnected: false,
            textRoomData: [],
            textRoomValue: '',
            loudspeaker: false,
            incoming: false,
            fetched: false,
            callType: ""
        }
        // saveCompReference(this);
        // props.listenUser()
    };
    static navigationOptions = {
        header: null
    };
    componentWillMount() {
        // container = this;
        // console.log('thisssssss');
    };
    componentWillUpdate() {
        container = this;
    };
    // componentWillReceiveProps(props){
    //     if(props.chat){
    //         // console.warn("Aaaaaa",props.chat)
    //         // console.warn(Object.values(props.chat))
    //         let data = props.chat;
    //         let messages = [];
    //         for(let key in data){
    //             // let newData = data[key];
    //             // for(let key1 in newData){
    //                 messages.push(data[key]);
    //             // }
    //         }
    //         // messages.sort(function(a,b){
    //         //     return b.time>a.time; 
    //         //     })
    //         //     console.log(data)
    //         // messages.sort((a, b) => b.time > a.time);
    //         messages.sort(function(a, b){return a.time - b.time});
    //         this.setState({messages});
    //     }
    // };
    onPress = () => {
        let msg = this.state.message;
        if (msg) {
            if (this.props.navigation.state.params.deviceToken) {
                fetch('https://us-central1-education-28e24.cloudfunctions.net/chatNotification', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: this.props.user.userName, deviceToken: this.props.navigation.state.params.deviceToken, message: this.state.message })
                }).then(() => {
                    console.log('success');
                })
                    .catch((err) => {
                        console.log('error');
                    })
            }
            let path = this.props.user.Uid + this.props.navigation.state.params.Uid;
            path = path.split('').sort().join('');
            let obj = {
                name: this.props.user.userName,
                msg,
                path,
                email: this.props.user.email,
                photo: this.props.user.photo,
                time: Date.now(),
            }
            this.props.sendMessage(obj);
            Keyboard.dismiss();
            this.setState({ message: '' });
        }
    };
    componentDidMount() {
        let path = this.props.user.Uid + this.props.navigation.state.params.Uid;
        path = path.split('').sort().join('');
        this.setState({ path }, () => {
            firebase.database().ref(`/chatMessages/${path}`).on('value', snap => {
                let messages = [];
                let data = snap.val();
                console.log(data);
                for (let key in data) {
                    messages.push(data[key]);
                }
                // messages.sort((a, b) => b.time > a.time);
                // console.log(messages, 'before');
                messages = messages.sort((a, b) => a.time - b.time);
                // console.log(messages, 'after');            
                this.setState({ messages, fetched: true });
            })
        })
        if (InCallManager.recordPermission !== 'granted') {
            InCallManager.requestRecordPermission()
                .then((requestedRecordPermissionResult) => {
                    console.log("InCallManager.requestRecordPermission() requestedRecordPermissionResult: ", requestedRecordPermissionResult);
                })
                .catch((err) => {
                    console.log("InCallManager.requestRecordPermission() catch: ", err);
                });
        }
    };
    _press = () => {
        let uid = this.props.navigation.state.params.Uid;
        this.setState({ modal: true, status: 'connect', info: 'Connecting' }, () => {
            InCallManager.start({ media: 'audio', auto: true, ringback: '_DTMF_' });
            // InCallManager.setForceSpeakerphoneOn(true);
        });
        // firebase.database().ref(`users/${uid}`).update({ call: true });
    };


    // showFriendsFace = () => {
    //     pc.createOffer()
    //       .then(offer => pc.setLocalDescription(offer) )
    //       .then(() => sendMessage('yourId', JSON.stringify({'sdp': pc.localDescription})) );
    // };
    // showMyFace = () => {
    //     navigator.mediaDevices.getUserMedia({audio:true, video:true})
    //       .then(stream => yourVideo.srcObject = stream)
    //       .then(stream => pc.addStream(stream));
    // };
    // sendMessage = (senderId, data) => {
    //     var msg = firebase.database().ref(`/chatMessages/${this.state.path}`).push({ sender: senderId, video: data });
    //     msg.remove();
    // };
    render() {
        let { name, online, Uid, } = this.props.navigation.state.params;
        return (
            <View style={style.container} >
                <Header style={{ backgroundColor: Styles.theme.backgroundColor }}>
                    <Left>
                        <Button onPress={() => Actions.pop()} transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>{name}</Title>
                    </Body>
                    <Right style={{ paddingLeft: 20 }}>
                        <TouchableOpacity onPress={() => {
                            callUser(Uid, firebase.auth().currentUser.uid, "video")
                            _press(firebase.auth().currentUser.uid + Uid)
                        }}>
                            <Icon name='videocam' style={{ color: '#fff', marginRight: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            callUser(Uid, firebase.auth().currentUser.uid, "audio")
                            _press(firebase.auth().currentUser.uid + Uid)
                        }}>
                            <Icon name='call' style={{ color: '#fff', marginRight: 20 }} />
                        </TouchableOpacity>
                    </Right>
                </Header>
                <AutoScroll>
                    {this.state.messages && this.state.messages.map((val, ind) => {
                        return (
                            <View key={ind}>
                                <View
                                    style={(val.email && val.email === this.props.user.email) ?
                                        {
                                            width: 200,
                                            borderRadius: 10,
                                            margin: 2,
                                            padding: 8,
                                            backgroundColor: Styles.theme.backgroundColor,
                                            alignSelf: "flex-end",
                                        }
                                        :
                                        {
                                            backgroundColor: "#B2CBBF",
                                            marginTop: 2,
                                            width: 200,
                                            borderRadius: 10,
                                            margin: 2,
                                            padding: 8,
                                            alignSelf: "flex-start"
                                        }} >
                                    <Text
                                        style={(val.email && val.email) === this.props.user.email ?
                                            { color: "#fff", fontFamily: Styles.fonts.Normal } :
                                            { color: "#a10000", fontFamily: Styles.fonts.Normal }}
                                    >{val.msg}</Text>
                                    <Text style={{ fontSize: Styles.fonts.medium, fontFamily: Styles.fonts.Normal, color: Styles.theme.textColor }} note>{moment(val.time).fromNow()}</Text>
                                </View>
                            </View>
                        )
                    })}
                    {!this.state.fetched && <View style={{ height: screenHeight, width: screenWidth, justifyContent: "center", alignItems: "center" }}><Loader /></View>}
                    {!this.state.messages.length && this.state.fetched ? <Text style={{ alignSelf: 'center', justifyContent: 'center', color: 'grey', fontFamily: Styles.fonts.Italic, marginTop: 30 }}>No Message</Text> : null}
                </AutoScroll>
                <Item style={{ width: '100%', height: screenHeight / 12 }} regular>
                    <Input
                        value={this.state.message}
                        onChangeText={message => this.setState({ message })}
                        style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, width: "80%" }}
                        placeholder='Write your Message here'
                    />
                    <TouchableOpacity onPress={this.onPress} style={{ justifyContent: "center", width: "20%", alignItems: "center" }}>
                        <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h2 }}>Send</Text>
                    </TouchableOpacity>
                </Item>
            </View >
        );
    };
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    commentContainer: {
        flex: 2,
        backgroundColor: "green"
    }
});

const mapStateToProp = (state) => {
    return ({
        user: state.AuthReducer.user,
        chat: state.DataReducer.chat,
        // messagesList: state.root,
        // currentUserobj: state.root
    });
};
const mapDispatchToProp = (dispatch) => {
    return {
        sendMessage: (obj) => {
            dispatch(DataAction.SendMessage(obj))
        },
        getChat: (path) => {
            dispatch(DataAction.GetChat(path))
        },
        listenUser: () => {
            dispatch(AuthAction.listUser())
        }
    };
};


export default connect(mapStateToProp, mapDispatchToProp)(ChatRoom);

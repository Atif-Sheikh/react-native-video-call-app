import React, { Component } from 'react';
import { Content, List, Text, Item, Input, Icon, Header, Left, Button, Body, Title, Right } from 'native-base';
import { View, StyleSheet, ListView, Modal, Platform, TouchableOpacity, Keyboard, Dimensions, Thumbnail, FlatList } from "react-native";
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { DataAction } from '../store/action';
import firebase from 'react-native-firebase';
import moment from 'moment';
import AutoScroll from 'react-native-auto-scroll';
// import webrtc from 'react-native-webrtc';
// const { RTCPeerConnection } = webrtc;
let { fontScale, height, width } = Dimensions.get('window');
// var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'beaver','username': 'atifsiddiquissg@gmail.com'}]};
// var pc = new RTCPeerConnection(servers);
//=========================== New Code ==============================//

import io from 'socket.io-client';

const socket = io.connect('https://react-native-webrtc.herokuapp.com', { transports: ['websocket'] });

import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';
const configuration = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'beaver','username': 'atifsiddiquissg@gmail.com'}]};

// const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

const pcPeers = {};
let localStream;
//============================== xxx ================================//
function getLocalStream(isFront, callback) {

    let videoSourceId;

    // on android, you don't have to specify sourceId manually, just use facingMode
    // uncomment it if you want to specify
    if (Platform.OS === 'ios') {
        MediaStreamTrack.getSources(sourceInfos => {
            console.log("sourceInfos: ", sourceInfos);

            for (const i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }
        });
    }
    getUserMedia({
        audio: true,
        video: {
            mandatory: {
                minWidth: 640, // Provide your own width, height and frame rate here
                minHeight: 360,
                minFrameRate: 30,
            },
            facingMode: (isFront ? "user" : "environment"),
            optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
        }
    }, function (stream) {
        console.log('getUserMedia success', stream);
        callback(stream);
    }, logError);
}

function join(roomID) {
    socket.emit('join', roomID, function (socketIds) {
        console.log('join', socketIds);
        for (const i in socketIds) {
            const socketId = socketIds[i];
            createPC(socketId, true);
        }
    });
}

function createPC(socketId, isOffer) {
    const pc = new RTCPeerConnection(configuration);
    pcPeers[socketId] = pc;

    pc.onicecandidate = function (event) {
        console.log('onicecandidate', event.candidate);
        if (event.candidate) {
            socket.emit('exchange', { 'to': socketId, 'candidate': event.candidate });
        }
    };

    function createOffer() {
        pc.createOffer(function (desc) {
            console.log('createOffer', desc);
            pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', pc.localDescription);
                socket.emit('exchange', { 'to': socketId, 'sdp': pc.localDescription });
            }, logError);
        }, logError);
    }

    pc.onnegotiationneeded = function () {
        console.log('onnegotiationneeded');
        if (isOffer) {
            createOffer();
        }
    }

    pc.oniceconnectionstatechange = function (event) {
        console.log('oniceconnectionstatechange', event.target.iceConnectionState);
        if (event.target.iceConnectionState === 'completed') {
            setTimeout(() => {
                getStats();
            }, 1000);
        }
        if (event.target.iceConnectionState === 'connected') {
            createDataChannel();
        }
    };
    pc.onsignalingstatechange = function (event) {
        console.log('onsignalingstatechange', event.target.signalingState);
    };

    pc.onaddstream = function (event) {
        console.log('onaddstream', event.stream);
        container.setState({ info: 'One peer join!' });

        const remoteList = container.state.remoteList;
        remoteList[socketId] = event.stream.toURL();
        container.setState({ remoteList: remoteList });
    };
    pc.onremovestream = function (event) {
        console.log('onremovestream', event.stream);
    };

    pc.addStream(localStream);
    function createDataChannel() {
        if (pc.textDataChannel) {
            return;
        }
        const dataChannel = pc.createDataChannel("text");

        dataChannel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
        };

        dataChannel.onmessage = function (event) {
            console.log("dataChannel.onmessage:", event.data);
            container.receiveTextData({ user: socketId, message: event.data });
        };

        dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
            container.setState({ textRoomConnected: true });
        };

        dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
        };

        pc.textDataChannel = dataChannel;
    }
    return pc;
}

function exchange(data) {
    const fromId = data.from;
    let pc;
    if (fromId in pcPeers) {
        pc = pcPeers[fromId];
    } else {
        pc = createPC(fromId, false);
    }

    if (data.sdp) {
        console.log('exchange sdp', data);
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            if (pc.remoteDescription.type == "offer")
                pc.createAnswer(function (desc) {
                    console.log('createAnswer', desc);
                    pc.setLocalDescription(desc, function () {
                        console.log('setLocalDescription', pc.localDescription);
                        socket.emit('exchange', { 'to': fromId, 'sdp': pc.localDescription });
                    }, logError);
                }, logError);
        }, logError);
    } else {
        console.log('exchange candidate', data);
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
}

function leave(socketId) {
    console.log('leave', socketId);
    const pc = pcPeers[socketId];
    const viewIndex = pc.viewIndex;
    pc.close();
    delete pcPeers[socketId];

    const remoteList = container.state.remoteList;
    delete remoteList[socketId]
    container.setState({ remoteList: remoteList });
    container.setState({ info: 'One peer leave!' });
}

socket.on('exchange', function (data) {
    exchange(data);
});
socket.on('leave', function (socketId) {
    leave(socketId);
});

socket.on('connect', function (data) {
    console.log('connect');
    getLocalStream(true, function (stream) {
        localStream = stream;
        container.setState({ selfViewSrc: stream.toURL() });
        container.setState({ status: 'ready', info: 'Please enter or create room ID' });
    });
});

function logError(error) {
    console.log("logError", error);
}

function mapHash(hash, func) {
    const array = [];
    for (const key in hash) {
        const obj = hash[key];
        array.push(func(obj, key));
    }
    return array;
}

function getStats() {
    const pc = pcPeers[Object.keys(pcPeers)[0]];
    if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
        const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
        console.log('track', track);
        pc.getStats(track, function (report) {
            console.log('getStats report', report);
        }, logError);
    }
}
let container;

class ChatRoom extends Component {
    constructor() {
        super();
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
        this.state = {
            messages: [],
            message: '',
            path: '',
            modal: false,
            info: 'Initializing',
            status: 'init',
            roomID: '',
            isFront: true,
            selfViewSrc: null,
            remoteList: {},
            textRoomConnected: false,
            textRoomData: [],
            textRoomValue: '',
        }
    };
    static navigationOptions = {
        header: null
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
        container = this;
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
                this.setState({ messages });
            })
        })
    };
    _press = () => {
        let uid = this.props.navigation.state.params.Uid;
        this.setState({ modal: true, status: 'connect', info: 'Connecting' });
        firebase.database().ref(`users/${uid}`).update({ call: true });
        join(uid);
    };
    _switchVideoType = () => {
        const isFront = !this.state.isFront;
        this.setState({ isFront });
        getLocalStream(isFront, function (stream) {
            if (localStream) {
                for (const id in pcPeers) {
                    const pc = pcPeers[id];
                    pc && pc.removeStream(localStream);
                }
                localStream.release();
            }
            localStream = stream;
            container.setState({ selfViewSrc: stream.toURL() });

            for (const id in pcPeers) {
                const pc = pcPeers[id];
                pc && pc.addStream(localStream);
            }
        });
    };
    receiveTextData = (data) => {
        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push(data);
        this.setState({ textRoomData, textRoomValue: '' });
    };
    _textRoomPress = () => {
        if (!this.state.textRoomValue) {
            return
        }
        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push({ user: 'Me', message: this.state.textRoomValue });
        for (const key in pcPeers) {
            const pc = pcPeers[key];
            pc.textDataChannel.send(this.state.textRoomValue);
        }
        this.setState({ textRoomData, textRoomValue: '' });
    };
    _renderTextRoom = () => {
        return (
            <View style={styles.listViewContainer}>
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
                    renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
                />
                <TextInput
                    style={{ width: 200, height: 30, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={value => this.setState({ textRoomValue: value })}
                    value={this.state.textRoomValue}
                />
                <TouchableHighlight
                    onPress={this._textRoomPress}>
                    <Text>Send</Text>
                </TouchableHighlight>
            </View>
        );
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
        let { name, online, Uid } = this.props.navigation.state.params;
        return (
            <View style={Styles.container} >
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modal}
                    onRequestClose={() => {
                        this.setState({modal: false});
                    }}>
                    <View style={{ width, height, marginTop: 20 }}>
                    {/* <RTCView streamURL={this.state.selfViewSrc} style={{ width: 200, height: 150, backgroundColor: 'red' }} /> */}
                        {
                            mapHash(this.state.remoteList, function (remote, index) {
                                return <RTCView key={index} streamURL={remote} style={{ width: 200, height: 150 }} />
                            })
                        }
                        <TouchableOpacity onPress={() => this.setState({ modal: false })}>
                            <View style={{ width: 70, height: 70, top: 0, position: 'absolute', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 35, backgroundColor: 'red' }}>  
                                <Icon name='call' style={{ color: '#fff' }} />
                            </View>
                        </TouchableOpacity>
                        {/* <View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ modal: false })
                                }}>
                                <Text>Hide Modal</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </Modal>
                <Header style={{ backgroundColor: '#429ef4' }}>
                    <Left>
                        <Button onPress={() => Actions.pop()} transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{name}</Title>
                    </Body>
                    <Right style={{ paddingLeft: 20 }}>
                        <TouchableOpacity>
                            <Icon name='videocam' style={{ color: '#fff', marginRight: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._press}>
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
                                            borderRadius: 15,
                                            margin: 2,
                                            padding: 8,
                                            backgroundColor: "#196CC1",
                                            alignSelf: "flex-end",
                                        }
                                        :
                                        {
                                            backgroundColor: "#f2f2f2",
                                            marginTop: 2,
                                            width: 200,
                                            borderRadius: 15,
                                            margin: 2,
                                            padding: 8,
                                            alignSelf: "flex-start"
                                        }} >
                                    <Text
                                        style={(val.email && val.email) === this.props.user.email ?
                                            { color: "#fff", fontSize: fontScale * 18 } :
                                            { color: "#a10000", fontSize: fontScale * 18 }}
                                    >{val.msg}</Text>
                                    <Text style={{ fontSize: 10 }} note>{moment(val.time).fromNow()}</Text>
                                </View>
                            </View>
                        )
                    })}
                    {!this.state.messages.length ? <Text style={{ alignSelf: 'center', justifyContent: 'center', color: 'grey' }}>No Message</Text> : null}
                </AutoScroll>
                <Item style={{ width: '100%', height: height / 12 }} regular>
                    <Input
                        value={this.state.message}
                        onChangeText={message => this.setState({ message })}
                        placeholder='please comment...'
                    />
                    <TouchableOpacity onPress={this.onPress}>
                        <Text style={{ marginRight: 10 }}>
                            SEND
                        </Text>
                    </TouchableOpacity>
                </Item>
            </View >
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"

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
    };
};


export default connect(mapStateToProp, mapDispatchToProp)(ChatRoom);

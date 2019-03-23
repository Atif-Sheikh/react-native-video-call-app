import io from 'socket.io-client';
import { Platform } from "react-native";

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';
import firebase from 'react-native-firebase';
import InCallManager from 'react-native-incall-manager';

// const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
const configuration = {
    "iceServers":
        [
            { url: 'stun:stun.l.google.com:19302' }
            ,
            { url: 'stun:numb.viagenie.ca', credential: 'asd123', username: 'muhammadmisbah107@gmail.com' }
            ,
            { url: 'turn:numb.viagenie.ca', credential: 'asd123', username: 'muhammadmisbah107@gmail.com' }
        ]
};

var socket;
const pcPeers = {};
var localStream;
var container;

var saveCompReference = (state) => {
    container = state;
    socket = io.connect('https://wrrtcserver.herokuapp.com/', {
        transports: ['websocket']
    });
    initialize();
};

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

function leave(roomID) {
    const remoteList = container.state.remoteList;
    if (pcPeers.hasOwnProperty(roomID)) {
        const pc = pcPeers[roomID];
        pc.close();
        socket.disconnect()
        delete pcPeers[roomID];
        delete remoteList[roomID]
    }

    for (let socketId in pcPeers) {
        if (pcPeers.hasOwnProperty(socketId)) {
            const pc = pcPeers[socketId];
            pc.close();
            socket.disconnect()
            delete pcPeers[socketId];
            delete remoteList[socketId]
        }
    }
    container.state = { ...container.state, remoteList, info: '' };
}

function initialize() {
    socket.on('exchange', function (data) {
        exchange(data);
    });
    socket.on('leave', function (socketId) {
        leave(socketId);
    });
    socket.on('connect_error', (err) => {
    });
    socket.on('connect', function (data) {
        console.log('connect');
        getLocalStream(true, function (stream) {
            localStream = stream;
            container.setState({ selfViewSrc: stream.toURL(), status: 'ready', info: 'Please enter or create room ID' });
        });
    });
}

function logError(error) {
    console.warn("logError", error);
}

var mapHash = (hash, func) => {
    const array = [];
    for (const key in hash) {
        const obj = hash[key];
        array.push(func(obj, key));
    }
    return array;
}

function getStats() {
    const pc = pcPeers[Object.keys(pcPeers)[0]];
    if (pc && pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
        const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
        console.log('track', track);
        pc.getStats(track, function (report) {
            console.log('getStats report', report);
        }, logError);
    }
}

function _press(id) {

    socket.open();
    container.state = { ...container.state, status: 'connect', info: 'Connecting' };
    join(id || container.state.roomID);
}

function _switchVideoType() {
    const isFront = !container.state.isFront;
    container.setState({ isFront });
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
            if (pc) {
                pc.addStream(localStream);
            }
        }
    });
}

callUser = (id, uid, callType) => {

    // firebase.database().ref("/users").child(uid).child("dialer").set(true)
    // firebase.database().ref("/users").child(uid).child("CallerID").set(uid + id)
    // firebase.database().ref("/users").child(uid).child("status").set('BUSY')
    // firebase.database().ref("/users").child(uid).child("otherUserId").set(id)
    // firebase.database().ref("/users").child(uid).child("callType").set(callType)
    firebase.database().ref('/users').child(uid).update({
        dialer: true,
        CallerID: uid + id,
        status: "BUSY",
        otherUserId: id,
        callType

    })
    if (Boolean(id)) {

        // firebase.database().ref("/users").child(id).child("CallerID").set(uid + id)
        // firebase.database().ref("/users").child(id).child("status").set('BUSY')
        // firebase.database().ref("/users").child(id).child("callType").set(callType)
        // firebase.database().ref("/users").child(id).child("otherUserId").set(uid)
        firebase.database().ref('/users').child(id).update({
            CallerID: uid + id,
            status: "BUSY",
            otherUserId: uid,
            callType

        })

    }
    // this.setState({ callType })
}
endCall = (id, uid) => {
    let callId = uid + id
    // firebase.database().ref("/users").child(uid).child("dialer").set()
    // firebase.database().ref("/users").child(uid).child("CallerID").set()
    // firebase.database().ref("/users").child(uid).child("status").set()
    // firebase.database().ref("/users").child(uid).child("otherUserId").set("")

    // firebase.database().ref("/users").child(id).child("callType").set("")
    firebase.database().ref('/users').child(uid).update({
        dialer: false,
        CallerID: false,
        status: "",
        otherUserId: null,
        callType:""

    })

    if (Boolean(id)) {
        // firebase.database().ref("/users").child(id).child("CallerID").set()
        // firebase.database().ref("/users").child(id).child("status").set()
        // firebase.database().ref("/users").child(id).child("callType").set("")
        // firebase.database().ref("/users").child(id).child("dialer").set("")
        // firebase.database().ref("/users").child(id).child("otherUserId").set("")
        firebase.database().ref('/users').child(id).update({
            dialer: false,
            CallerID: false,
            status: "",
            otherUserId: null,
            callType:""
    
        })


    }
    // leave(callId)
    InCallManager.stop()

    // container.setState({ callType: "", answred: false })
}
module.exports = {
    mapHash,
    leave,
    saveCompReference,
    RTCView,
    _press,
    _switchVideoType,
    callUser,
    endCall
}
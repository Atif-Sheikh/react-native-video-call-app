import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, } from 'react-native';
import {
    Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, Segment, Thumbnail,
    Form, Item, Input, Label
} from "native-base";
import { Actions } from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Sound from 'react-native-sound';
import { AuthAction, DataAction, AttendanceAction } from '../store/action/index';
import { connect } from 'react-redux';
const { height, width, fontScale } = Dimensions.get('window');

const whoosh = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // loaded successfully
});
class QrScan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            scan: true
        };
    };
    static navigationOptions = {
        header: null
    };
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#429ef4' }}>
                    <Left>
                        <Button onPress={() => Actions.pop()} transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Attendance</Title>
                    </Body>
                </Header>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <QRCodeScanner
                        cameraStyle={{ height, width }}
                        onRead={(data) => {
                            this.props.postAttendance(JSON.parse(data.data))
                            whoosh.setVolume(0.4);
                            whoosh.play((success) => {
                                if (success) {
                                    
                                    console.log('successfully finished playing');
                                } else {
                                    console.log('playback failed due to audio decoding errors');
                                    // reset the player to its uninitialized state (android only)
                                    // this is the only option to recover after an error occured and use the player again
                                    whoosh.reset();
                                }
                            });
                        }}
                        reactivate
                        showMarker
                    />
                </View>
            </Container>
        );
    };
};
const mapStateToProp = (state) => {
    return {
        user: state.AuthReducer.user
    };
};
const mapDispatchToProp = (dispatch) => {
    return {
        // getPosts: () => {
        //     // dispatch(GetPosts())
        //     dispatch(DataAction.getData())
        // },
        // requests: () => {
        //     // dispatch(Requests())
        // },
        postAttendance: (payload) => {
            dispatch(AttendanceAction.postAttendance(payload))
        }
    };
};
const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});
export default connect(mapStateToProp, mapDispatchToProp)(QrScan);
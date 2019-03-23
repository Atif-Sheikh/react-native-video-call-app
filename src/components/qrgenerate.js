import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import {
    Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, Segment, Thumbnail,
    Form, Item, Input, Label
} from "native-base";
import { Actions } from 'react-native-router-flux';
import {screenHeight,screenWidth,Styles} from "../config";
const { height, width, fontScale } = Dimensions.get('window');
import QRCode from 'react-native-qrcode';
import { AuthAction, DataAction } from '../store/action/index';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
class QRGenerate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ""
        }
    };
    static navigationOptions = {
        header: null
    };
    componentWillMount() {
        let obj = {
            name: this.props.user.userName,
            number: this.props.user.number,
            uid: firebase.auth().currentUser.uid,
            accountType: this.props.user.accountType,
            email: this.props.user.email,
            studentClass: this.props.user.studentClass,
        }
        if (this.props.user.accountType == 'teacher') {
            delete obj['studentClass'];
        }
        this.setState({ text: JSON.stringify(obj) })
    }
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: Styles.theme.headerBackgroundColor }}>
                    <Left>
                        <Button onPress={() => Actions.pop()} transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{color:Styles.theme.headerTextColor,fontFamily:Styles.fonts.BoldItalic}}>Your QR Code</Title>
                    </Body>
                </Header>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <QRCode
                        value={this.state.text}
                        size={200}
                        // bgColor='purple'
                        fgColor='white' />
                    <Button style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, alignSelf: 'center', backgroundColor: Styles.theme.buttonBackgroundColor, width: screenWidth/1.1, height: screenHeight/13,borderRadius:5 }} onPress={() => { Actions.qrScan() }} >
                        <Text style={{color:Styles.theme.buttonTextColor,fontSize:Styles.fonts.h2,fontFamily:Styles.fonts.BoldItalic}}>Go TO Scan</Text>
                    </Button>
                </View>
            </Container>
        )
    };
};
const mapStateToProp = (state) => {
    return {
        posts: state.DataReducer.posts,
        request: [],
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
    };
};
export default connect(mapStateToProp, mapDispatchToProp)(QRGenerate)
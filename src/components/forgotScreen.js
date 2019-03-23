import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions, StyleSheet, Alert, Keyboard, StatusBar } from 'react-native';
import { Header, Left, Body, Icon, Title, Input, Item, Button } from 'native-base';
import firebase from 'react-native-firebase';
import background from '../images/background.jpg';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import { screenHeight, screenWidth, Styles } from "../config";
let { width, height } = Dimensions.get('window');

export default class ForgotScreen extends Component {
    constructor() {
        super();
        this.state = {
            email: ''
        };
    };
    static navigationOptions = {
        header: null
    };
    _onPress = () => {
        let email = this.state.email.trim();
        if (email) {
            Keyboard.dismiss();
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                Alert.alert(null, 'Please Check Your Email', [{ text: 'OK', onPress: () => Actions.login() }])
            })
                .catch((err) => {
                    alert(err);
                })
        } else {
            Alert.alert(null, 'Please Enter email')
        }
    };
    render() {
        Platform.OS === 'android' && StatusBar.setBarStyle('light-content', true);
        Platform.OS === 'android' && StatusBar.setBackgroundColor("#429ef4");
        return (
            <View style={{height:screenHeight}}>
                {/* // <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={Styles.theme.gradients2} style={{ flex: 1, alignContent: 'center' }}> */}
                {/* <ImageBackground
                source={background}
                resizeMode="cover"
                style={{ opacity: 0.8, height: height - 20, width: width }}
            > */}
                <Header style={{ backgroundColor: Styles.theme.headerBackgroundColor }}>
                    <Left>
                        <Button onPress={() => Actions.pop()} transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>Forgot Password</Title>
                    </Body>
                </Header>
                <View style={styles.container}>
                    <Item style={styles.item} regular>
                        <Input placeholder='Email Address' onChangeText={email => this.setState({ email })} style={styles.input} />
                    </Item>
                    <TouchableOpacity onPress={this._onPress} style={styles.btn}>
                        <Text style={styles.btnText}>Send Password</Text>
                    </TouchableOpacity>
                </View>
                {/* </ImageBackground> */}
                {/* </LinearGradient> */}
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        // paddingBottom: 255
    },
    item: {
        width: "90%",
        marginBottom: 30,
        borderColor: Styles.theme.borderColor,
        borderWidth: 1,
        borderRadius: 7,
    },
    input: {
        fontFamily: Styles.fonts.Normal
    },
    btn: {
        width: "90%",
        backgroundColor: Styles.theme.buttonBackgroundColor,
        borderRadius: 5,
        alignItems: "center",
        height: screenHeight / 13,
        justifyContent: "center"
    },
    btnText: {
        fontFamily: Styles.fonts.BoldItalic,
        fontSize: Styles.fonts.h2,
        color: Styles.theme.buttonTextColor
    }
});
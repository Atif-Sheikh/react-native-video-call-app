import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Button, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Input, Item } from 'native-base';
import { AuthAction } from '../store/action';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Styles, screenHeight, screenWidth } from "../config";
import { Loader } from "./index";

class AddParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            email: '',
            password: '',
            loading: false,
            number: '',
            accountType: 'parent',
        };
    };
    static navigationOptions = {
        header: null
    };
    componentWillReceiveProps(props) {
        if (props.success) {
            Alert.alert(null, 'SuccessFully added', [{ text: 'OK', onPress: () => Actions.home() }]);
        }
    };
    componentWillUnmount() {
        this.props.clearRedux()
    }
    signup = () => {
        const { email, password, userName, number, accountType } = this.state;
        if (email.trim() && password.trim() && userName.trim() && number.trim()) {
            const obj = {
                userName,
                email,
                password,
                number,
                accountType
            };
            obj.AdminEmail = this.props.user.email;
            obj.AdminPassword = this.props.user.password;
            this.props.parentSignup(obj);
            this.setState({ loading: true }, () => {
                Keyboard.dismiss();
            });
        } else {
            Alert.alert(null, 'Please enter all fields correctly');
        }
    };
    _focusNextField = (nextField) => {
        this.refs[nextField]._root.focus();
    };
    render() {
        return (
            // <View style={styles.container}>
            <View style={{ height: screenHeight }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.welcome}>
                                Add Parent
                            </Text>
                        </View>
                        <View style={styles.innerContainer} >
                            {this.props.errorMessage && <View style={{ width: screenWidth / 1.2 }}>
                                <Text style={{ color: "red", width: "90%" }} numberOfLines={2}>{this.props.errorMessage}</Text>
                            </View>
                            }
                            <Item style={styles.item} regular>
                                <Input ref="name" onSubmitEditing={() => this._focusNextField('email')} returnKeyType={"next"} placeholder='Parent name' style={styles.input} onChangeText={name => this.setState({ userName: name.trim() })} />
                            </Item>
                            <Item style={styles.item} regular>
                                <Input ref="email" onSubmitEditing={() => this._focusNextField('password')} returnKeyType={"next"} placeholder='Email Address' style={styles.input} onChangeText={email => this.setState({ email: email.trim() })} />
                            </Item>
                            <Item style={styles.item} regular>
                                <Input ref="password" onSubmitEditing={() => this._focusNextField('number')} returnKeyType={"next"} placeholder='************' style={styles.input} secureTextEntry={true} onChangeText={password => this.setState({ password: password.trim() })} />
                            </Item>
                            <Item style={styles.item} regular>
                                <Input ref="number" placeholder='+923********' keyboardType='numeric' style={styles.input} keyboardType='numeric' onChangeText={(text) => this.setState({ number: text.trim() })} />
                            </Item>
                            <Text style={{ fontSize: 20, color: 'red' }}>{this.props.error}</Text>
                            <TouchableOpacity style={{ height: screenHeight / 13, backgroundColor: Styles.theme.buttonBackgroundColor, borderRadius: 5, justifyContent: "center", width: screenWidth / 1.2 }} onPress={this.signup} >
                                <Text style={{ fontFamily: Styles.fonts.BoldItalic, color: Styles.theme.buttonTextColor, fontSize: Styles.fonts.h2, alignSelf: "center" }}>Add Parent</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {
                    this.props.loader ? <View style={{ justifyContent: 'center', position: 'absolute', width: screenWidth, height: screenHeight, backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <Loader />
                    </View> : null
                }
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        height: screenHeight / 1.4,
        alignItems: 'center',
        // backgroundColor: '#fff',
        // paddingBottom: 120
        // height
    },
    body: {
        backgroundColor: '#fff',
        // justifyContent: 'center',
        alignItems: 'center'
    },
    welcome: {
        fontSize: Styles.fonts.h1,
        textAlign: 'center',
        // margin: 10,
        fontFamily: Styles.fonts.BoldItalic,
        color: Styles.theme.headingColor,
        // paddingTop: 50,
    },
    input: {
        fontFamily: Styles.fonts.Normal
    },
    item: {
        width: screenWidth / 1.2,
        // marginBottom: 30,
        borderColor: Styles.theme.inputBorderColor,
        borderWidth: 1,
        borderRadius: 7,
    },
    btn: {
        width: screenWidth / 2.5,
        // height: height/1,
    },
    itemContainer: {
        height: screenHeight / 2.2,
        justifyContent: "space-between",
        width: screenWidth,
        alignItems: "center",
        // backgroundColor:"red"
    },
    innerContainer: {
        justifyContent: "space-between",
        height: screenHeight / 1.8,

    },
});

function mapStateToProp(state) {
    return {
        user: state.AuthReducer.user,
        loader: state.AuthReducer.addParentLoading,
        success: state.AuthReducer.addParentSuccess,
        errorMessage: state.AuthReducer.errorMessage
    };
};
function mapDispatchToProp(dispatch) {
    return {
        parentSignup: (payload) => {
            dispatch(AuthAction.parentSignup(payload))
        },
        clearRedux: () => { dispatch(AuthAction.ClearStore()) }
    };
};

export default connect(mapStateToProp, mapDispatchToProp)(AddParent);
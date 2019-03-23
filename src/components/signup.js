import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, Button, Keyboard, Dimensions, ScrollView, Alert, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code
import { connect } from 'react-redux';
// import { SignupNow } from '../store/actions'
import { Content, Input, Item, CheckBox, Body, Picker, Icon, Container } from 'native-base';
import Loader from './loader';
import AutoScroll from "react-native-auto-scroll";
import { screenHeight, screenWidth, Styles } from "../config";
import MultiSelect from './MultiPickcer';
import { AuthAction } from '../store/action';
import LinearGradient from 'react-native-linear-gradient';
class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            email: '',
            password: '',
            number: '',
            accountType: 'student',
            studentClass: 0
        };
    };
    static navigationOptions = {
        header: null
    };
    renderFunc = () => {
        const { loader } = this.props;
        if (loader) {
            return <Loader />
        } else {
            return (
                <TouchableOpacity onPress={this.signup} style={{ backgroundColor: Styles.theme.buttonBackgroundColor, height: screenHeight / 14, width: "100%", justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                    <Text style={{ fontFamily: Styles.fonts.BoldItalic, color: Styles.theme.buttonTextColor, fontSize: Styles.fonts.h2 }}>Sign Up</Text>
                </TouchableOpacity>
            )
        };
    };
    onValueChange = (value) => {
        this.setState({
            accountType: value
        });
    };
    onClassChange = (value) => {
        this.setState({
            studentClass: value
        });
    };
    signup = () => {
        const { email, password, userName, number, studentClass, accountType } = this.state;
        if (email.trim() && password.trim() && userName.trim() && number.trim()) {
            const obj = {
                userName,
                email,
                password,
                accountType,
                number,
                studentClass,
                online: true,
                linked: false,
                classArray: [],
            };
            if (accountType == 'teacher') {
                // console.warn(accountType);
                // delete obj['studentClass'];
                // Object.assign({},obj,{classArra})
                delete obj['linked'];
            }
            else {
                // console.warn(accountType + 1);
                if (!studentClass) {
                    Alert.alert(null, "Select Class");
                    return
                }
            }
            this.props.Signup(obj);
            Keyboard.dismiss();

        } else {
            Alert.alert(null, 'Please enter all fields correctly');
        }
    };
    _focusNextField = (nextField) => {
        this.refs[nextField]._root.focus();
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            Actions.home();
        };
    };
    render() {
        // const title = '';
        return (
            // <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={Styles.theme.gradients2} style={{ height: screenHeight }}>
            <Container>
                <AutoScroll style={{ height: screenHeight }}  >
                    <View style={{ flex: 1, width: screenWidth / 1.1, alignSelf: "center", marginBottom: 50 }}>
                        <Text style={styles.welcome}>
                            Signup
                            </Text>
                        <View style={{ width: "100%", borderWidth: 1.0, borderColor: Styles.theme.borderColor, borderRadius: 5, height: screenHeight / 12, marginBottom: 15 }}>
                            <Picker
                                mode="dropdown"
                                // iosHeader="Select your SIM"
                                iosIcon={<Icon name="arrow-dropdown-circle"
                                    style={{ color: "#007aff", fontSize: 25 }} />}
                                selectedValue={this.state.accountType}
                                onValueChange={this.onValueChange}
                            >
                                <Picker.Item label="Student" value="student" />
                                <Picker.Item label="Teacher" value="teacher" />
                            </Picker>
                        </View>
                        <Item style={styles.item} regular>
                            <Input placeholder='Your name' onSubmitEditing={() => this._focusNextField('email')} returnKeyType={"next"} style={styles.input} onChangeText={name => this.setState({ userName: name.trim() })} />
                        </Item>
                        <Item style={styles.item} regular>
                            <Input ref='email' returnKeyType='next' onSubmitEditing={() => this._focusNextField('pass')} placeholder='Email Address' style={styles.input} onChangeText={email => this.setState({ email: email.trim() })} />
                        </Item>
                        <Item style={styles.item} regular>
                            <Input ref='pass' returnKeyType='next' onSubmitEditing={() => this._focusNextField('contact')} placeholder='************' style={styles.input} secureTextEntry={true} onChangeText={password => this.setState({ password: password.trim() })} />
                        </Item>
                        <Item style={styles.item} regular>
                            <Input ref='contact' placeholder='+923********' style={styles.input} keyboardType='numeric' onChangeText={(text) => this.setState({ number: text.trim() })} />
                        </Item>
                        <View style={{ width: "100%", borderWidth: 1.0, borderColor: Styles.theme.borderColor, borderRadius: 5, height: screenHeight / 12, marginBottom: 15, marginTop: 15 }}>
                            {this.state.accountType === "student" ?
                                <Picker
                                    selectedValue={this.state.studentClass}
                                    onValueChange={this.onClassChange}
                                >
                                    <Picker.Item label='Select CLass' value={0} />
                                    <Picker.Item label='i' value='One' />
                                    <Picker.Item label='ii' value='Two' />
                                    <Picker.Item label='iii' value='Three' />
                                    <Picker.Item label='iv' value='Four' />
                                    <Picker.Item label='v' value='Five' />
                                    <Picker.Item label='vi' value='Six' />
                                    <Picker.Item label='vii' value='Seven' />
                                    <Picker.Item label='viii' value='Eight' />
                                    <Picker.Item label='ix' value='Nine' />
                                    <Picker.Item label='x' value='Ten' />
                                </Picker> :
                                <Picker
                                    selectedValue={this.state.studentClass}
                                    onValueChange={this.onClassChange}
                                >
                                    <Picker.Item label='Select CLass' value={0} />
                                    <Picker.Item label='i' value='One' />
                                    <Picker.Item label='ii' value='Two' />
                                    <Picker.Item label='iii' value='Three' />
                                    <Picker.Item label='iv' value='Four' />
                                    <Picker.Item label='v' value='Five' />
                                    <Picker.Item label='vi' value='Six' />
                                    <Picker.Item label='vii' value='Seven' />
                                    <Picker.Item label='viii' value='Eight' />
                                    <Picker.Item label='ix' value='Nine' />
                                    <Picker.Item label='x' value='Ten' />
                                </Picker>
                            }
                        </View>
                        {this.renderFunc()}
                        <TouchableOpacity onPress={() => Actions.login({ from: "signup" })} style={{ alignSelf: "center" }}>
                            <Text style={{ fontFamily: Styles.fonts.Italic, paddingTop: 5 }}>
                                Already have an account ?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </AutoScroll>
            </Container>
            //  </LinearGradient>
        );
    };
};

const styles = StyleSheet.create({
    welcome: {
        fontSize: Styles.fonts.h1,
        textAlign: 'center',
        fontFamily: Styles.fonts.BoldItalic,
        padding: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        // marginBottom: 5,
    },
    input: {
        // height: 50,
        fontFamily: Styles.fonts.Normal
    },
    item: {
        width: "100%",
        // marginBottom: 30,
        borderColor: Styles.theme.borderColor,
        borderWidth: 5.0,
        // marginTop: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    innerContainer: {
        // height
        flex: 1,
        justifyContent: "space-between",
        width: screenWidth / 1.1,
        alignSelf: "center"
        // justifyContent:"center"
        // justifyContent:"space-around"
        // paddingBottom:10
    },
});

function mapStateToProp(state) {
    return ({
        user: state.AuthReducer.user,
        isError: state.AuthReducer.isError,
        loader: state.AuthReducer.signupLoader,
    });
};
function mapDispatchToProp(dispatch) {
    return {
        Signup: (payload) => {
            dispatch(AuthAction.signup(payload))
        },
    };
};

export default connect(mapStateToProp, mapDispatchToProp)(Signup);
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, Button, Keyboard, BackHandler, TouchableHighlight, Dimensions, Platform } from 'react-native';
import { Content, Input, Item, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux'; // New code
import { AuthAction } from '../store/action/index';
import { connect } from 'react-redux';
import background from '../images/background.jpg';
import { Loader } from './index';
import LinearGradient from 'react-native-linear-gradient';
import { Styles, screenHeight, screenWidth, fontScale } from "../config";
// let { screenWidth, screenHeight, fontScale } = Dimensions.get('window');

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            // loading: false,
        };
    };
    componentWillMount() {
        if (this.props.from && this.props.from === "signup") {
            console.log("coming from signup")
        }
        else {
            this.props.checkUser();
        }
        BackHandler.addEventListener("hardwareBackPress", this._handlePress)
        // console.warn(moment(new Date()).format("YYYY-MM-DD"));
        // BackHandler.addEventListener('hardwareBackPress', () => {
        //     BackHandler.exitApp();
        // });
    };
    _onPressOkay = () => {
        BackHandler.exitApp();
    };
    _handlePress = () => {
        if (Actions.currentScene === "login") {
            Alert.alert(
                'Exit App',
                'Exiting the application?',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => { this._onPressOkay() } },
                ],
                { cancelable: true }
            )
        } else {
            Actions.pop();
        }
        return true;
    };
    static navigationOptions = {
        header: null
    };
    renderFunc = () => {
        const { loader } = this.props;
        if (loader) {
            return <Loader />
        } else {
            return <TouchableOpacity style={styles.signinBtn} onPress={this.login}><Text style={{ color: Styles.theme.buttonTextColor, fontSize: Styles.fonts.h3, fontFamily: Styles.fonts.BoldItalic }}>SIGN IN</Text></TouchableOpacity>
        };
    };
    // componentDidMount(){
    //     if(this.props.user){
    //         Actions.home();
    //     }
    // };
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.authed) {
            Actions.home();
        }
    }
    login = () => {
        const { email, password } = this.state;
        // Actions.home();
        if (email, password) {
            // this.setState({loading: true});
            const user = {
                email: this.state.email.trim(),
                password: this.state.password.trim(),
            };
            this.props.signin(user);
            Keyboard.dismiss();

        } else {
            Alert.alert(null, 'Please enter all fields!');
        }
    };
    _focusNextField = (nextField) => {
        this.refs[nextField]._root.focus();
    };
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps.user);
    //     if (nextProps.user) {
    //         Actions.popAndPush('home');
    //     }
    // };
    render() {
        const title = '';
        Platform.OS === 'android' && StatusBar.setBarStyle('light-content', true);
        Platform.OS === 'android' && StatusBar.setBackgroundColor(Styles.theme.backgroundColor);
        return (
            // <ImageBackground
            //     source={background}
            //     resizeMode="cover"
            //     style={{ opacity: 0.8, screenHeight: Platform.OS == 'ios' ? screenHeight : screenHeight - 20, screenWidth: screenWidth }}
            // >
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={Styles.theme.gradients2} style={{ flex: 1, alignContent: 'center' }}>
                <View style={styles.container}>
                    {
                        this.props.checkLoader ?
                            <View style={{ justifyContent: 'center', position: 'absolute', screenWidth, screenHeight }}>
                                <Loader color="#058d94" />
                            </View> : <View>
                                <TouchableOpacity>
                                    <View style={{ screenWidth: 64, screenHeight: 64, borderRadius: 32, borderscreenWidth: 5, borderColor: '#4A86C5', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <Thumbnail style={{ screenWidth: 58, screenHeight: 58 }} source={require('../images/appicon.png')} />
                                    </View>
                                </TouchableOpacity>
                                <Text style={{ fontFamily: Styles.fonts.Bold, textAlign: "center", fontSize: Styles.fonts.h1, padding: 20 }}>
                                    Login
                                </Text>
                                <Item style={styles.item} regular>
                                    <Input textContentType='email'
                                        returnKeyType='next'
                                        placeholder='Email Address'
                                        placeholderTextColor="black"
                                        onChangeText={email => this.setState({ email })} style={styles.input}
                                        onSubmitEditing={() => this._focusNextField('pass')}
                                    />
                                </Item>

                                <Item style={styles.item} regular>
                                    <Input placeholder='**********'
                                        placeholderTextColor="black"
                                        onChangeText={password => this.setState({ password })}
                                        style={styles.input} secureTextEntry={true}
                                        ref="pass"
                                    />
                                </Item>
                                <Text style={{ fontSize: Styles.fonts.regular, color: 'red' }}>{this.props.error}</Text>
                                <View style={styles.btn}>
                                    {this.renderFunc()}
                                </View>
                                <TouchableHighlight onPress={() => Actions.signup()}>
                                    <Text style={{ fontSize: Styles.fonts.regular, alignSelf: 'center', paddingVertical: 5, fontFamily: Styles.fonts.Normal }}>
                                        Don't have an Account ?
                                </Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => Actions.forgotScreen()}>
                                    <Text style={{ fontSize: Styles.fonts.regular, alignSelf: 'center', paddingVertical: 5, fontFamily: Styles.fonts.Normal }}>
                                        Forgot Password ?
                                </Text>
                                </TouchableHighlight>
                            </View>
                    }
                </View>
                {/* </ImageBackground> */}
            </LinearGradient>
        );
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingBottom: 150
    },
    input: {
        height: screenHeight / 14,
        fontFamily: Styles.fonts.Normal,
        color: Styles.theme.textColor
    },
    item: {
        width: screenWidth / 1.3,
        marginBottom: screenHeight / 20,
        borderColor: Styles.theme.inputBorderColor,
        borderWidth: 1,
        borderRadius: 5,
    },
    signinBtn: {
        height: "80%",
        width: "100%",
        backgroundColor: Styles.theme.buttonBackgroundColor,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
    },
    btn: {
        width: screenWidth / 1.3,
        height: screenHeight / 12,
        alignSelf: 'center',
        borderRadius: 5
    },
});

function mapStateToProps(state) {
    return ({
        user: state.AuthReducer.user,
        isAuth: state.AuthReducer.isAuthenticated,
        isError: state.AuthReducer.isError,
        loader: state.AuthReducer.signInLoading,

        checkLoader: state.AuthReducer.checkUserLoader,
        authed: state.AuthReducer.checkUser,
    });
};
function mapDispatchToProps(dispatch) {
    return {
        checkUser: () => {
            dispatch(AuthAction.CheckUser())
        },
        signin: (payload) => {
            dispatch(AuthAction.signin(payload))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
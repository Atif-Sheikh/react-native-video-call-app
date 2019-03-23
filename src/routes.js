import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import {
    Home,
    Profile,
    Message,
    Login,
    Signup,
    Post,
    QrScan,
    QrGenerate,
    AddParent,
    FabScreen,
    ChatRoom,
    ForgotScreen,
    Calendarpicker,
    DateScreen,
    Results,
    Attendance,
    TaskScreen
} from "./components";
import { AuthAction } from './store/action/index';

export default class Routes extends Component {
    // backAndroidHandler={() => {}}
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene
                        key='login'
                        component={Login}
                        initial

                    />
                    <Scene
                        key='signup'
                        component={Signup}

                    />
                    <Scene
                        key='dateScreen'
                        component={DateScreen}

                    />
                    <Scene
                        key='forgotScreen'
                        component={ForgotScreen}
                        title='Forgot Password'

                    />
                    <Scene
                        key='datePicker'
                        component={Calendarpicker}

                    />
                    <Scene
                        key='post'
                        component={Post}
                    // title='Post'

                    />
                    <Scene
                        key='home'
                        component={Home}
                        title='Home'
                    // renderBackButton={() => {}}

                    />
                    <Scene
                        key='profile'
                        component={Profile}

                    />
                    <Scene
                        key='message'
                        component={Message}
                    />
                    <Scene
                        key='qrScan'
                        component={QrScan}
                    />
                    <Scene
                        key='QrGenerate'
                        component={QrGenerate}

                    />
                    <Scene
                        key='addParent'
                        component={AddParent}

                    />
                    <Scene
                        key='fabScreen'
                        component={FabScreen}

                    />
                    <Scene
                        key='chatRoom'
                        component={ChatRoom}

                    />
                    <Scene
                        key="results"
                        component={Results}
                    />
                    <Scene
                        key="attendance"
                        component={Attendance}
                    />
                    <Scene
                        key="taskScreen"
                        component={TaskScreen}
                    />
                </Scene>
            </Router>
        );
    };
};
import React, { Component } from 'react';
import { Text, Platform, StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Content, Button, List, ListItem, Left, Body, Right, Thumbnail, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AuthAction } from '../store/action/index';
import { Styles, screenHeight, screenWidth } from "../config";
import { Loader } from "./";
class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            menuItem: [
                { name: "My Profile", iconName: "person", onPress: "Actions.profile()" },
                { name: "QR Code", iconName: "people", onPress: "Actions.QrGenerate()" }
            ]
        }
    }
    logout = () => {
        this.props.logout();
        Actions.login();
    };
    navigate = (screen) => {
        alert(screen)
    }
    render() {
        //require('../images/face.jpg')
        let { userName } = this.props.user;
        return (
            <View style={{ backgroundColor: Styles.theme.normalColor, height: screenHeight, justifyContent: "space-between" }}>
                <View style={{ height: "20%", backgroundColor: Styles.theme.backgroundColor, justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
                    <Thumbnail style={{ borderWidth: 2, borderColor: '#0b4d8c', }} source={this.props.user.photo ? { uri: this.props.user.photo } : require('../images/face.jpg')} />
                    <Text style={{ fontSize: Styles.fonts.h1, color: Styles.theme.normalColor, fontFamily: Styles.fonts.BoldItalic }}>{userName && userName}</Text>
                </View>
                <View style={{ height: "60%" }}>
                    {/* {this.state.menuItem.map((menu, index) => {
                        return (
                            <ListItem key={index} avatar onPress={this.navigate.bind(this,menu.onPress)}>
                                <Icon style={{ color: '#429ef4' }} name={menu.iconName} />
                                <Text style={{ marginLeft: '15%', fontSize: fontScale * 14, color: '#429ef4' }}>{menu.name}</Text>
                            </ListItem>
                        )
                    })} */}
                    <ListItem onPress={() => Actions.profile()} avatar style={{ margin: 12 }}>
                        <Icon style={{ color: Styles.theme.themeColor }} name='person' />
                        <Text style={{ marginLeft: '11%', fontSize: Styles.fonts.h3, fontFamily: Styles.fonts.Bold, color: Styles.theme.themeColor }}>My Profile</Text>
                    </ListItem>
                    <ListItem avatar style={{ margin: 12 }} onPress={() => Actions.QrGenerate()}>
                        <Icon style={{ color: 'grey' }} name='people' />
                        <Text style={styles.menuTextStyle}>QR Code</Text>
                    </ListItem>
                    {
                        this.props.user.accountType == 'teacher' && <ListItem avatar onPress={() => Actions.datePicker()} style={{ margin: 12 }}>
                            <Icon style={{ color: 'grey' }} name='shuffle' />
                            <Text style={styles.menuTextStyle}>Tasks</Text>
                        </ListItem>
                    }
                    {this.props.user.accountType === "admin" || this.props.user.accountType === "parent" ?
                        <View />
                        :
                        <View>
                            <ListItem avatar style={{ margin: 12 }} onPress={() => Actions.results()}>
                                <Icon style={{ color: 'grey' }} name='ios-paper' />
                                <Text style={styles.menuTextStyle}>Exams</Text>
                            </ListItem>
                            <ListItem avatar style={{ margin: 12 }} onPress={() => Actions.attendance()}>
                                <Icon style={{ color: 'grey' }} name='shuffle' />
                                <Text style={styles.menuTextStyle}>Attendance</Text>
                            </ListItem>
                        </View>
                    }
                    <ListItem avatar style={{ margin: 12 }}>
                        <Icon style={{ color: 'grey' }} name='paper' />
                        <Text style={styles.menuTextStyle}>Exam syllabus</Text>
                    </ListItem>
                    <ListItem avatar style={{ margin: 12 }}>
                        <Icon style={{ color: 'grey' }} name='print' />
                        <Text style={styles.menuTextStyle}>Materials</Text>
                    </ListItem>
                    <ListItem avatar style={{ margin: 12 }}>
                        <Icon style={{ color: 'grey' }} name='color-filter' />
                        <Text style={styles.menuTextStyle}>Lessons</Text>
                    </ListItem>
                </View>
                {this.props.loader && <View style={{ height: "10%", alignItems: "center" }}><Loader /></View>
                    ||
                    <TouchableOpacity onPress={this.logout} style={styles.logoutBtn}>
                        <Text style={styles.btnText}>Logout</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    };
};
function mapStateToProp(state) {
    return {
        logout: state.AuthReducer.logout,
        user: state.AuthReducer.user,
        loader: state.AuthReducer.loader
    }
};
function mapDispatchToProp(dispatch) {
    return {
        logout: () => {
            dispatch(AuthAction.Logout())
        }
    };
};
const styles = StyleSheet.create({
    text: {
        color: "white"
    },
    menuTextStyle: {
        color: Styles.theme.menuTextColor,
        fontFamily: Styles.fonts.Bold,
        fontSize: Styles.fonts.regular,
        marginLeft: "11%"
    },
    logoutBtn: {
        backgroundColor: Styles.theme.buttonBackgroundColor,
        height: "10%",
        width: '100%',
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    btnText: {
        fontFamily: Styles.fonts.BoldItalic,
        fontSize: Styles.fonts.h1,
        color: Styles.theme.buttonTextColor
    }
});

export default connect(mapStateToProp, mapDispatchToProp)(Sidebar);
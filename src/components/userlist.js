import React, { Component } from 'react';
import { DataAction } from '../store/action';
import { connect } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Item, Input, Icon, Thumbnail } from "native-base";
import { Actions } from 'react-native-router-flux';
import { screenHeight, screenWidth, Styles } from '../config';
class Userslist extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            filteredStudents: [],
            value: null,
        };
    };
    componentWillMount() {
        if (!this.props.users.length) {
            this.props.GetUsers();
        }
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.users) {
            let students = [];
            let data = Object.values(nextProps.users);
            // console.warn(data);
            if (data) {
                for (let key in data) {
                    // console.warn(data[key])
                    if (data[key]['accountType'] === 'student') {
                        this.props.user.classArray && this.props.user.classArray.filter((value => {
                            if (data[key]['studentClass'] === value) {
                                students.push(data[key]);
                                // console.warn(data[key]);
                            }
                        }))
                    }
                }
            }
            this.setState({ users: students });
        };
    };
    Search = (value) => {
        this.setState({ value })
        if (value) {
            var name = value.toLowerCase();
            var filteredStudents = this.state.users.filter((user) => user.userName.toLowerCase().includes(name))
            this.setState({ filteredStudents })
        }
        else {
            this.setState({ filteredStudents: [] })
        }
    }
    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ justifyContent: "space-around", width: "90%", alignSelf: "center",marginBottom:40 }}>
                    <Item regular style={{ height: screenHeight / 12, width: "100%", justifyContent: "center", alignItems: "center", alignSelf: "center", marginTop: 10, borderRadius: 5 }}>
                        <Input placeholder="Search Student By Name" style={{ fontFamily: Styles.fonts.Normal }} onChangeText={this.Search} />
                        <Icon name="search" />
                    </Item>
                    {!this.state.filteredStudents.length && this.state.users && this.state.users.map((user) => {
                        return (
                            <TouchableOpacity onPress={() => Actions.chatRoom({ name: user.userName, online: user.online, Uid: user.Uid, deviceToken: user.deviceToken })} style={{ width: "100%", height: screenHeight / 7, marginTop: 10, backgroundColor: Styles.theme.backgroundColor, borderRadius: 5, justifyContent: "space-around", flexDirection: "row" }}>
                                <View style={{ height: "100%", justifyContent: "center", alignItems: "center", width: "25%" }}>
                                    <Thumbnail source={user.photo ? { uri: user.photo } : require("../images/face.jpg")} />
                                </View>
                                <View style={{ width: "75%", height: "100%", justifyContent: "space-around" }}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <View style={{ width: "50%", flexDirection: "row", alignItems: "center" }}>
                                            <Icon name="ios-person" style={{ color: Styles.theme.normalColor }} />
                                            <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.userName}</Text>
                                        </View>
                                        <View style={{ width: "50%", flexDirection: "row", alignItems: "center" }}>
                                            <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Bold, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>Class</Text>
                                            <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.studentClass}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="ios-mail" style={{ color: Styles.theme.normalColor }} />
                                        <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.email}</Text>
                                    </View>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="ios-call" style={{ color: Styles.theme.normalColor }} />
                                        <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.number}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                    }
                    {this.state.filteredStudents && this.state.filteredStudents.map((user) => {
                        return (
                            // <TouchableOpacity onPress={() => Actions.chatRoom({ name: user.userName, online: user.online, Uid: user.Uid, deviceToken: user.deviceToken })} style={{ width: "100%", height: screenHeight / 7, marginTop: 10, backgroundColor: Styles.theme.backgroundColor, borderRadius: 5, justifyContent: "space-around", flexDirection: "row" }}>
                            //     <View style={{ height: "100%", justifyContent: "center", alignItems: "center", width: "25%" }}>
                            //         <Thumbnail source={user.photo ? { uri: user.photo } : require("../images/face.jpg")} />
                            //     </View>
                            //     <View style={{ width: "75%", height: "100%", justifyContent: "space-around" }}>
                            //         <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                            //             <Icon name="ios-person" style={{ color: Styles.theme.normalColor }} />
                            //             <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.userName}</Text>
                            //         </View>
                            //         <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                            //             <Icon name="ios-mail" style={{ color: Styles.theme.normalColor }} />
                            //             <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.email}</Text>
                            //         </View>
                            //         <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                            //             <Icon name="ios-call" style={{ color: Styles.theme.normalColor }} />
                            //             <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.number}</Text>
                            //         </View>
                            //     </View>
                            // </TouchableOpacity>
                            <TouchableOpacity onPress={() => Actions.chatRoom({ name: user.userName, online: user.online, Uid: user.Uid, deviceToken: user.deviceToken })} style={{ width: "100%", height: screenHeight / 7, marginTop: 10, backgroundColor: Styles.theme.backgroundColor, borderRadius: 5, justifyContent: "space-around", flexDirection: "row" }}>
                                <View style={{ height: "100%", justifyContent: "center", alignItems: "center", width: "25%" }}>
                                    <Thumbnail source={user.photo ? { uri: user.photo } : require("../images/face.jpg")} />
                                </View>
                                <View style={{ width: "75%", height: "100%", justifyContent: "space-around" }}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <View style={{ width: "50%", flexDirection: "row", alignItems: "center" }}>
                                            <Icon name="ios-person" style={{ color: Styles.theme.normalColor }} />
                                            <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.userName}</Text>
                                        </View>
                                        <View style={{ width: "50%", flexDirection: "row", alignItems: "center" }}>
                                            <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Bold, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>Class</Text>
                                            <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.studentClass}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="ios-mail" style={{ color: Styles.theme.normalColor }} />
                                        <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.email}</Text>
                                    </View>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="ios-call" style={{ color: Styles.theme.normalColor }} />
                                        <Text style={{ marginLeft: 10, fontFamily: Styles.fonts.Normal, color: Styles.theme.normalColor, maxWidth: "80%" }} numberOfLines={1}>{user.number}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                    }
                </View>
            </ScrollView>
        );
    }
};

const mapStateToProp = (state) => {
    return {
        // request: [],
        users: state.DataReducer.users,
        user: state.AuthReducer.user,
        loader: state.DataReducer.loader
    };
};
const mapDispatchToProp = (dispatch) => {
    return {
        GetUsers: () => {
            dispatch(DataAction.getUsers())
        }
    };
};

export default connect(mapStateToProp, mapDispatchToProp)(Userslist);
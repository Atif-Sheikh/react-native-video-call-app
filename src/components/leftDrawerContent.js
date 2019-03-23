import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, FlatList, LayoutAnimation, ScrollView } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Icon } from 'native-base';
import Collapsible from 'react-native-collapsible';
import { Styles, screenHeight, screenWidth } from "../config";
import ChatCard from './chatCard';
import { connect } from 'react-redux';
import { AuthAction, DataAction } from '../store/action/index';

class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            teacher: true,
            students: true,
            parents: true,
            admins: true,
            onlineTeachers: [],
            onlineParents: [],
            onlineStudents: [],
            onlineAdmins: [],
        };
    };
    // componentDidMount() {
    //     this.props.onlineUsers();
    // };
    componentWillReceiveProps(props) {
        if (props.users) {
            let data = props.users;
            let onlineTeachers = [];
            let onlineParents = [];
            let onlineStudents = [];
            let onlineAdmins = [];
            for (let key in data) {
                if (props.user.email !== data[key]['email']) {
                    if (data[key]['accountType'] == 'teacher') {
                        onlineTeachers.push(data[key]);
                    }
                    else if (data[key]['accountType'] == 'parent') {
                        onlineParents.push(data[key]);
                    }
                    else if (data[key]['accountType'] == 'student') {
                        onlineStudents.push(data[key]);
                    }
                    else if (data[key]['accountType'] == 'admin') {
                        console.warn('adminnnnnssss', data[key]);
                        onlineAdmins.push(data[key]);
                    }
                }
            }
            this.setState({ onlineParents, onlineStudents, onlineTeachers, onlineAdmins });
        };
    };
    componentDidUpdate() {
        LayoutAnimation.spring();
    };
    render() {
        //   console.log(this.props.users);
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{marginBottom:20}}>
                    <ListItem style={{ backgroundColor: Styles.theme.backgroundColor, justifyContent: "space-around", alignItems: "center" }} onPress={() => this.setState({ teacher: true, students: true, parents: true, admins: !this.state.admins })} itemDivider>
                        <View style={{ width: "80%" }}>
                            <Text style={{ color: '#fff', alignSelf: "flex-start", fontFamily: Styles.fonts.BoldItalic }}>Admins</Text>
                        </View>
                        <View style={{ width: "20%" }}>
                            <Icon type="Ionicons" name={
                                this.state.admins ? "md-arrow-dropdown-circle" : "md-arrow-dropup-circle"
                                } style={{ color: Styles.theme.normalColor, alignSelf: "flex-end" }} />
                        </View>
                    </ListItem>
                    <Collapsible collapsed={this.state.admins}>
                        <FlatList
                            data={this.state.onlineAdmins}
                            renderItem={({ item }) => <ChatCard item={item} />}
                        />
                    </Collapsible>
                    {
                        this.props.user.accountType === 'teacher' ? null
                            : <ListItem style={{ backgroundColor: Styles.theme.backgroundColor, justifyContent: "space-around", alignItems: "center" }} onPress={() => this.setState({ teacher: !this.state.teacher, students: true, parents: true, admins: true })} itemDivider>
                                <View style={{ width: "80%" }}>
                                    <Text style={{ color: '#fff', alignSelf: "flex-start", fontFamily: Styles.fonts.BoldItalic }}>Teachers</Text>
                                </View>
                                <View style={{ width: "20%" }}>
                                    <Icon type="Ionicons" name={this.state.teacher ? "md-arrow-dropdown-circle" : "md-arrow-dropup-circle"} style={{ color: Styles.theme.normalColor, alignSelf: "flex-end" }} />
                                </View>
                            </ListItem>
                    }
                    <Collapsible collapsed={this.state.teacher}>
                        <FlatList
                            data={this.state.onlineTeachers}
                            renderItem={({ item }) => <ChatCard item={item} />}
                        />
                    </Collapsible>
                    {
                        this.props.user.accountType === 'student' ? null
                            : <ListItem style={{ backgroundColor: Styles.theme.backgroundColor, justifyContent: "space-around", alignItems: "center" }} onPress={() => this.setState({ teacher: true, students: !this.state.students, parents: true, admins: true })} itemDivider>
                                <View style={{ width: "80%" }}>
                                    <Text style={{ color: '#fff', alignSelf: "flex-start", fontFamily: Styles.fonts.BoldItalic }}>Students</Text>
                                </View>
                                <View style={{ width: "20%" }}>
                                    <Icon type="Ionicons" name={this.state.students ? "md-arrow-dropdown-circle" : "md-arrow-dropup-circle"} style={{ color: Styles.theme.normalColor, alignSelf: "flex-end" }} />
                                </View>
                            </ListItem>
                    }
                    <Collapsible collapsed={this.state.students}>
                        <FlatList
                            data={this.state.onlineStudents}
                            renderItem={({ item }) => <ChatCard item={item} />}
                        />
                    </Collapsible>
                    {
                        this.props.user.accountType === 'parent' ? null
                            : <ListItem style={{ backgroundColor: Styles.theme.backgroundColor, justifyContent: "space-around", alignItems: "center" }} onPress={() => this.setState({ teacher: true, students: true, parents: !this.state.parents, admins: true })} itemDivider>
                                <View style={{ width: "80%" }}>
                                    <Text style={{ color: '#fff', alignSelf: "flex-start", fontFamily: Styles.fonts.BoldItalic }}>Parents</Text>
                                </View>
                                <View style={{ width: "20%" }}>
                                    <Icon type="Ionicons" name={this.state.parents ? "md-arrow-dropdown-circle" : "md-arrow-dropup-circle"} style={{ color: Styles.theme.normalColor, alignSelf: "flex-end" }} />
                                </View>
                            </ListItem>
                    }
                    <Collapsible collapsed={this.state.parents}>
                        <FlatList
                            data={this.state.onlineParents}
                            renderItem={({ item }) => <ChatCard item={item} />}
                        />
                    </Collapsible>
                </View>
            </ScrollView>
        );
    };
};
const styles = StyleSheet.create({
    text: {
        color: "white"
    },
});


const mapStateToProp = (state) => {
    return ({
        users: state.DataReducer.users,
        user: state.AuthReducer.user,
    });
};
const mapDispatchToProp = (dispatch) => {
    return {
        // onlineUsers: () => {
        //     dispatch(DataAction.OnlineUsers());
        // },
    };
};

export default connect(mapStateToProp, mapDispatchToProp)(Sidebar);

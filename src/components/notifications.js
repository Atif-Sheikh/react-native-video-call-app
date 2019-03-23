import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Loader } from "./";
import { Container, Header, Content, Button, Icon, List, ListItem } from 'native-base';
import { DataAction } from "../store/action";
import { connect } from "react-redux";
import moment from "moment";
import { screenHeight, screenWidth, Styles } from "../config";
import { Actions } from "react-native-router-flux";
class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
    };
    static navigationOptions = {
        header: null
    };
    componentWillMount() {
        const obj = {
            lastScene: new Date().getTime(),
            accountType: this.props.user.accountType === "teacher" ? "teacherLastScene" : "studentLastScene"
        }
        this.props.setLastScene(obj)
    }
    componentDidMount() {
        if (this.props.notifications) {
            var user = this.props.user;
            var data = this.props.notifications;
            var array = [];
            var finalNotifications = [];
            if (user && user.accountType === "student") {
                for (var keys1 in data) {
                    var d = data[keys1]
                    for (var keys2 in d) {
                        array.push({ ...d[keys2], key: keys2 })
                    }
                }
                for (var i = 0; i < array.length; i++) {
                    if (array[i]['studentClass'] === user.studentClass) {
                        finalNotifications.push(array[i])
                    }
                }
                this.setState({ notifications: finalNotifications })
            }
            else {
                for (var keys in data) {
                    array.push(data[keys])
                }
                this.setState({ notifications: array })
            }
        }
    }
    render() {
        return (
            <View style={{ height: screenHeight, width: screenWidth }}>
                {this.props.loader && <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Loader /></View>}
                <ScrollView style={{ flex: 1 }}>
                    {!this.props.loader && this.state.notifications && this.state.notifications.length > 0 ? this.state.notifications.map((notification) => (
                        this.props.user.accountType === "student" ?
                            <ListItem onPress={() => Actions.taskScreen({ notification })} style={{ flexDirection: "column", height: screenHeight / 10, width: screenWidth, marginLeft: 0, padding: 10, alignItems: "flex-start" }}>
                                <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, maxWidth: "90%", color: "#000" }} numberOfLines={1}>{notification.taskTitle}</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium, maxWidth: "90%", color: "gray" }}>Due Date : </Text>
                                    <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.medium, maxWidth: "90%", color: "gray" }}>{moment(notification.date).format('MMMM Do YYYY')}</Text>
                                </View>
                            </ListItem>
                            :
                            <ListItem onPress={() => alert("Functionality will be implemented")} style={{ flexDirection: "column", height: screenHeight / 10, width: screenWidth, marginLeft: 0, padding: 10, alignItems: "flex-start" }}>
                                <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, maxWidth: "90%", color: "#000" }} numberOfLines={1}>{notification.studentName + " replied to Your Task"}</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium, maxWidth: "90%", color: "gray" }}>Student Class : </Text>
                                    <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.medium, maxWidth: "90%", color: "gray" }}>{notification.studentClass}</Text>
                                </View>
                            </ListItem>

                    ))
                        :
                        !this.props.loader && <View style={{ height: screenHeight / 1.2, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.h2, color: "gray" }}>No Notification Found</Text>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.AuthReducer.user,
        notifications: state.DataReducer.notifications,
        loader: state.DataReducer.loader,
        error: state.DataReducer.errorMessage,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchNotifications: () => dispatch(DataAction.fetchNotifications()),
        setLastScene: (payload) => dispatch(DataAction.setLastScene(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
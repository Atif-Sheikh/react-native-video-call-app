import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Keyboard, Dimensions, } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import AutoScroll from 'react-native-auto-scroll'
import {
    Container, Header, Content, List, ListItem, Left, Body, Right,
    Thumbnail, Text, Icon, Button, Footer, FooterTab, Item, Input, Title
} from 'native-base';
import moment from 'moment';
import firebase from 'react-native-firebase';
import { Styles, screenHeight, screenWidth } from "../config";
import { Loader } from "./index";
class Message extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
            messages: [],
            photo: '',
            loader: false
        };
    };
    static navigationOptions = {
        CustomHeader: null,
        header: null,
        Footer: null,
        FooterTab: null,
    };
    componentWillMount() {
        this.setState({ loader: true });
    }
    componentDidMount() {
        let pushKey = this.props.navigation.state.params.pushKey;
        firebase.database().ref(`/status/${pushKey}/allComments`).on('value', snap => {
            let data = snap.val();
            let messages = [];
            if (data) {
                messages = Object.values(data);
                messages = messages.sort(function (a, b) { return a.time - b.time });
            }
            this.setState({ messages, loader: false });
        });
        if (this.props.user.photo) {
            this.setState({ photo: this.props.user.photo });
        }
    };
    _onPress = () => {
        if (this.state.message.trim()) {
            let comment = this.props.navigation.state.params.comments;
            let pushKey = this.props.navigation.state.params.pushKey;
            firebase.database().ref(`/status/${pushKey}/allComments`).push({ name: this.props.user.userName, comment: this.state.message, time: Date.now(), photo: this.state.photo })
                .then(() => {
                    firebase.database().ref(`/status/${pushKey}`).update({ comments: comment + 1 })
                })
            Keyboard.dismiss();
            this.setState({ message: '' });
        } else {
            Alert.alert(null, 'Please Write something...');
        }
    };
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: Styles.theme.backgroundColor }}>
                    <Left>
                        <Button onPress={() => Actions.pop()} transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>Comments</Title>
                    </Body>
                </Header>
                <AutoScroll>
                    {
                        !this.state.messages.length && !this.state.loader && <Text style={{ alignSelf: 'center', paddingTop: screenHeight / 2.5, fontFamily: Styles.fonts.BoldItalic }}>No Comments yet...</Text>
                    }
                    {
                        this.state.loader ? <View style={{ paddingTop: screenHeight / 2.5, justifyContent: "center" }}>
                            <Loader />
                        </View> : this.state.messages && this.state.messages.length > 0 && this.state.messages.map((msg, index) => {
                            return <View style={{ justifyContent: "space-between", flexDirection: "row", width: screenWidth, height: screenHeight / 10 }} key={index}>
                                <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                                    {
                                        msg.photo ? <Thumbnail style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2.0, borderColor: Styles.theme.borderColor }} source={{ uri: msg.photo }} /> :
                                            <Thumbnail style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2.0, borderColor: Styles.theme.borderColor }} source={require('../images/face.jpg')} />
                                    }
                                </View>
                                <View style={{ width: "60%", justifyContent: "center", borderBottomWidth: 0.3, borderBottomColor: "grey" }}>
                                    <Text style={{ fontFamily: Styles.fonts.Bold }}>{msg.name && msg.name || "Unknown"}</Text>
                                    <Text style={{ fontSize: Styles.fonts.medium, paddingLeft: 5, fontFamily: Styles.fonts.Italic, width: "90%" }} numberOfLines={2}>{msg.comment}</Text>
                                </View>
                                <View style={{ width: "20%", justifyContent: "center", borderBottomWidth: 0.3, borderBottomColor: "grey" }} >
                                    <Text style={{ fontSize: Styles.fonts.small, fontFamily: Styles.fonts.Italic }} note>{moment(msg.time).fromNow()}</Text>
                                </View>

                            </View>
                        })
                    }
                </AutoScroll>
                <Item style={{ width: '100%', height: screenHeight / 12, justifyContent: "space-between", flexDirection: "row" }} regular>
                    <Input
                        onChangeText={message => this.setState({ message })}
                        placeholder='Write your comment here'
                        style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, width: "80%" }}
                        value={this.state.message}
                    />
                    <TouchableOpacity onPress={this._onPress} style={{ height: "100%", width: "20%", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontFamily: Styles.fonts.BoldItalic, color: "grey" }}>
                            Send
                        </Text>
                        <Icon name='md-send' style={{ color: "grey" }} />
                    </TouchableOpacity>
                </Item>
            </Container>
        );
    };
};
function mapStateToProp(state) {
    return ({
        user: state.AuthReducer.user,
    });
};
function mapDispatchToProp(dispatch) {
    return {
    };
};
const styles = StyleSheet.create({
    Text: {
        color: "black",
        fontSize: Styles.fonts.h1,
        margin: 5,
        marginLeft: 2,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    close: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 10,
        fontSize: 50,
        color: 'rgba(0,0,0,0.5)',
    },
    BodyText: {
        color: 'rgba(0,0,0,0.5)',
        margin: 12,
    },
});
export default connect(mapStateToProp, mapDispatchToProp)(Message);
import React, { Component } from 'react';
import { Platform, StatusBar, FlatList, View, Image, Dimensions, BackHandler, DeviceEventManager, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import {
    Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text,
    Item, Input, Label, Form, Tab, Tabs, TabHeading, Fab, Card, CardItem, Spinner, Badge
} from 'native-base';
// import { sendNewMessageNotification } from './notifications';
import { Drawer } from 'native-base';
import { Actions } from 'react-native-router-flux';
import SideBar from './sidebar';
import CardsItem from './cardItems';
import RequestCard from './requestCard';
import { AuthAction, DataAction } from '../store/action/index';
import { connect } from 'react-redux';
import LeftDrawerContent from './leftDrawerContent';
import Loader from "./loader";
// import Spinner from './spinner';
import firebase from 'react-native-firebase';
import moment from 'moment';
import LinkPreview from 'react-native-link-preview';
import Userslist from './userlist';
import ChildrenScreen from './childrens';
import Notification from './notifications';
import InCallManager from 'react-native-incall-manager';
import { Styles, screenHeight, fontScale, screenWidth } from "../config";
var {
    mapHash,
    leave,
    saveCompReference,
    RTCView,
    _press,
    _switchVideoType,
    endCall
} = require('../config/webRtc.js');
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            isFetching: false,
            loading: false,
            posts: [],
            search: '',
            filteredPost: [],
            requests: [
                { name: 'Marry Collen', mutualFriends: 4 },
                { name: 'Robert Alex', mutualFriends: 6 },
                { name: 'Calvin Collen', mutualFriends: 2 },
            ],
            notificationsCount: undefined,
            messages: [],
            message: '',
            path: '',
            modal: false,
            info: 'Initializing',
            status: 'init',
            roomID: '',
            isFront: false,
            selfViewSrc: null,
            remoteList: {},
            textRoomConnected: false,
            textRoomData: [],
            textRoomValue: '',
            loudspeaker: false,
            incoming: false,
            fetched: false,
            callType: "",
            answred: false,
        };
        saveCompReference(this);
        props.listenUser()
    };
    static navigationOptions = {
        header: null,
    };
    componentWillMount() {
        // console.warn(this.props.user.classArray);
        // firebase.database().ref("a").push("aa")
        if (this.props.user.accountType === "student") {
            var accountType = "studentLastScene"
            this.props.getLastScene(accountType)
            this.props.fetchNotifications()
        }
        if (this.props.user.accountType === "teacher") {
            var accountType = "teacherLastScene"
            this.props.getLastScene(accountType)
            this.props.fetchDoneTasks(this.props.user.Uid)
        }
        if (!this.props.posts) {
            this.props.getPosts();
        } else if (this.props.posts) {
            Object.values(this.props.posts).map((post, ind) => {
                post.key = Object.keys(this.props.posts)[ind];
            })
            this.setState({
                posts: Object.values(this.props.posts),
                // isFetching: false,
                // keys: Object.keys(nextProps.posts),
            })
        }
        // if(this.props.users){
        this.props.getUsers();
    };
    closeDrawer = () => {
        this.drawer._root.close()
    };
    openDrawer = () => {
        this.drawer._root.open()
    };
    closeLeftDrawer = () => {
        this.LeftDrawer._root.close()
    };
    openLeftDrawer = () => {
        this.LeftDrawer._root.open()
    };
    // componentWillUnmount() {
    // alert("aa");
    // BackHandler.removeEventListener('hardwareBackPress', this._handlePress);
    // this.backHandler.remove();
    // };
    _onPressOkay = () => {
        // this.props.clearStore();
        BackHandler.exitApp();
    };
    _handlePress = () => {
        if (Actions.currentScene === "home") {
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
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this._handlePress)
        firebase.database().ref('.info/connected').on('value', snapshot => {
            if (snapshot) {
                firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`).onDisconnect().update({ online: firebase.database.ServerValue.TIMESTAMP });
                firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`).update({ online: true });
            }
            // else{
            //     firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`).update({online: false});
            // }
        })
        firebase.messaging().requestPermission()
            .then(() => {
            })
            .catch(error => {
                // User has rejected permissions  
            });
        if (InCallManager.recordPermission !== 'granted') {
            InCallManager.requestRecordPermission()
                .then((requestedRecordPermissionResult) => {
                    console.log("InCallManager.requestRecordPermission() requestedRecordPermissionResult: ", requestedRecordPermissionResult);
                })
                .catch((err) => {
                    console.log("InCallManager.requestRecordPermission() catch: ", err);
                });
        }
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.posts) {
            Object.values(nextProps.posts).map((post, ind) => {
                post.key = Object.keys(nextProps.posts)[ind];
            });
            let posts = Object.values(nextProps.posts);
            posts = posts.sort((a, b) => b.time - a.time);
            this.setState({
                posts,
                isFetching: false,
                // keys: Object.keys(nextProps.posts),
            })

        }
        if (nextProps && nextProps.user) {
            if (this.props.user && this.props.user.CallerID && !nextProps.user.CallerID) {
                // alert("yes")
                InCallManager.stop();
                this.setState({ answred: false })
                leave(this.props.user.otherUserId, this.props.user.Uid)
            }
        }
        if (nextProps && nextProps.notifications && nextProps.lastScene) {
            if (this.props.user && this.props.user.accountType === "student") {
                var user = this.props.user;
                var data = nextProps.notifications;
                var array = [];
                var finalNotifications = [];
                for (var keys1 in data) {
                    var d = data[keys1]
                    for (var keys2 in d) {
                        array.push(d[keys2])
                    }
                }
                if (user && user.accountType === "student") {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i]['created'] > nextProps.lastScene && array[i]['studentClass'] === user.studentClass) {
                            finalNotifications.push(array[i])
                        }
                    }
                    this.setState({ notificationsCount: finalNotifications.length })
                }
            }
            else {
                var data = nextProps.notifications;
                var finalNotifications = [];
                for (var keys in data) {
                    if (data[keys]['submitOn'] > nextProps.lastScene) {
                        finalNotifications.push(data[keys])
                    }
                }
                this.setState({ notificationsCount: finalNotifications.length })
            }
        }
    };
    _onRefresh() {
        this.setState({ isFetching: true }, () => { this.props.getPosts() });
    };
    _onSearch = (val) => {
        this.setState({ search: val });
        if (val) {
            let searched = this.state.posts.filter(text => (text.coveredContent && text.coveredContent.includes(val.toLowerCase()) || (text.title && text.title.includes(val.toLowerCase()))));
            this.setState({ filteredPost: searched });
        } else {
            this.setState({ filteredPost: [] })
        }
    };

    render() {
        let now = Date.now();
        if (!this.props.user) return null;
        Platform.OS === 'android' && StatusBar.setBarStyle('light-content', true);
        Platform.OS === 'android' && StatusBar.setBackgroundColor(Styles.theme.backgroundColor);
        let { CallerID, dialer, callType, otherUserId } = this.props.user

        return (
            <View style={{ height: screenHeight }}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={Boolean(CallerID)}
                    onRequestClose={() => { !Boolean(CallerID) }}
                    // onDismiss={()=>{
                    //     // this.endCall(otherUserId, firebase.auth().currentUser.uid)

                    // }}
                    onShow={() => {
                        InCallManager.stop()
                        this.setState({ answred: false })

                    }}
                >
                    {(callType) == 'video' ? <RTCView zOrder={1} streamURL={this.state.selfViewSrc} style={{
                        width: 100,
                        height: 140,
                        elevation: 20,
                        zIndex: 25
                    }} /> : <View style={{ width: 100, height: 140, elevation: 20, zIndex: 25 }} />}
                    <View style={{ width: screenWidth, height: screenHeight, justifyContent: 'flex-end' }}>
                        {(callType) == 'video' &&
                            mapHash(this.state.remoteList, function (remote, index) {
                                return (
                                    <RTCView
                                        key={index}
                                        streamURL={remote}
                                        objectFit="cover"
                                        zOrder={0}
                                        style={{
                                            height: "100%",
                                            width: "100%"
                                        }}
                                    />
                                )
                            })
                        }
                        <View style={{ width: screenWidth / 1.3, position: "absolute", bottom: screenHeight * 0.3, alignSelf: 'center', height: screenHeight / 8, flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', }}>
                            <TouchableOpacity onPress={() => this.setState({ loudspeaker: !this.state.loudspeaker }, () => {
                                InCallManager.setForceSpeakerphoneOn(this.state.loudspeaker);
                            })}>
                                <View style={{ width: 60, height: 60, position: 'relative', bottom: 0, marginBottom: 50, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: 'grey' }}>
                                    <Icon name={this.state.loudspeaker ? 'mic-off' : 'mic'} style={{ color: '#fff' }} />
                                </View>
                            </TouchableOpacity>
                            {
                                (!dialer && !this.state.answred) && <TouchableOpacity onPress={() => {
                                    InCallManager.start({ media: callType })
                                    if (callType != 'video') {
                                        InCallManager.setForceSpeakerphoneOn(false);
                                    }
                                    this.setState({ roomID: CallerID, answred: true }, () => {
                                        _press();
                                        // this.props.StartOREndTimer(uid, this.state.userStatus.uid, true)
                                    })
                                }} >
                                    <View style={{ width: 60, height: 60, position: 'relative', bottom: 0, marginBottom: 50, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: 'green' }}>
                                        <Icon name='call' style={{ color: '#fff' }} />
                                    </View>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={() => this.setState({ modal: false }, () => {
                                InCallManager.stop()
                                endCall(otherUserId, firebase.auth().currentUser.uid)
                            })}>
                                <View style={{ width: 60, height: 60, position: 'relative', bottom: 0, marginBottom: 50, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: 'red' }}>
                                    <Icon name='call' style={{ color: '#fff' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Drawer
                    type="displace" //:overlay:static
                    ref={(ref) => { this.drawer = ref; }}
                    panOpenMask={20}
                    content={<SideBar user={this.props.user} />}
                    onClose={() => this.closeDrawer()} >
                    <Drawer
                        type="displace"
                        side='right'
                        ref={(ref) => { this.LeftDrawer = ref; }}
                        content={<LeftDrawerContent />}
                        onClose={() => this.closeLeftDrawer()} >
                        <Header style={{ display: 'flex', backgroundColor: Styles.theme.headerBackgroundColor, flexDirection: 'row', alignItems: "center" }} hasTabs>
                            <View style={{ flex: 1 }}>
                                <Button onPress={this.openDrawer} transparent>
                                    <Icon style={{ fontSize: Styles.fonts.large, width: 30, color: Styles.theme.headerTextColor }} name="menu" />
                                </Button>
                            </View>
                            <View style={{ flex: 4 }}>
                                <Item style={{ height: screenHeight / 13 }}>
                                    <Input returnKeyType='search' onChangeText={(text) => this._onSearch(text)}
                                        style={{ color: Styles.theme.headerTextColor, fontFamily: Styles.fonts.Normal }} placeholderTextColor={Styles.theme.headerTextColor}
                                        placeholder="Search"
                                    // onSubmitEditing={() => this._focusNextField('pass')}
                                    />
                                    <Icon size={Styles.fonts.small} style={{ color: Styles.theme.headerTextColor }} name='search' />
                                </Item>
                            </View>
                            {
                                this.props.user && this.props.user.accountType === 'student' ? null
                                    : <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                                        <Icon onPress={this.openLeftDrawer} style={{ color: Styles.theme.headerTextColor, fontSize: Styles.fonts.large }} name='person' />
                                    </View>
                            }
                        </Header>
                        <Tabs locked={true}>
                            <Tab
                                heading={<TabHeading style={{ flexDirection: 'column', backgroundColor: Styles.theme.backgroundColor }}>
                                    <Icon style={styles.tabIcon} name="paper" />
                                    <Text style={styles.tabText}>Status</Text>
                                </TabHeading>}>
                                <FlatList
                                    data={this.state.filteredPost.length ? this.state.filteredPost : this.state.posts}
                                    renderItem={({ item, index }) => <CardsItem Uid={this.props.user.Uid} pushKey={item.key} item={item} />}
                                    keyExtractor={(item, key) => key.toString()}
                                    onRefresh={() => this._onRefresh()}
                                    refreshing={this.state.isFetching}
                                    style={{ marginBottom: 20 }}
                                // ListFooterComponent={this.renderFooter}  
                                />
                                {this.props.user && this.props.user.accountType == 'teacher' || this.props.user.accountType == 'admin' ?
                                    <Fab
                                        onPress={() => Actions.fabScreen()}
                                        active={false}
                                        style={{ backgroundColor: Styles.theme.backgroundColor, position: "absolute", marginBottom: 20 }}
                                    >
                                        <Icon name="add" />
                                    </Fab>
                                    :
                                    null
                                }
                                {
                                    this.props.loader ? <View pointerEvents='none' style={{ justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', alignItems: "center" }}>
                                        <Loader />
                                    </View> : null
                                }
                            </Tab>
                            <Tab heading={<TabHeading style={{ flexDirection: 'column', backgroundColor: Styles.theme.backgroundColor }}>
                                {this.state.notificationsCount && <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Icon style={styles.tabIcon} name="ios-notifications" />
                                    <Badge danger style={{ height: screenHeight / 30, width: screenHeight / 0, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ fontSize: Styles.fonts.small, fontFamily: Styles.fonts.Bold }}>{this.state.notificationsCount}</Text>
                                    </Badge>
                                </View> || <Icon style={styles.tabIcon} name="ios-notifications" />
                                }
                                <Text style={styles.tabText}>Notifications</Text>
                            </TabHeading>}>
                                <Notification />
                            </Tab>
                            {
                                this.props.user && this.props.user.accountType == 'parent' ?
                                    <Tab heading={<TabHeading style={{ flexDirection: 'column', backgroundColor: Styles.theme.backgroundColor }}>
                                        <Icon style={styles.tabIcon} name="people" />
                                        <Text style={styles.tabText}>Childrens</Text>
                                    </TabHeading>}>
                                        <ChildrenScreen />
                                    </Tab>
                                    : null
                            }
                            {(this.props.user && this.props.user.accountType == 'teacher') &&
                                <Tab heading={<TabHeading style={{ flexDirection: 'column', backgroundColor: Styles.theme.backgroundColor }}>
                                    <Icon style={styles.tabIcon} name="md-person" />
                                    <Text style={styles.tabText}>Students</Text>
                                </TabHeading>}>
                                    <Userslist />
                                </Tab>
                            }
                        </Tabs>
                        {/* </Content> */}
                    </Drawer>
                </Drawer>
            </View>
        );
    };
};
const styles = StyleSheet.create({
    tabIcon: {
        fontSize: Styles.fonts.h2,
        color: Styles.theme.normalColor
    },
    tabText: {
        fontSize: Styles.fonts.medium,
        color: Styles.theme.normalColor,
        fontFamily: Styles.fonts.Bold
    }
})
const mapStateToProp = (state) => {
    console.log(state)
    return {
        posts: state.DataReducer.posts,
        request: [],
        user: state.AuthReducer.user,
        users: state.DataReducer.users,
        loader: state.DataReducer.postsLoader,
        lastScene: state.DataReducer.lastScene,
        notifications: state.DataReducer.notifications,
    };
};
const mapDispatchToProp = (dispatch) => {
    return {
        getPosts: () => {
            // dispatch(GetPosts())
            dispatch(DataAction.getData())
        },
        requests: () => {
            // dispatch(Requests())
        },
        getUsers: () => {
            dispatch(DataAction.getUsers())
        },
        clearStore: () => {
            dispatch(AuthAction.ClearStore())
        },
        fetchNotifications: () => {
            dispatch(DataAction.fetchNotifications())
        },
        getLastScene: (payload) => {
            dispatch(DataAction.getLastScene(payload))
        },
        fetchDoneTasks: (payload) => {
            dispatch(DataAction.fetchDoneTasks(payload))
        },
        listenUser: () => {
            dispatch(AuthAction.listUser())
        }
    };
};

export default connect(mapStateToProp, mapDispatchToProp)(Home);

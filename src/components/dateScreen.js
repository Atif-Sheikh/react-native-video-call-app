import React, { Component } from 'react';
import { View, Alert, Keyboard, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Item, Input, Text, Picker, Header, Icon, Title, Textarea } from 'native-base';
import moment from 'moment';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import { DataAction } from '../store/action';
import { screenHeight, screenWidth, Styles } from "../config";
import { Loader } from "./";

class DateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskTitle: '',
            taskDetails: '',
            studentClass: 0,
            file: null,
            date: this.props.navigation.state.params.date.dateString,
            created: new Date().getTime(),
            teacherId: props.user.Uid,
        };
    };
    static navigationOptions = {
        CustomHeader: null,
        header: null,
        Footer: null,
        FooterTab: null,
    };
    componentWillReceiveProps(props) {
        if (props.postSuccess) {
            Alert.alert(null, 'SuccessFully added', [{ text: 'OK', onPress: () => Actions.home() }]);
        }
    };
    onClassChange = (value) => {
        this.setState({
            studentClass: value
        });
    };
    postTask = () => {
        Keyboard.dismiss();
        let { taskTitle, taskDetails, studentClass } = this.state;
        if (taskTitle && taskDetails && studentClass) {
            this.props.postTask(this.state);
        } else {
            Alert.alert(null, 'Please fill all fields');
        }
    };
    imagepicker = () => {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response.uri);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response)
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    file: source.uri,
                    fileType: source.type
                });
            };
        });
    };
    render() {
        let date = this.props.navigation.state.params.date;
        return (
            <View style={{ height: screenHeight, width: screenWidth }}>
                <Header style={{ backgroundColor: Styles.theme.backgroundColor, height: screenHeight / 10, justifyContent: "space-between", width: screenWidth, flexDirection: "row" }}>
                    <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => Actions.pop()}>
                        <Icon name="arrow-back" style={{ color: Styles.theme.headerTextColor }} />
                    </TouchableOpacity>
                    <View style={{ width: "90%", justifyContent: "center", alignItems: "flex-start", paddingLeft: 20 }}>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>Post Screen</Title>
                    </View>
                </Header>
                <ScrollView style={{ height: screenHeight / 1.5 }}>
                    <View style={{ width: screenWidth / 1.1, alignSelf: "center", height: screenHeight / 1.5, justifyContent: "space-between" }}>
                        <Text style={{ color: Styles.theme.textColor, alignSelf: 'center', fontSize: Styles.fonts.h2, margin: 10, fontFamily: Styles.fonts.BoldItalic }}>Post Task date {moment(date.dateString).format("DD-MM-YYYY")}</Text>
                        <View style={{ height: screenHeight / 8, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={this.imagepicker} style={{ height: 70, width: 70, borderWidth: 2.0, borderColor: Styles.theme.backgroundColor, borderRadius: 35, justifyContent: "center", alignItems: "center" }}>
                                {this.state.file !== null ? <Image source={require("../../assets/icons/success.png")} style={{ height: "100%", width: "100%" }} resizeMode="cover" /> : <Icon name="ios-document" style={{ fontSize: Styles.fonts.large }} />}
                            </TouchableOpacity>
                        </View>
                        <Item regular style={{ height: screenHeight / 12, width: "100%", borderWidth: 1.0, borderColor: Styles.theme.borderColor, borderRadius: 5, justifyContent: "center" }}>
                            <Input value={this.state.taskTitle} placeholder="Enter Title" style={{ fontFamily: Styles.fonts.Normal }} onChangeText={(taskTitle) => this.setState({ taskTitle })} />
                        </Item>
                        <Textarea value={this.state.taskDetails} style={{ borderWidth: 1, borderRadius: 5, borderColor: Styles.theme.borderColor, fontFamily: Styles.fonts.Normal }} rowSpan={5} placeholder="Task Details" onChangeText={(taskDetails) => this.setState({ taskDetails })} />
                        <View style={{ height: screenHeight / 12, borderWidth: 1.0, width: "100%", borderRadius: 5, justifyContent: "center", borderColor: Styles.theme.borderColor }} >
                            <Picker
                                selectedValue={this.state.studentClass}
                                onValueChange={this.onClassChange}
                            >
                                {this.props.user && this.props.user.classArray && this.props.user.classArray.map((teacherClass) => (
                                    <Picker.Item label={teacherClass} value={teacherClass} />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity style={{ width: "100%", height: screenHeight / 13, backgroundColor: Styles.theme.buttonBackgroundColor, justifyContent: "center", alignItems: "center", borderRadius: 5 }} onPress={this.postTask} >
                            <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h2, color: Styles.theme.buttonTextColor }}>Submit Post</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
                {this.props.loader && <View style={{ justifyContent: 'center', position: 'absolute', width: screenWidth, height: screenHeight, backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <Loader />
                </View>
                }
            </View>
        );
    };
};

function mapStateToProp(state) {
    return ({
        loader: state.DataReducer.taskLoader,
        postSuccess: state.DataReducer.postTask,
        user: state.AuthReducer.user
    });
};
function mapDispatchToProp(dispatch) {
    return {
        postTask: (payload) => {
            dispatch(DataAction.PostTask(payload))
        },
    };
};

export default connect(mapStateToProp, mapDispatchToProp)(DateScreen);
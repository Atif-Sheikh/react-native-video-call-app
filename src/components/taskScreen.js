import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Header, Title, Icon, Textarea, Item } from "native-base";
import RNFetchBlob from "react-native-fetch-blob"
import moment from "moment";
import ImagePicker from 'react-native-image-picker';
import { screenHeight, screenWidth, Styles } from "../config";
import { connect } from "react-redux";
import { Loader } from "./";
import { DataAction } from "../store/action";
import { Actions } from "react-native-router-flux";
class TaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answerText: '',
            file: null,
            fileType: '',
            studentId: props.user.Uid,
            studentName: props.user.userName,
            studentClass: props.user.studentClass,
            teacherID: props.navigation.state.params.notification.teacherId,
            submitOn: new Date().getTime(),
            taskId: props.navigation.state.params.notification.key
        }
    }
    static navigationOptions = {
        header: null,
    };
    componentWillMount() {
        if (this.state.studentId && this.state.teacherID && this.state.taskId) {
            let obj = {
                studentId: this.state.studentId,
                taskId: this.state.taskId,
                teacherId: this.state.teacherID
            }
            this.props.fetchIfTaskDone(obj)
        }
    }
    componentWillUnmount() {
        this.props.clearDataReducer()
    }
    downloadImage(file) {
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob
            .config({
                // add this option that makes response data to be stored as a file,
                // this is much more performant.
                fileCache: true,
                path: dirs.DownloadDir,
                addAndroidDownloads: {
                    useDownloadManager: true, // <-- this is the only thing required
                    // Optional, override notification setting (default to true)
                    notification: true,
                    title: 'Great ! Download Success ! :O ',
                    // Optional, but recommended since android DownloadManager will fail when
                    // the url does not contains a file extension, by default the mime type will be text/plain
                    mime: file.fileType,
                    description: 'Downloading File...',
                    mediaScannable: true,
                }
            })
            .fetch('GET', file.file, {
                //some headers ..
            })
            .then((res) => {
            })

    }
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
    submitTaskAnswer() {
        if (this.state.answerText !== '') {
            this.props.submitTaskAnswer(this.state)
        }
        else {
            alert("Answer Section is Required")
        }
    }
    discardSubmittedTask = () => {
        const { studentId, teacherID, taskId } = this.state;
        console.log(studentId, teacherID, taskId, "checkkkk")
        Alert.alert(
            'Confirmation',
            'Are You Sure you want to Discard?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Confirm', onPress: () => {
                        let obj = {
                            studentId: this.state.studentId,
                            teacherId: this.state.teacherID,
                            taskId: this.state.taskId
                        }
                        this.props.discardSubmittedTask(obj)
                    }
                },
            ],
            { cancelable: false }
        )
    }
    render() {
        const task = this.props.navigation.state.params.notification
        return (
            <View style={{ height: screenHeight, backgroundColor: "#fff" }}>
                <Header style={{ backgroundColor: Styles.theme.backgroundColor, height: screenHeight / 10, justifyContent: "space-between", width: screenWidth, flexDirection: "row" }}>
                    <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => Actions.pop()}>
                        <Icon name="arrow-back" style={{ color: Styles.theme.headerTextColor }} />
                    </TouchableOpacity>
                    <View style={{ width: "90%", justifyContent: "center", alignItems: "flex-start", paddingLeft: 20 }}>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>Task Screen</Title>
                    </View>
                </Header>
                {this.props.fetchLoader ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Loader />
                    </View>
                    :
                    <ScrollView style={{ height: screenHeight }}>
                        <View style={{ height: screenHeight, width: "95%", alignSelf: "center" }}>
                            <View style={{ height: screenHeight / 15, justifyContent: "center", width: "100%", alignItems: "center" }}>
                                <Text style={{ fontFamily: Styles.fonts.Bold }}>Task You Are Assigned</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h3 }}>Title :</Text>
                                <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, padding: 10 }}>{task.taskTitle}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h3 }}>Details :</Text>
                                <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, padding: 10, maxWidth: "90%" }} numberOfLines={2}>{task.taskDetails}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h3 }}>Due Date :</Text>
                                <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, padding: 10 }}>{moment(task.date).format('MMMM Do YYYY')}</Text>
                            </View>
                            {task.file && task.file !== null && <TouchableOpacity onPress={() => this.downloadImage(task)} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, height: screenHeight / 13, backgroundColor: "#F1EEEE", alignItems: "center", borderRadius: 5 }}>
                                <Text style={{ fontFamily: Styles.fonts.Normal, }}>1 file is attached</Text>
                                <Icon name="md-download" />
                            </TouchableOpacity>}
                            {this.props.taskDone === null ?
                                <View>
                                    <View style={{ height: screenHeight / 15, justifyContent: "center", width: "100%", alignItems: "center" }}>
                                        <Text style={{ fontFamily: Styles.fonts.Bold }}>Your Answer Section</Text>
                                    </View>
                                    <Textarea onChangeText={(answerText) => this.setState({ answerText })} rowSpan={5} bordered placeholder="Write Your Answer" style={{ width: "100%", borderRadius: 5, fontFamily: Styles.fonts.Normal, marginTop: 10 }} />
                                    <TouchableOpacity onPress={() => this.imagepicker()} style={{ width: "100%", borderRadius: 5, height: screenHeight / 13, flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#F1EEEE", justifyContent: "space-between", marginTop: 10 }}>
                                        {this.state.file !== null ?
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                <Text style={{ fontFamily: Styles.fonts.Normal }}>File Selected</Text>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon name="ios-checkmark-circle" style={{ color: Styles.theme.backgroundColor }} />
                                                    <Icon onPress={() => this.setState({ file: null })} name="ios-trash" style={{ paddingLeft: 15, color: "red" }} />
                                                </View>
                                            </View> :
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                <Text style={{ fontFamily: Styles.fonts.Normal }}>Upload a File</Text>
                                                <Icon name="md-cloud-upload" />
                                            </View>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.submitTaskAnswer()} style={{ width: "100%", borderRadius: 5, height: screenHeight / 13, alignItems: "center", justifyContent: "center", padding: 10, backgroundColor: Styles.theme.buttonBackgroundColor, marginTop: 20 }}>
                                        <Text style={{ color: Styles.theme.buttonTextColor, fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h2 }}>Submit Task</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                this.props.taskDone && <View style={{ alignItems: "center", marginTop: 50 }}>
                                    <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h3, color: "gray" }}>You Done This Task ! Great</Text>
                                    <TouchableOpacity onPress={this.discardSubmittedTask} style={{ width: "100%", height: screenHeight / 13, justifyContent: "center", alignItems: "center", backgroundColor: Styles.theme.buttonBackgroundColor, borderRadius: 5, marginTop: 10, flexDirection: "row" }}>
                                        <Text style={{ color: Styles.theme.buttonTextColor, fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h3 }}>Discard Your Assignment</Text>
                                        <Icon name="ios-trash" style={{ color: Styles.theme.buttonTextColor, padding: 20 }} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </ScrollView>
                }
                {this.props.success && alert("successfully Posted Answer")}
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.AuthReducer.user,
        success: state.DataReducer.success,
        taskDone: state.DataReducer.taskDone,
        fetchLoader: state.DataReducer.fetchLoader,
        deleteSuccess: state.DataReducer.deleteSuccess
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        submitTaskAnswer: (payload) => {
            dispatch(DataAction.submitTaskAnswer(payload))
        },
        fetchIfTaskDone: (payload) => {
            dispatch(DataAction.fetchIfTaskDone(payload))
        },
        clearDataReducer: () => {
            dispatch(DataAction.clearRedux())
        },
        discardSubmittedTask: (payload) => {
            dispatch(DataAction.discardSubmittedTask(payload))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen);
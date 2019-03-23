import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableOpacity, Image, PixelRatio, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container, Header, Icon, Button, Left, Body, Content, Title,
    Form, Item, Input, Label, Picker, Text, Textarea, Thumbnail
} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { AuthAction, DataAction } from '../store/action/index';
import { Styles, screenHeight, screenWidth, fontScale } from "../config";
import { Loader } from "./index";
class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.user.userName,
            title: '',
            postType: 'Tip',
            class: 'One',
            photo: null,
            coveredContent: '',
            // name:props.user.userName,
            time: Date.now(),
            likes: 0,
            comments: 0,
            shares: 0,
            userPhoto: props.user.photo
        };
    };
    static navigationOptions = {
        header: null,
    };
    onValueChange = (value) => {
        this.setState({
            postType: value,
        });
    };
    selectPhotoTapped = () => {
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
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    photo: source.uri
                });
            };
        });
    };
    componentWillReceiveProps(props) {
        if (props.success) {
            this.setState({
                photo: null,
                title: "",
                postType: "",
                coveredContent: "",
                time: Date.now(),
                class: "One",
            })
        }
    };
    _focusNextField = (nextField) => {
        this.refs[nextField]._root.focus();
    };
    saveData = () => {
        const { title, coveredContent } = this.state;
        if (title && coveredContent) {
            this.props.SaveData(this.state);
        } else {
            Alert.alert(null, 'Please fill form correctly!');
        }
        // Actions.home();
        // console.log('asd')
    };
    render() {
        var photo = JSON.stringify(this.state.photo)
        // console.warn(this.state.class)
        return (
            <View style={{ height: screenHeight }}>
                <ScrollView style={{ height: "100%" }}>
                    <Form style={{ height: screenHeight / 1.5, width: screenWidth / 1.1, justifyContent: "space-around", alignSelf: "center" }} >
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)} style={{ alignSelf: "center" }}>
                            <View style={styles.avatarContainer}>
                                {this.state.photo === null ?
                                    <Icon name="ios-camera" style={{ fontSize: fontScale * 50, color: Styles.theme.textColor }} />
                                    :

                                    <Thumbnail style={{ height: "100%", width: "100%", borderRadius: 75 }} source={{ uri: this.state.photo }} resizeMode="cover" />
                                }
                            </View>
                        </TouchableOpacity>
                        <View style={{ justifyContent: "space-around", flexDirection: "row", width: "100%" }}>
                            <View style={{ width: "45%", height: screenHeight / 14, borderWidth: 1.5, borderColor: Styles.theme.borderColor, backgroundColor: "#fff", borderRadius: 4 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-dropdown-circle"
                                        style={{ color: "#007aff", fontSize: 25, height: "30%", backgroundColor: "red" }} />}
                                    selectedValue={this.state.postType}
                                    onValueChange={this.onValueChange}
                                    itemTextStyle={{ fontFamily: Styles.fonts.Normal }}
                                >
                                    <Picker.Item label="Post type" value="0" />
                                    <Picker.Item label="Tip" value="Tip" />
                                    <Picker.Item label="Update" value="Update" />
                                </Picker>
                            </View>
                            <View style={{ width: "45%", height: screenHeight / 14, borderWidth: 1.5, borderColor: Styles.theme.borderColor, backgroundColor: "#fff", borderRadius: 4 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-dropdown-circle"
                                        style={{ color: "#007aff", fontSize: 25, height: "30%", }} />}
                                    selectedValue={this.state.class}
                                    onValueChange={this.onClassChange}
                                >
                                    <Picker.Item label="Class i" value="One" />
                                    <Picker.Item label="Class ii" value="Two" />
                                    <Picker.Item label="Class iii" value="Three" />
                                    <Picker.Item label="Class iv" value="Four" />
                                    <Picker.Item label="Class v" value="Five" />
                                    <Picker.Item label="Class vi" value="Six" />
                                    <Picker.Item label="Class vii" value="Seven" />
                                    <Picker.Item label="Class viii" value="Eight" />
                                    <Picker.Item label="Class ix" value="Nine" />
                                    <Picker.Item label="Class x" value="Ten" />

                                </Picker>
                            </View>
                        </View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: "space-around", width: "100%" }}>
                                <View style={{ width: "40%" }}>
                                    <Text style={{ color: Styles.theme.textColor, fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h2 }}>Class:</Text>
                                </View>
                                <View style={{ width: "60%" }}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-dropdown-circle"
                                            style={{ color: "#007aff", fontSize: 25, height: "30%", backgroundColor: "red" }} />}
                                        selectedValue={this.state.class}
                                        headerStyle={{ backgroundColor: "red" }}
                                        onValueChange={this.onClassChange}
                                    >
                                        <Picker.Item label="i" value="One" />
                                        <Picker.Item label="ii" value="Two" />
                                        <Picker.Item label="iii" value="Three" />
                                        <Picker.Item label="iv" value="Four" />
                                        <Picker.Item label="vi" value="Five" />
                                        <Picker.Item label="vii" value="Five" />
                                        <Picker.Item label="viii" value="Five" />
                                        <Picker.Item label="ix" value="Five" />
                                        <Picker.Item label="x" value="Five" />
                                    </Picker>
                                </View>
                            </View> */}
                        <Item stackedLabel style={{ marginLeft: 0, height: screenHeight / 8 }}>
                            <Label style={{ fontFamily: Styles.fonts.Normal, color: Styles.theme.textColor }}>Post Name</Label>
                            <Input ref="title" onSubmitEditing={() => this._focusNextField('content')} returnKeyType={"next"} style={{ fontFamily: Styles.fonts.Normal, color: Styles.theme.inputTextColor, paddingTop: -10 }} value={this.state.title} onChangeText={(title) => this.setState({ title })} />
                        </Item>
                        <Item stackedLabel style={{ marginLeft: 0, height: screenHeight / 8 }}>
                            <Label style={{ fontFamily: Styles.fonts.Normal, color: Styles.theme.textColor }}>Covered Content</Label>
                            <Input ref="content" onSubmitEditing={() => this._focusNextField('title')} returnKeyType={"next"} style={{ fontFamily: Styles.fonts.Normal, color: Styles.theme.inputTextColor, paddingTop: -10 }} value={this.state.coveredContent} onChangeText={(coveredContent) => this.setState({ coveredContent })} />
                        </Item>
                        {/* <Image
                                style={{width: 200, height: 100}}
                                source={{uri: 'file:///storage/emulated/0/Android/data/com.socialapp/files/Pictures/image-3c3a20db-2bef-4a26-b049-bff38206c0da.jpg'}}
                            /> */}
                        <TouchableOpacity onPress={this.saveData} style={{ justifyContent: "center", backgroundColor: Styles.theme.buttonBackgroundColor, alignSelf: "center", marginTop: 10, width: "100%", height: screenHeight / 13, borderRadius: 5 }} >
                            <Text style={{ fontSize: Styles.fonts.h1, fontFamily: Styles.fonts.BoldItalic, alignSelf: "center", color: Styles.theme.buttonTextColor }}> Post </Text>
                        </TouchableOpacity>
                    </Form>
                </ScrollView >
                {
                    this.props.loader ? <View style={{ justifyContent: 'center', position: 'absolute', height: screenHeight, width: screenWidth, backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <Loader />
                    </View> : null
                }
            </View>
        );
    };
};
function mapStateToProp(state) {
    return ({
        user: state.AuthReducer.user,
        loader: state.DataReducer.postLoader,
        success: state.DataReducer.postData
    });
};
function mapDispatchToProp(dispatch) {
    return {
        SaveData: (obj) => {
            dispatch(DataAction.postData(obj))
        }
    };
};
const styles = StyleSheet.create({
    avatarContainer: {
        borderColor: Styles.theme.borderColor,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 75,
        width: 70,
        height: 70,
        marginTop: 10
    },
});
export default connect(mapStateToProp, mapDispatchToProp)(Post);
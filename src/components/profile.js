import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import {
    Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, Segment, Thumbnail,
    Form, Item, Input, Label
} from "native-base";
import { Actions } from 'react-native-router-flux';
const { height, width, fontScale } = Dimensions.get('window');
import { AuthAction, DataAction, AttendanceAction } from '../store/action/index';
import ImagePicker from 'react-native-image-picker';
import MultiSelect from './MultiPickcer';
import { Styles, screenHeight, screenWidth } from "../config";
import { connect } from 'react-redux';
import Loader from './loader';
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            about: true,
            photos: false,
            friends: false,
            pickerModal: false,
            email: props.user.email,
            name: props.user.userName,
            photo: props.user.photo,
            number: props.user.number,
            classList: ["One", 'Two', 'Three', 'Four', 'Five', 'Six'],
            classArray: props.user.classArray || [],
        };
    };
    static navigationOptions = {
        header: null,
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
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    photo: source.uri
                });
            };
        });
    };
    // componentWillReceiveProps(props){
    //     if(props.update){
    //         Alert.alert(null, 'Updated', [{text: 'OK', onPress: () => Actions.home()}]);
    //     };
    // };
    update = () => {
        let { name, number, email, photo, classArray } = this.state

        let obj = {
            userName: name,
            number,
            email,
            photo,
            classArray
        }
        if (photo == this.props.user.photo) {
            delete obj['photo'];
        }
        this.props.UpdateProfile(obj);
    }
    _focusNextField = (nextField) => {
        this.refs[nextField]._root.focus();
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.update) {
            alert("Successfully Updated");
            this.props.clearRedux();
        }
    }
    render() {
        // console.warn(this.props.user)
        return (
            // <ScrollView>
            <Container>
                <Header style={{ backgroundColor: Styles.theme.headerBackgroundColor, height: screenHeight / 10, flexDirection: "row", justifyContent: "space-around" }} hasTabs span>
                    <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => Actions.pop()}>
                        <Icon name="arrow-back" style={{ color: "#fff" }} />
                    </TouchableOpacity>
                    <View style={{ width: "90%", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h1, color: Styles.theme.headerTextColor }}>Edit Profile</Text>
                    </View>
                </Header>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%", height: screenHeight / 4, backgroundColor: Styles.theme.backgroundColor }}>
                    <TouchableOpacity onPress={this.imagepicker} style={{ height: 100, width: 100, borderRadius: 50 }}  >
                        <Thumbnail resizeMode="cover" source={this.state.photo ? { uri: this.state.photo } : require("../images/face.jpg")} style={{ height: "100%", width: "100%", borderWidth: 2.0, borderColor: "grey", borderRadius: 50 }} />
                    </TouchableOpacity>
                    <Title style={{ paddingTop: 10, fontFamily: Styles.fonts.BoldItalic }}>{this.state.name}</Title>
                </View>
                <ScrollView style={{ height: height / 1.6 }}>
                    <View style={{ height: height / 1.6 }} >
                        {
                            this.state.about ? <Form style={{ marginTop: 10, flex: 1, justifyContent: "space-between" }}>
                                <View style={{ width: screenWidth / 1.1, alignSelf: "center", justifyContent: "space-around", flex: 1 }}>
                                    <Item style={styles.item} regular>
                                        {/* <Label >Email</Label> */}
                                        <Input value={this.state.email} placeholder={this.state.email && null || "No Email Found"} disabled style={styles.inputStyle} />
                                    </Item>
                                    <Item style={styles.item} regular>
                                        <Input returnKeyType='next' onSubmitEditing={() => this._focusNextField('number')} value={this.state.name} placeholder={this.state.name && null || "No Name Found"} onChangeText={(name) => this.setState({ name })} style={styles.inputStyle} />
                                    </Item>
                                    <Item style={styles.item} regular>
                                        <Input ref="number" maxLength={13} keyboardType='numeric' placeholder={this.state.number && null || "No Number Found"} value={this.state.number} onChangeText={(number) => this.setState({ number })} style={styles.inputStyle} />
                                    </Item>
                                    {
                                        this.props.user && this.props.user.accountType == 'student' || this.props.user.accountType == 'teacher' ? <View>
                                            {
                                                this.props.user.accountType == 'student' ? <Item style={styles.item} regular>
                                                    <Input disabled value={"Class " + this.props.user.studentClass} style={styles.inputStyle} />
                                                </Item>
                                                    :
                                                    <TouchableOpacity onPress={() => this.setState({ pickerModal: true })} style={{ borderWidth: 1.0, borderColor: Styles.theme.borderColor, borderRadius: 5, justifyContent: "center", height: screenHeight / 13 }}>
                                                        <Text style={{ fontFamily: Styles.fonts.Normal, padding: 10 }}>Update Classes</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View> : null
                                    }
                                    {this.state.pickerModal && <MultiSelect
                                        userItem={this.state.classArray}
                                        item={this.state.classList}
                                        that={this}
                                        title="Please Select Your Class"
                                        onValue={(value) => {
                                            this.setState({ classArray: value })
                                        }}
                                    />}
                                    {this.props.loader ? <Loader />
                                        : <TouchableOpacity onPress={this.update} style={{ borderRadius: 5, width: "100%", height: screenHeight / 13, justifyContent: "center", alignItems: "center", backgroundColor: Styles.theme.buttonBackgroundColor }}>
                                            <Text style={{ color: Styles.theme.buttonTextColor, fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h2 }}>Update Profile</Text>
                                            {/* <Button onPress={this.update} style={{ width: width / 2.5, alignSelf: "center", justifyContent: "center", alignItems: "center", backgroundColor: "#196ABE" }}><Text>Update</Text></Button> */}
                                        </TouchableOpacity>
                                    }
                                </View>
                            </Form> : null
                        }
                        {
                            this.state.photos ? <View style={{ marginTop: height / 15 }}>
                                <Text>Photos</Text>
                            </View> : null
                        }
                        {
                            this.state.friends ? <View style={{ marginTop: height / 15 }}>
                                <Text>Friends</Text>
                            </View> : null
                        }
                    </View>
                </ScrollView>
            </Container>
        );
    };
};
const styles = StyleSheet.create({
    item: {
        marginLeft: 0,
        borderWidth: 1.0,
        // marginTop:10,
        borderColor: Styles.theme.inputBorderColor,
        borderRadius: 5,
    },
    inputStyle: {
        padding: 10,
        fontFamily: Styles.fonts.Normal,
        // fontSize:Styles.fonts.regular
    }
})
const mapStateToProp = (state) => {
    return {
        user: state.AuthReducer.user,
        updateError: state.AuthReducer.updateError,
        loader: state.AuthReducer.updateLoader,
        update: state.AuthReducer.update,
    };
};
const mapDispatchToProp = (dispatch) => {
    return {
        UpdateProfile: (payload) => {
            // dispatch(GetPosts())
            dispatch(AuthAction.updateProfile(payload))
        },
        clearRedux: () => {
            dispatch(AuthAction.ClearStore())
        }
    };
};
export default connect(mapStateToProp, mapDispatchToProp)(Profile);
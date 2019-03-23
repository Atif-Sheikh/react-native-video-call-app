import React, { Component } from 'react';
import { Dimensions, Button, ScrollView, TouchableOpacity, Keyboard, Modal, Alert } from 'react-native';
import { View, Text, Item, Input, Icon, Content, Body, Right, Thumbnail, List, ListItem } from 'native-base';
import { DataAction } from '../store/action/index';
import { connect } from 'react-redux';
import { Loader } from "./";
import { Styles, screenHeight, screenWidth } from "../config";
import ChildsModel from "./childModel";
const { height, width, fontScale } = Dimensions.get('window');

class AddChild extends Component {
    constructor() {
        super();
        this.state = {
            parents: [],
            students: [],
            inputBox: "",
            childsofParents: [],
            selectParent: false,
            selectedStudents: [],
            filteredParents: [],
            filteredStudents: [],
            selectedParent: {},
            modal: false,
        };
    };
    componentWillMount() {
        if (this.props.users) {
            let data = this.props.users;
            let parents = [];
            let students = [];
            for (let key in data) {
                if (data[key]['accountType'] === 'parent') {
                    parents.push(data[key]);
                } else if (data[key]['accountType'] === 'student') {
                    students.push(data[key]);
                }
            };
            this.setState({ parents, students });
        };
    };
    _onPressParent = (user) => {
        Keyboard.dismiss();
        let childs = [];
        for (let keys in user.childs) {
            childs.push(user.childs[keys])
        }
        this.setState({ selectedParent: user, filteredParents: [], selectParent: true, inputBox: '', modal: true, childsofParents: childs });
    };
    _onPressStudent = (user, index) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to add?',
            [
                { text: "Cancel", style: 'cancel' },
                {
                    text: "Confirm", onPress: () => {
                        Keyboard.dismiss();
                        let parentUid = this.state.selectedParent.Uid;
                        var filteredStudents = this.state.filteredStudents;
                        filteredStudents.splice(index, 1);
                        var students = this.state.students.filter((student) => student.Uid !== user.Uid);
                        let obj = { user, parentUid };
                        this.setState({ childsofParents: [...this.state.childsofParents, user], filteredStudents: filteredStudents, students });
                        this.props.selectChilds(obj);
                    }
                }
            ]
        )
    };
    _onPressCross = (student, index) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to remove?',
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm", onPress: () => {
                        let childsofParents = this.state.childsofParents;
                        let obj = {
                            parentUid: this.state.selectedParent.Uid,
                            childUid: student.Uid,
                        };
                        childsofParents.splice(index, 1);
                        var students = this.state.students;
                        students.push(student)
                        this.setState({ childsofParents, students: students });
                        this.props.removeChild(obj);
                    }
                }
            ]
        )

    };
    onSearch = (val, key) => {
        this.setState({ inputBox: val})
        if (val) {
            if (key === 'parent') {
                let searched = this.state.parents.filter(text => text.userName.includes(val.toLowerCase()) || text.email.includes(val.toLowerCase()));
                this.setState({ filteredParents: searched,});
            }
            else {
                let searched = this.state.students.filter(text => (text.userName.includes(val.toLowerCase()) || text.email.includes(val.toLowerCase())) && !text.linked);
                this.setState({ filteredStudents: searched,});
            }
        }
        else {
            this.setState({ filteredParents: [], filteredStudents: [] });

        }
    };
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ alignSelf: 'center', margin: 10 }}>
                        <Text style={{ color: Styles.theme.headingColor, fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h1, padding: 10 }}>Search Parent</Text>
                    </View>
                    <Item rounded style={{ borderColor: Styles.theme.inputBorderColor, borderWidth: 2, width: screenWidth / 1.1, alignSelf: "center", justifyContent: "space-around" }}>
                        <Input style={{ width: "88%", fontFamily: Styles.fonts.Normal }} value={this.state.inputBox} onChangeText={(val) => this.onSearch(val, 'parent')} placeholder='Search Parent by email or name' />
                        <Icon style={{ width: "12%" }} active name='search' />
                    </Item>
                    <Content>
                        <ScrollView>
                            {this.state.modal === true ?
                                <ChildsModel parent={this.state.selectedParent} open={this.state.modal} that={this} />
                                :
                                <View />
                            }
                            {
                                this.state.filteredParents ? this.state.filteredParents.map((user, index) => {
                                    return <View key={index} style={{ height: screenHeight / 8, width: screenWidth / 1.1, alignSelf: "center", margin: 10, borderWidth: 2.0, borderColor: Styles.theme.borderColor, borderRadius: 4, justifyContent: "center" }}>
                                        <View style={{ justifyContent: "space-around", flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ height: "100%", width: "70%" }}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ marginLeft: 5, fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h2 }}>Name: </Text>
                                                    <Text styl={{ fontFamily: Styles.fonts.Normal }}>{user.userName}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ marginLeft: 5, fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.h2 }}>Email: </Text>
                                                    <Text style={{ fontFamily: Styles.fonts.Normal, maxWidth: "70%" }} numberOfLines={1}>
                                                        {user.email}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ width: "30%", justifyContent: "center" }}>
                                                <TouchableOpacity onPress={() => this._onPressParent(user)} style={{ height: "50%", width: "90%", backgroundColor: Styles.theme.buttonBackgroundColor, alignSelf: "center", borderRadius: 4, alignItems: "center", justifyContent: "center" }}>
                                                    <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.regular, color: Styles.theme.buttonTextColor }}>Find Child</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                }) : <Text style={{ alignSelf: 'center', fontSize: fontScale * 18 }}>No result...</Text>
                            }
                        </ScrollView>
                        {/* {
                            this.state.selectedParent.userName && this.state.selectedParent ? <List style={{ marginTop: 10, justifyContent: 'center' }}>
                                <Text style={{ fontSize: fontScale * 18, color: 'grey', alignSelf: 'center', margin: 10 }}>Parent</Text>
                                <ListItem style={{ height: height / 15 }} avatar>
                                    <Thumbnail small source={this.state.selectedParent.photo ? { uri: this.state.selectedParent.photo } : require('../images/face.jpg')} />
                                    <View style={{ height: height / 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 10, marginLeft: 20 }}>{this.state.selectedParent.userName}</Text>
                                        <Text style={{ fontSize: 10, marginLeft: 20 }}>{this.state.selectedParent.email}</Text>
                                    </View>
                                </ListItem>
                            </List> : null
                        } */}
                        {/* {
                            this.state.filteredStudents.length ? <Text style={{ alignSelf: 'center', fontSize: fontScale * 18 }}>Select Students from the list</Text> : null
                        }
                        {
                            this.state.filteredStudents ? this.state.filteredStudents.map((user, index) => {
                                return <View key={index} style={{ flex: 1, justifyContent: 'center', height: height / 22, margin: 10, padding: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: 'grey' }}>
                                    <Text style={{ flex: 1, marginLeft: 5, fontWeight: 'normal', fontSize: fontScale * 14 }}>Name: {user.userName}</Text>
                                    <Text style={{ flex: 2, marginLeft: 5, fontWeight: 'normal', fontSize: fontScale * 14 }}>Email: {user.email}</Text>
                                    <TouchableOpacity onPress={() => this._onPressStudent(user)}>
                                        <Icon name='ios-add' />
                                    </TouchableOpacity>
                                </View>
                            }) : <Text style={{ alignSelf: 'center', fontSize: fontScale * 18 }}>No result...</Text>
                        } */}
                        {/* {
                            this.state.selectedStudents.length ? <Text style={{ alignSelf: 'center', fontSize: fontScale * 18, color: 'grey' }}>Selected Childs</Text> : null
                        } */}
                        {/* {
                            this.state.selectedStudents.length ? this.state.selectedStudents.map((student, index) => {
                                return <List key={index} style={{ marginTop: 10, justifyContent: 'center' }}>
                                    <ListItem style={{ height: height / 15 }} avatar>
                                        <Thumbnail small source={student.photo ? { uri: student.photo } : require('../images/face.jpg')} />
                                        <View style={{ flex: 1, justifyContent: 'center', height: height / 22, margin: 10, padding: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 5, borderWidth: 0 }}>
                                            <Text style={{ flex: 1, fontSize: 10, marginLeft: 5, fontWeight: 'normal', fontSize: fontScale * 14 }}>{student.userName}</Text>
                                            <Text style={{ flex: 2, fontSize: 10, marginLeft: 5, fontWeight: 'normal', fontSize: fontScale * 14 }}>{student.email}</Text>
                                            <TouchableOpacity onPress={() => this._onPressCross(student, index)}>
                                                <Icon name='ios-close' />
                                            </TouchableOpacity>
                                        </View>
                                    </ListItem>
                                </List>
                            }) : null
                        } */}
                    </Content>
                </ScrollView>
            </View>
        );
    };
};

function mapStateToProps(state) {
    return {
        users: state.DataReducer.users,
    }
};
function mapDispatchToProps(dispatch) {
    return {
        selectChilds: (obj) => {
            dispatch(DataAction.SelectChilds(obj))
        },
        removeChild: (obj) => {
            dispatch(DataAction.removeChild(obj))
        },
        update: () => {
            dispatch(DataAction.removeChild(obj))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddChild);
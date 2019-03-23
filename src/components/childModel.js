import React, { Component } from 'react';
import { Dimensions, Button, ScrollView, TouchableOpacity, Keyboard, Modal, Alert } from 'react-native';
import { View, Text, Item, Input, Icon, Content, Body, Right, Thumbnail, List, ListItem } from 'native-base';
import { DataAction } from '../store/action/index';
import { connect } from 'react-redux';
import Loader from "./loader";
import { Styles, screenHeight, screenWidth } from "../config";
class ChildModal extends React.Component {
    constructor(props) {
        super(props);
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
            modal: true,
        };
    }
    componentWillMount() {
        var parent = this.props.parent;
        if (parent) {
            this.setState({ selectedParent: parent }, () => {
                this.props.fetchParentChilds(parent.Uid)
                this.props.getUsers();
            })
        }
    }
    componentWillUnmount(){
        this.props.clearRedux();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            // console.log(nextProps)
            if (nextProps.users) {
                var users = nextProps.users;
                var students = [];
                for (let keys in users) {
                    if (users[keys]['accountType'] === "student") {
                        students.push(users[keys])
                    }
                }
                this.setState({ students })
            }
            if (nextProps.childs !== null) {
                var data = nextProps.childs;
                var childs = [];
                for (let keys in data) {
                    childs.push(data[keys])
                }
                this.setState({ childsofParents: childs })
            }
        }
    }
    _onPressStudent = (user, index) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to add?',
            [
                { text: "Cancel", style: 'cancel' },
                {
                    text: "Confirm", onPress: () => {
                        Keyboard.dismiss();
                        console.log(this.state.selectedParent)
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
        this.setState({ inputBox: val })
        if (val) {
            if (key === 'parent') {
                let searched = this.state.parents.filter(text => text.userName.includes(val.toLowerCase()) || text.email.includes(val.toLowerCase()));
                this.setState({ filteredParents: searched });
            }
            else {
                let searched = this.state.students.filter(text => (text.userName.includes(val.toLowerCase()) || text.email.includes(val.toLowerCase())) && !text.linked);
                this.setState({ filteredStudents: searched });
            }
        }
        else {
            this.setState({ filteredParents: [], filteredStudents: [] });

        }
    };
    render() {
        let that = this.props.that;

        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={that.state.modal}
                onRequestClose={() => {
                    that.setState({ modal: false })
                }}>
                <View style={{ justifyContent: "space-between", flexDirection: "row", padding: 20, backgroundColor: Styles.theme.backgroundColor }}>
                    <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h1, color: Styles.theme.normalColor }}>Select Child</Text>
                    <TouchableOpacity onPress={() => that.setState({ modal: false })}>
                        <Icon name="close" style={{ color: Styles.theme.normalColor }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "90%", alignSelf: "center", marginTop: 5, marginBottom: 5 }}>
                    <Item rounded style={{ width: "100%", borderWidthL: 2, borderColor: Styles.theme.borderColor, justifyContent: "space-between", flexDirection: "row" }}>
                        <Input placeholder="Search By Name" style={{ fontFamily: Styles.fonts.Normal }} onChangeText={(val) => this.onSearch(val, 'child')} />
                        <Icon name="search" />
                    </Item>
                </View>
                <ScrollView style={{ height: screenHeight }}>
                    <View style={{ flex: 1, width: screenWidth / 1.1, alignSelf: "center" }}>
                        <View style={{ marginBottom: this.state.childsofParents.length > 0 ? 20 : 0 }}>
                            {this.state.inputBox.length === 0 ?
                                <View>
                                    {this.props.loader && <View style={{ height: screenHeight / 2, justifyContent: "center", alignItems: "center" }}><Loader /></View>}
                                    {/* {this.state.childsofParents.length !== 0 ?
                                        <View style={{ height: screenHeight / 15, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h3 }}>Your Childs</Text>
                                        </View>
                                        :
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.regular }}>No Child Found</Text>
                                        </View>
                                    } */}
                                    {this.state.childsofParents && this.state.childsofParents.length > 0?
                                        <View>
                                            <View style={{height:screenHeight/15,justifyContent:"center",alignItems:"center"}}>
                                                <Text style={{fontFamily:Styles.fonts.Bold,fontSize:Styles.fonts.h2,color:Styles.theme.textColor}}>Currently Enrolled Child</Text>
                                            </View>
                                            {this.state.childsofParents.map((student, index) => {
                                                return (
                                                    <ListItem key={index} style={{ width: "100%", height: screenHeight / 9, marginLeft: 0, flexDirection: "row", justifyContent: "space-around", marginBottom: 10, borderRadius: 4, backgroundColor: Styles.theme.backgroundColor }}>
                                                        <View style={{ width: "90%", padding: 10 }}>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ fontFamily: Styles.fonts.Bold, color: Styles.theme.normalColor }}>Name :</Text><Text style={{ fontFamily: Styles.fonts.Normal, paddingLeft: 5, color: Styles.theme.normalColor }}>{student.userName}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ fontFamily: Styles.fonts.Bold, color: Styles.theme.normalColor }}>Email :</Text><Text numberOfLines={1} style={{ fontFamily: Styles.fonts.Normal, paddingLeft: 5, color: Styles.theme.normalColor, maxWidth: "80%" }}>{student.email}</Text>
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => this._onPressCross(student, index)}>
                                                            <Icon name="close" style={{ color: Styles.theme.normalColor }} />
                                                        </TouchableOpacity>
                                                    </ListItem>
                                                )
                                            })
                                            }
                                        </View>
                                        :
                                        this.props.loader===false && 
                                        <View style={{height:screenHeight/10,justifyContent:"center",alignItems:"center"}}>
                                            <Text style={{fontFamily:Styles.fonts.BoldItalic,fontSize:Styles.fonts.h3,color:"gray"}}>No Child Found</Text>
                                        </View>
                                    }
                                </View>
                                :
                                this.state.filteredStudents && this.state.filteredStudents.map((student, index) => {
                                    return (
                                        <ListItem key={index} style={{ width: "100%", height: screenHeight / 9, marginLeft: 0, flexDirection: "row", justifyContent: "space-around", marginBottom: 10, borderRadius: 4, backgroundColor: Styles.theme.backgroundColor }}>
                                            <View style={{ width: "90%", padding: 10 }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontFamily: Styles.fonts.Bold, color: Styles.theme.normalColor }}>Name :</Text><Text style={{ fontFamily: Styles.fonts.Normal, paddingLeft: 5, color: Styles.theme.normalColor }}>{student.userName}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontFamily: Styles.fonts.Bold, color: Styles.theme.normalColor }}>Email :</Text><Text numberOfLines={1} style={{ fontFamily: Styles.fonts.Normal, paddingLeft: 5, color: Styles.theme.normalColor, maxWidth: "80%" }}>{student.email}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => this._onPressStudent(student, index)}>
                                                <Icon name="add" style={{ color: Styles.theme.normalColor }} />
                                            </TouchableOpacity>
                                        </ListItem>
                                    )
                                })}
                        </View>
                    </View>
                </ScrollView>
            </Modal>

        )
    }
}
function mapStateToProps(state) {
    return {
        childs: state.DataReducer.childs,
        users: state.DataReducer.users,
        loader: state.DataReducer.loader
    }
};
function mapDispatchToProps(dispatch) {
    return {
        fetchParentChilds: (payload) => { dispatch(DataAction.fetchParentChilds(payload)) },
        getUsers: () => { dispatch(DataAction.getUsers()) },
        selectChilds: (obj) => {
            dispatch(DataAction.SelectChilds(obj))
        },
        removeChild: (obj) => {
            dispatch(DataAction.removeChild(obj))
        },
        clearRedux:()=>{
            dispatch(DataAction.clearRedux())
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChildModal);

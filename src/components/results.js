import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Header, Icon, Title, Picker, Item, Input, Label, Container, CheckBox, Form } from "native-base";
import { Actions } from "react-native-router-flux";
import { screenHeight, screenWidth, Styles } from "../config";
import Loader from "./loader";
import { DataAction } from "../store/action";
import AutoScroll from "react-native-auto-scroll";
import { connect } from "react-redux";
class Results extends React.Component {
    constructor() {
        super();
        this.state = {
            checked: false,
            selectedStudent: "",
            examTerm: 1,
            percentage: "",
            grade: "",
            students: [],
            result: [],
            firstTerm: {},
            midTerm: {},
            finalTerm: {},
            teacherClass: [],
            selectedClass: "",
            filteredStudents: []
        }
    }
    static navigationOptions = {
        CustomHeader: null,
        header: null,
        Footer: null,
        FooterTab: null,
    };
    componentWillMount() {
        if (this.props.user.accountType === "teacher") {
            this.props.fetchUsers()
        }
        if (this.props.user.accountType === "student") {
            var studentUid = this.props.user.Uid;
            this.props.fetchResult(studentUid)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (this.props.user.accountType === "teacher") {
                if (nextProps.user && nextProps.users) {
                    var teacherClass = nextProps.user.classArray && nextProps.user.classArray
                    var users = nextProps.users;
                    var students = [];
                    for (let keys in users) {
                        if (users[keys]['accountType'] === "student") {
                            students.push(users[keys])
                        }
                    }
                    var data = [];
                    if (students && teacherClass) {
                        for (var i = 0; i < students.length; i++) {
                            for (var j = 0; j < teacherClass.length; j++) {
                                if (students[i]['studentClass'] === teacherClass[j]) {
                                    data.push(students[i])
                                }
                            }
                        }
                        var filteredStudents = data.filter((student) => student.studentClass === teacherClass[0])
                        this.setState({ students: data, selectedStudent: 0, examTerm: 0, teacherClass, filteredStudents })
                    }
                }
            }
            if (this.props.user.accountType === "student") {
                if (nextProps.result) {
                    var data = nextProps.result
                    var result = []
                    for (let keys in data) {
                        result.push(data[keys])
                    }
                    console.log(result)
                    var firstTerm = result.filter(res => res.examTerm === 1);
                    var midTerm = result.filter(res => res.examTerm === 2);
                    var finalTerm = result.filter(res => res.examTerm === 3);
                    this.setState({ firstTerm, midTerm, finalTerm })
                }
            }
        }
    }
    handleSubmit = () => {
        var index = this.state.selectedStudent
        var student = this.state.students[index]
        var obj = {
            studentUid: student.Uid,
            examTerm: this.state.examTerm,
            percentage: this.state.percentage,
            grade: this.state.grade,
            passed: this.state.checked
        }
        this.props.submitMarks(obj)
    }
    filterStudent = (value) => {
        if (value) {
            this.setState({ selectedClass: value })
            var student = this.state.students;
            var filteredStudents = student.filter((student) => student.studentClass === value)
            this.setState({ filteredStudents })
        }
    }
    _focusNextField = (nextField) => {
        this.refs[nextField]._root.focus();
    };
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: Styles.theme.backgroundColor, height: screenHeight / 10, justifyContent: "space-between", width: screenWidth, flexDirection: "row" }}>
                    <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => Actions.pop()}>
                        <Icon name="arrow-back" style={{ color: Styles.theme.headerTextColor }} />
                    </TouchableOpacity>
                    <View style={{ width: "90%", justifyContent: "center", alignItems: "flex-start", paddingLeft: 20 }}>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>Results</Title>
                    </View>
                </Header>
                {this.props.loader === false ?
                    this.props.user.accountType === "teacher" ?
                        <AutoScroll>
                            <Form>
                                <View style={{ justifyContent: "space-around", width: screenWidth / 1.1, alignSelf: "center", paddingTop: 20, height: screenHeight / 1.5 }}>
                                    <View style={{ height: screenHeight / 12, borderWidth: 2.0, borderColor: Styles.theme.borderColor, borderRadius: 5, backgroundColor: Styles.theme.backgroundColor }}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.selectedClass}
                                            onValueChange={this.filterStudent}
                                        >
                                            {this.state.teacherClass && this.state.teacherClass.length > 0 ?
                                                this.state.teacherClass.map((className, index) => {
                                                    return (
                                                        <Picker.Item label={className} value={className} />
                                                    )
                                                })
                                                :
                                                <Picker.Item label="No Class Found" />
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{ height: screenHeight / 12, borderWidth: 2.0, borderColor: Styles.theme.borderColor, borderRadius: 5, backgroundColor: Styles.theme.backgroundColor }}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.selectedStudent}
                                            onValueChange={(value) => { this.setState({ selectedStudent: value }) }}
                                        >
                                            {this.state.filteredStudents && this.state.filteredStudents.length > 0 ?
                                                this.state.filteredStudents.map((student, index) => {
                                                    return (
                                                        <Picker.Item label={student.userName} value={index} />
                                                    )
                                                })
                                                :
                                                <Picker.Item label="No Student Found" />
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{ height: screenHeight / 12, borderWidth: 2.0, borderColor: Styles.theme.borderColor, borderRadius: 5, backgroundColor: Styles.theme.backgroundColor }}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.examTerm}
                                            onValueChange={(value) => { this.setState({ examTerm: value }) }}
                                        >
                                            <Picker.Item label="First Term" value={1} />
                                            <Picker.Item label="Mid Term" value={2} />
                                            <Picker.Item label="Final Term" value={3} />
                                        </Picker>
                                    </View>
                                    <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row" }}>
                                        <Item stackedLabel style={{ width: "45%", borderBottomWidth: 2.0, marginLeft: 0 }}>
                                            <Label style={{ fontFamily: Styles.fonts.BoldItalic }}>Percentage</Label>
                                            <Input onSubmitEditing={() => this._focusNextField('grade')} returnKeyType={"next"} style={{ paddingTop: 5 }} value={this.state.percentage} onChangeText={(value) => { this.setState({ percentage: value }) }} />
                                        </Item>
                                        <Item stackedLabel style={{ width: "45%", borderBottomWidth: 2.0, marginLeft: 0 }}>
                                            <Label style={{ fontFamily: Styles.fonts.BoldItalic }}>Grade</Label>
                                            <Input ref='grade' style={{ paddingTop: 5 }} value={this.state.grade} onChangeText={(value) => { this.setState({ grade: value }) }} />
                                        </Item>
                                    </View>
                                    <View style={{ justifyContent: "space-around", width: "50%", flexDirection: "row", alignSelf: "flex-start", alignItems: "center" }}>
                                        {this.state.checked === false ?
                                            <TouchableOpacity style={{ height: screenHeight / 10, width: "30%", justifyContent: "center", }} onPress={() => this.setState({ checked: true })}>
                                                <Image source={require("../../assets/icons/checkbox_uncheck.png")} style={{ height: "100%", width: "100%" }} resizeMode="contain" />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity style={{ height: screenHeight / 10, width: "30%", justifyContent: "center", }} onPress={() => this.setState({ checked: false })}>
                                                <Image source={require("../../assets/icons/checkbox_checked.png")} style={{ height: "100%", width: "100%" }} resizeMode="contain" />
                                            </TouchableOpacity>
                                        }
                                        <View style={{ width: "70%", alignItems: "flex-start" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Italic, fontSize: Styles.fonts.h2 }}>Passed</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={this.handleSubmit} style={{ width: "100%", height: screenHeight / 15, justifyContent: "center", alignItems: "center", borderRadius: 5, backgroundColor: Styles.theme.buttonBackgroundColor }}>
                                        <Text style={{ color: Styles.theme.buttonTextColor, fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h2 }}>Submit</Text>
                                    </TouchableOpacity>
                                    {this.props.submitLoader && <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Loader />
                                    </View>
                                    }
                                    {this.props.success && alert("success") || <View style={{ alignItems: "center" }}><Text style={{ color: "red" }}>{this.props.errorMessage}</Text></View>}
                                </View>
                            </Form>
                        </AutoScroll>
                        :
                        this.props.user.accountType === "student" ?
                            this.props.submitLoader && <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Loader /></View>
                            ||
                            <View style={{ height: screenHeight / 2, justifyContent: "space-around", alignItems: "center", marginTop: 10 }}>
                                <View style={{ height: screenHeight / 2, width: "90%", flexDirection: "row", borderRadius: 5, borderWidth: 0.5 }}>
                                    <View style={{ width: "33.3333%", height: "100%", }}>
                                        <View style={{ height: "10%", width: "100%", borderBottomWidth: 0.5, borderRightWidth: 0.5, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>Exam Type</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>First Term</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>Mid Term</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>Final Term</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "33.3333%", height: "100%", }}>
                                        <View style={{ height: "10%", width: "100%", borderBottomWidth: 0.5, borderRightWidth: 0.5, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>Percentage</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>{this.state.firstTerm && this.state.firstTerm.length && this.state.firstTerm[0].percentage || "Not Found"}</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>{this.state.midTerm && this.state.midTerm.length && this.state.midTerm[0].percentage || "Not Found"}</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>{this.state.finalTerm && this.state.finalTerm.length && this.state.finalTerm[0].percentage || "Not Found"}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "33.3333%", height: "100%", }}>
                                        <View style={{ height: "10%", width: "100%", borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>Grade</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>{this.state.firstTerm && this.state.firstTerm.length && this.state.firstTerm[0].grade || "Not Found"}</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>{this.state.midTerm && this.state.midTerm.length && this.state.midTerm[0].grade || "Not Found"}</Text>
                                        </View>
                                        <View style={{ height: "30%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Styles.fonts.Bold, fontSize: Styles.fonts.medium }}>{this.state.finalTerm && this.state.finalTerm.length && this.state.finalTerm[0].grade || "Not Found"}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            :
                            <View>
                                <Text>You are not a Student</Text>
                            </View>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Loader />
                    </View>

                }
            </Container>
        )
    }
}
function mapStateToProps(state) {
    return {
        users: state.DataReducer.users,
        loader: state.DataReducer.loader,
        user: state.AuthReducer.user,
        submitLoader: state.DataReducer.submitLoader,
        success: state.DataReducer.success && state.DataReducer.success,
        errorMessage: state.DataReducer.errorMessage,
        result: state.DataReducer.result,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        fetchUsers: () => { dispatch(DataAction.getUsers()) },
        submitMarks: (payload) => { dispatch(DataAction.submitMarks(payload)) },
        fetchResult: (payload) => { dispatch(DataAction.fetchResult(payload)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results);
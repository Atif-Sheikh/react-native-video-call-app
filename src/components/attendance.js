import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Actions } from "react-native-router-flux";
import { DataAction } from "../store/action";
import AutoScroll from "react-native-auto-scroll";
import Loader from "./loader";
import { connect } from "react-redux";
import { Calendar } from "react-native-calendars"
import { Header, Icon, Title, Picker, Item, Input, Label, Container, CheckBox, Form } from "native-base";
import { screenHeight, screenWidth, Styles } from "../config";

class Attendance extends React.Component {
    constructor() {
        super();
        this.state = {
            students: [],
            selectedClass: "",
            filteredStudents: [],
            teacherClass: [],
            selectedStudent: "",
            presents: {},
            currentStudent: "",
            month: ""
        }
    }
    static navigationOptions = {
        CustomHeader: null,
        header: null,
        Footer: null,
        FooterTab: null,
    };
    componentWillMount() {
        this.props.fetchUsers()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
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
                    const sorted=teacherClass.sort();
                    var filteredStudents = data.filter((student) => student.studentClass === sorted[0])
                    this.setState({ students: data, teacherClass:sorted, selectedClass: sorted[0], filteredStudents, currentStudent: filteredStudents[0] })
                }
            }
        }
    }
    filterStudents = (value) => {
        if (value) {
            var students = this.state.students;
            var filteredStudents = students.filter((student) => student.studentClass === value);
            this.setState({ selectedClass: value, filteredStudents })
        }
    }
    studentSelection = (value) => {
        var currentStudent = this.state.filteredStudents[value]
        this.setState({ currentStudent, selectedStudent: value })
    }
    daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    }
    getSundays = (year) => {
        var date = new Date(year, 0, 1);
        while (date.getDay() != 0) {
            date.setDate(date.getDate() + 1);
        }
        var days = [];
        while (date.getFullYear() == year) {
            var m = date.getMonth() + 1;
            var d = date.getDate();
            days.push(
                year + '-' +
                (m < 10 ? '0' + m : m) + '-' +
                (d < 10 ? '0' + d : d)
            );
            date.setDate(date.getDate() + 7);
        }
        return days;
    }
    getDateArray = (start, end) => {

        var
            arr = new Array(),
            dt = new Date(start);

        while (dt <= end) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }

    render() {
        var d = new Date();
        var marking = {};
        var currentYear = new Date().getFullYear();
        var sundays = this.getSundays(currentYear);
        var student = this.props.user.accountType==="student"?this.props.user:this.state.currentStudent;
        if (student && student.attendance) {
            for (var i = 0; i < student.attendance.length; i++) {
                marking[student.attendance[i]] = { selected: true, selectedColor: Styles.theme.backgroundColor }
            }
        }
        for (var i = 0; i < sundays.length; i++) {
            marking[sundays[i]] = { selected: true, selectedColor: "orange" }
        }
        return (
            <Container>
                <Header style={{ backgroundColor: Styles.theme.backgroundColor, height: screenHeight / 10, justifyContent: "space-between", width: screenWidth, flexDirection: "row" }}>
                    <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => Actions.pop()}>
                        <Icon name="arrow-back" style={{ color: Styles.theme.headerTextColor }} />
                    </TouchableOpacity>
                    <View style={{ width: "90%", justifyContent: "center", alignItems: "flex-start", paddingLeft: 20 }}>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>Attendance</Title>
                    </View>
                </Header>
                {this.props.loader === false ?
                this.props.user.accountType==="teacher" ?
                    <AutoScroll>
                        <Form>
                            <View style={{ justifyContent: "space-around", width: screenWidth / 1.1, alignSelf: "center", paddingTop: 20, height: screenHeight / 1.2 }}>
                                <View style={{ height: screenHeight / 12, borderWidth: 2.0, borderColor: Styles.theme.borderColor, borderRadius: 5, backgroundColor: Styles.theme.backgroundColor }}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={this.state.selectedClass}
                                        onValueChange={this.filterStudents}
                                    >
                                        {
                                            this.state.teacherClass && this.state.teacherClass.length > 0 ?
                                                this.state.teacherClass.map((cls, index) => {
                                                    return (
                                                        <Picker.Item label={"Class " + cls} value={cls} />
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
                                        onValueChange={this.studentSelection}
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
                                <View style={{ borderRadius: 5 }}>
                                    <Calendar
                                        markedDates={marking}
                                        onMonthChange={(month) => this.setState({ month })}
                                        theme={

                                            {
                                                "stylesheet.day.basic": {
                                                    base: {
                                                        width: 32,
                                                        height: 32,
                                                        alignItems: 'center',
                                                        backgroundColor: "red",
                                                        // backgroundColor:{},
                                                        borderRadius: 16

                                                    },

                                                }

                                            }}
                                    />
                                </View>
                            </View>
                        </Form>
                    </AutoScroll>
                    :
                    this.props.user.accountType==="student"?
                    <View style={{flex:1,marginTop:15}}>
                            <Calendar 
                                markedDates={marking}
                                theme={
                                    {
                                        "stylesheet.day.basic": {
                                            base: {
                                                width: 32,
                                                height: 32,
                                                alignItems: 'center',
                                                backgroundColor: "red",
                                                // backgroundColor:{},
                                                borderRadius: 16

                                            },

                                        }

                                    }
                                }
                            />
                    </View>
                    :
                    <View>
                        <Text>You are Not a Student or Teacher</Text>
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
const mapStateToProps = (state) => {
    return {
        users: state.DataReducer.users,
        user: state.AuthReducer.user,
        loader: state.DataReducer.loader
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsers: () => { dispatch(DataAction.getUsers()) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Attendance);
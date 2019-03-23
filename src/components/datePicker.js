import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Header,Icon,Title } from "native-base";
import {Calendar} from 'react-native-calendars';
import { Actions } from 'react-native-router-flux';
import { Styles, screenHeight, screenWidth } from "../config";
export class Calendarpicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
        };
    };
    static navigationOptions = {
        CustomHeader: null,
        header: null,
        Footer: null,
        FooterTab: null,
    };
    onDateChange = (date) => {
        this.setState({
            selectedStartDate: date,
        });
        Actions.dateScreen({ date });
    };
    render() {
        return (
            <View style={styles.container}>
                <Header style={{ backgroundColor: Styles.theme.backgroundColor, height: screenHeight / 10, justifyContent: "space-between", width: screenWidth, flexDirection: "row" }}>
                    <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => Actions.pop()}>
                        <Icon name="arrow-back" style={{ color: Styles.theme.headerTextColor }} />
                    </TouchableOpacity>
                    <View style={{ width: "90%", justifyContent: "center", alignItems: "flex-start", paddingLeft: 20 }}>
                        <Title style={{ fontFamily: Styles.fonts.BoldItalic }}>Pick Date of Post</Title>
                    </View>
                </Header>
                <View>
                    <Calendar
                        onDayPress={this.onDateChange}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height:screenHeight
    },
});
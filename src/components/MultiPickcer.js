import React from 'react';
import { StyleSheet, View, Text, Modal, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Item, Input, Label, Button, Picker, Icon, Spinner, List, ListItem, CheckBox, Body } from 'native-base';
import { screenHeight, Styles, screenWidth } from '../config';
import { user } from 'firebase-functions/lib/providers/auth';
// const window = Dimensions.get("window");
const size = Dimensions.get("window")
export default class Field extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: this.props.placeholder,
            dropDown: false,
            selection: "",
            item: [],
            selected: [],
            userItem: [],
            title: ""
        }
    }
    onValueChanged = (item, id) => {
        // console.log(item)
        this.props.onValue(id);
        let selected = this.state.selection;
        let text;
        // selected.indexOf(item)==-1&&alert("not");
        if (selected.indexOf(item) == -1) {
            text = item + "," + selected
        }
        else {
            // alert(selected)
            let replaced = selected.replace(item + ",", "")
            text = replaced
            //    alert(text)

        }
        // alert(text.length)
        // alert(text.length)
        //    let sliced = text.slice(0,text.length-1) 
        this.setState({
            selection: text.length > 2 ? text : this.props.placeholder,
            // dropDown: false
        })
    }
    componentDidMount() {
        this.mounted = true;
        // console.log(this.props.array)
    }

    componentWillUnmount() {
        this.mounted = false;

    }
    // componentWillReceiveProps(nextprops) {
    //     if (nextprops) {
    //         this.setState({
    //             item:nextprops.item,
    //             userItem:nextprops.userItem,
    //             title:nextprops.title
    //         })
    //     }
    //     if(nextprops.userItem && nextprops.item){
    //         var userItem=nextprops.userItem;
    //         var item=nextprops.item;
    //         for(var i=0;i<item.length;i++){
    //             for(var j=0;j<userItem.length;j++){
    //                 if(item[i]===userItem[j]){
    //                     this.state.selected.push(true)
    //                 }
    //                 else{
    //                     this.state.selected.push(false)
    //                 }
    //             }
    //         }
    //     }
    // }
    componentWillMount() {
        if (this.props.item) {
            this.setState({ item: this.props.item })
        }
        if (this.props.userItem) {
            this.setState({ userItem: this.props.userItem })
        }
        if (this.props.title) {
            this.setState({ title: this.props.title })
        }
        if (this.props.userItem && this.props.item) {
            var userItem = this.props.userItem;
            var item = this.props.item;
            const selected = [];
            for (var i = 0; i < item.length; i++) {
                for (var j = 0; j < userItem.length; j++) {
                    if (userItem[j] === item[i]) {
                        selected[i] = true || false
                    }
                }
            }
            this.setState({ selected })
        }
    }
    handleCheckbox(index) {
        const selected = this.state.selected;
        const item = this.state.item;
        if (!selected[index]) {
            selected[index] = true
            this.setState({ selected }, () => {
                this.state.userItem.push(item[index])
            })
        }
        else {
            selected[index] = false
            this.setState({ selected }, () => {
                var fitlered = this.state.userItem.filter((userItem) => userItem !== item[index])
                this.setState({ userItem: fitlered })
            })
        }
    }
    handlePress = () => {
        var that = this.props.that;
        var item = this.state.item;
        var newarray = [];
        var selected = this.state.selected;
        for (var i = 0; i < item.length; i++) {
            for (var j = 0; j < selected.length; j++) {
                if (selected[j] === true) {
                    newarray.push(item[i])
                }
            }
        }
        that.setState({ pickerModal: false })
        this.props.onValue(this.state.userItem)
    }
    // componentWillMount() {

    //     let a = window.onBodyPress
    //     window.onBodyPress = () => {
    //         this.mounted && this.setState({ dropDown: false });
    //         a && a()
    //     };
    //     this._panResponder = PanResponder.create({
    //         // Ask to be the responder:
    //         // onStartShouldSetPanResponder: (evt, gestureState) => true,
    //         onPanResponderTerminate: (evt, gestureState) => console.log(evt),
    //     });
    //     if (this.props.array.length) {
    //         let text = '';
    //         this.props.array.map((val) => {
    //             text += val + ",";
    //         })
    //         this.setState({ selection: text });
    //     }
    // }
    render() {
        const that = this.props.that;
        return (
            <Modal
                animationType="fade"
                onRequestClose={() => that.setState({ pickerModal: false })}
            >
                {this.props.title && <View style={{ height: screenHeight / 10, backgroundColor: Styles.theme.headerBackgroundColor, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: Styles.theme.headerTextColor, fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h1 }}>{this.state.title}</Text>
                </View>
                }
                <ScrollView style={{ width: "100%", backgroundColor: "#fff" }}>
                    <List>
                        {this.state.item && this.state.item.map((item, index) => {
                            return (
                                <ListItem key={index} onPress={this.handleCheckbox.bind(this, index)}>
                                    <CheckBox checked={this.state.selected[index]} color={Styles.theme.backgroundColor}  onPress={this.handleCheckbox.bind(this, index)}/>
                                    <Body>
                                        <Text style={{ fontFamily: Styles.fonts.Normal, fontSize: Styles.fonts.regular, color: Styles.theme.textColor, paddingLeft: 20 }}>{item}</Text>
                                    </Body>
                                </ListItem>
                            )
                        })}
                    </List>
                </ScrollView>
                <TouchableOpacity onPress={this.handlePress} style={{ height: screenHeight / 13, backgroundColor: Styles.theme.buttonBackgroundColor, width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: Styles.theme.buttonTextColor, fontFamily: Styles.fonts.BoldItalic, fontSize: Styles.fonts.h2 }}>Done</Text>
                </TouchableOpacity>
            </Modal>
        )
    }
}

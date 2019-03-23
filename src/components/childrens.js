import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { List, ListItem, Left, Body, Right, Thumbnail, Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import { DataAction } from '../store/action/index';
import ChildGraph from './childGraph';
import {screenHeight,screenWidth,Styles} from "../config"
let { fontScale, width } = Dimensions.get('window');

class Childrens extends Component {
    constructor(){
        super();
        this.state = {
            childs: [],
        };
    };
    componentDidMount(){
        let data = this.props.user;
        let childs = [];
        if(data.childs){
            let data1 = data.childs;
            for(let key in data1){
                childs.push(data1[key]);
            }
        }
        this.setState({childs});
    };

    render(){
        return(
            <ScrollView>
                <Text style={{ fontSize: Styles.fonts.h1, alignSelf: 'center', margin: 10,fontFamily:Styles.fonts.BoldItalic }}>Childs</Text>
                <List>
                {
                    this.state.childs.map((child, index) => {
                        return <ChildGraph child={child} />                            
                    })
                }
                </List>
            </ScrollView>
        );
    };
};
const style = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center'
    },
    title: {
      fontSize: 24,
      margin: 10
    }
});
const mapStateToProp = (state) => {
    return {
        user: state.AuthReducer.user,
        users: state.DataReducer.users,
    };
};
function mapDispatchToProp(dispatch) {
    return {
        removeChild: (obj) => {
            dispatch(DataAction.RemoveChild(obj))
        },
    };
};
export default connect(mapStateToProp, mapDispatchToProp)(Childrens);
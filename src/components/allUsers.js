import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Button, Keyboard, BackHandler } from 'react-native';
import { Content, Input, Item } from 'native-base';
import { Actions } from 'react-native-router-flux'; // New code
import { AuthAction } from '../store/action/index';
import { connect } from 'react-redux';


class AllUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <View>
            </View>
        )
    }
}
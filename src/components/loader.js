import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Bars, Bubbles } from "react-native-loader";
class Loader extends React.Component {
    render() {
        return (
            <ActivityIndicator size={this.props.size || "large"} color={this.props.color || "#07AFB8"} />
        )
    }
}
export default Loader;
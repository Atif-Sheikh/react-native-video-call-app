import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';
import Collapsible from 'react-native-collapsible';
import { List, ListItem, Left, Body, Right, Thumbnail, Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import { screenHeight, screenWidth, Styles } from "../config";
let { fontScale, width } = Dimensions.get('window');

class ChildGraph extends Component {
  constructor() {
    super();
    this.state = {
      show: true,
    };
  };
  //   _onPressCross = (child, index) => {
  //     let selectedStudents = this.state.childs;
  //     let obj = {
  //         parentUid: this.props.user.Uid,
  //         childUid: child.Uid,
  //     };
  //     selectedStudents.splice(index, 1);
  //     // students = selectedStudents;
  //     this.setState({ childs: selectedStudents });
  //     this.props.removeChild(obj);
  // };
  render() {
    const chart_wh = 50;
    const series = [123, 321];
    const sliceColor = ['red', 'green'];
    let { child } = this.props;
    return (
      <View style={{backgroundColor:Styles.theme.backgroundColor,width:"95%",alignSelf:"center",borderRadius:5,marginBottom:10 }}>
        <ListItem avatar>
          <Left style={{width:"10%"}}>
            <Thumbnail small source={child.photo ? { uri: child.photo } : require('../images/face.jpg')} />
          </Left>
          <Body style={{width:"70%"}}>
            <Text style={{color:Styles.theme.normalColor,fontFamily:Styles.fonts.BoldItalic,fontSize:Styles.fonts.h3}}>{child.userName}</Text>
            <Text note style={{color:Styles.theme.textColor,fontFamily:Styles.fonts.Normal}}>{child.email}</Text>
          </Body>
          <Right style={{justifyContent: 'center',width:"20%",alignItems:"center",alignItems:"center" }}>
            <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}>
              <Text style={{ fontFamily:Styles.fonts.Bold,fontSize:Styles.fonts.regular }}>Status</Text>
            </TouchableOpacity>
          </Right>
        </ListItem>
        <Collapsible collapsed={this.state.show}>
          <View style={styles.container}>
            <View>
              <Text style={{ fontSize: Styles.fonts.regular,fontFamily:Styles.fonts.Normal}}>Class: {child.studentClass}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{fontSize: Styles.fonts.regular,fontFamily:Styles.fonts.Normal, alignSelf: 'center',marginRight:10 }}>Status:</Text>
              <PieChart
                chart_wh={chart_wh}
                series={series}
                sliceColor={sliceColor}
              />
            </View>
          </View>
        </Collapsible>
      </View>
    );
  };
};
const mapStateToProp = (state) => {
  return {
    user: state.AuthReducer.user,
    users: state.DataReducer.users,
  };
};
function mapDispatchToProp(dispatch) {
  return {
    // removeChild: (obj) => {
    //     dispatch(DataAction.RemoveChild(obj))
    // },
  };
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    padding:10
  },
});

export default connect(mapStateToProp, mapDispatchToProp)(ChildGraph);
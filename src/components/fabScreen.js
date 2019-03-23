import React, { Component } from 'react';
import { Container, TabHeading, Content, Tab, Tabs } from 'native-base';
import { Text, ScrollView, Dimensions } from 'react-native';
import Post from './post';
import AddParent from './addParent';
import AddChild from './addChild';
import { connect } from 'react-redux';
import {Styles} from "../config";

class FabTabs extends Component {
    static navigationOptions = {
        header: null
    };
    componentWillReceiveProps(props) {
        if (props.user) {
            console.warn(props.user);
        }
    };
    render() {
        return (
            <Container>
                <Tabs initialPage={0}>
                    <Tab heading={<TabHeading style={{ flexDirection: 'column',backgroundColor:Styles.theme.backgroundColor }}>
                            <Text style={{ fontSize:Styles.fonts.h2,color:Styles.theme.normalColor,fontFamily:Styles.fonts.Bold }}>Status</Text>
                        </TabHeading>}>
                        <ScrollView>
                            <Post />
                        </ScrollView>
                    </Tab>
                    <Tab heading={<TabHeading style={{ flexDirection: 'column',backgroundColor:Styles.theme.backgroundColor}}>
                            <Text style={{ fontSize:Styles.fonts.h2,color:Styles.theme.normalColor,fontFamily:Styles.fonts.Bold }}>Add Parent</Text>
                        </TabHeading>}>
                        <ScrollView>
                            <AddParent />
                        </ScrollView>
                    </Tab>
                    <Tab heading={<TabHeading style={{ flexDirection: 'column',backgroundColor:Styles.theme.backgroundColor  }}>
                            <Text style={{ fontSize:Styles.fonts.h2,color:Styles.theme.normalColor,fontFamily:Styles.fonts.Bold }}>Add Child</Text>
                        </TabHeading>}>
                        <AddChild />
                    </Tab>
                </Tabs>
            </Container>
        );
    };
};
function mapStateToProp(state) {
    return {
        user: state.AuthReducer.user,
    }
};
function mapDispatchToProp(dispatch) {
    return {

    };
};

export default connect(mapStateToProp, mapDispatchToProp)(FabTabs);
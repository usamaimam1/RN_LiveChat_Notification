import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Input, Form, Picker, Item,
    Body, Left, Right, Badge, Icon, Title, Button, Toast, Root
} from 'native-base'
import { Text, Dimensions, Platform, StyleSheet, ImageBackground, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as SvgIcons from '../../assets/SVGIcons/index'
import UUIDGenerator from 'react-native-uuid-generator';
import firebase from 'react-native-firebase'
export default class AddIssue extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            issueTitle: null,
            issuePriority: 'Critical',
            issueStatus: 'Opened',
            projectId: this.props.navigation.state.params.projectId,
            addedBy: firebase.auth().currentUser.uid,
            issueId: null
        }
        this.handleIssueSubmit = this.handleIssueSubmit.bind(this)
    }
    handleIssueSubmit() {
        const uuid = UUIDGenerator.getRandomUUID()
        uuid.then(val => {
            this.setState({ issueId: val })
            const IssueRef = firebase.database().ref('Issues')
            if (this.state.issueTitle) {
                IssueRef.child(val).set(this.state, x => {
                    if (!x) {
                        firebase.database().ref('Projects').child(this.state.projectId).child('issues').child(val).set('Added')
                        Toast.show({ text: 'Issue Added Successfully', buttonText: 'Ok' })
                        this.props.navigation.goBack()
                    } else {
                        Toast.show({ text: JSON.stringify(x), buttonText: 'Ok' })
                    }
                })
                this.setState({ issueTitle: null })
            } else {
                Toast.show({ text: 'Please fill in the Issue Field', buttonText: 'Ok' })
            }
        })
    }
    componentDidMount() {

    }
    render() {
        // console.log(this.props.navigation.state.params.projectId)
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Root>
                <KeyboardAwareScrollView>
                    <SafeAreaView style={styles.Container}>
                        <View style={styles.Header}>
                            <View style={styles.HeaderInnerView} >
                                <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                                <Text style={styles.HeaderTitle}>Add Issue</Text>
                            </View>
                        </View>
                        <View style={styles.SubContainer}>
                            <View style={{ height: hp(22.2), flex: 1, borderColor: 'red' }}>
                                <Image
                                    source={require('../../assets/SVGIcons/logo.png')}
                                    resizeMode="contain"
                                    style={styles.Logo}>
                                </Image>
                            </View>
                            <View style={styles.Form}>
                                <Item rounded style={styles.Field}>
                                    <Input placeholder='Issue Title' style={{ fontFamily: "Montserrat", }} value={this.state.issueTitle} onChangeText={text => { this.setState({ issueTitle: text }) }} textContentType="name" />
                                </Item>
                                <Item picker style={[styles.Field, { marginTop: hp(1.84) }]}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        style={[styles.Field, { marginTop: hp(1.84) }]}
                                        placeholder="Issue Priority"
                                        placeholderStyle={{ color: "#bfc6ea",fontFamily: "Montserrat", }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.issuePriority}
                                        onValueChange={val => { this.setState({ issuePriority: val }) }}
                                    >
                                        <Picker.Item style={{ fontFamily: "Montserrat", }} label="Critical" value="Critical" />
                                        <Picker.Item style={{ fontFamily: "Montserrat", }} label="Normal" value="Normal" />
                                    </Picker>
                                </Item>
                                <TouchableOpacity style={styles.SignInButton} onPress={() => { this.handleIssueSubmit() }}>
                                    <Text style={{ color: 'white',fontFamily: "Montserrat", }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </KeyboardAwareScrollView>
            </Root>
        )
    }
}
const styles = StyleSheet.create({
    Container: {
        shadowColor: "#000", shadowOpacity: 0.16
    },
    Header: {
        height: hp(8.3), borderBottomColor: 'grey', borderBottomWidth: 1
    },
    HeaderInnerView: {
        height: hp(2.9), marginVertical: hp(3.2), marginHorizontal: wp(3.0), flexDirection: 'row'
    },
    HeaderTitle: {
        marginLeft: wp(4.533), fontSize: RFValue(14), color: '#34304C', fontWeight: "500",fontFamily: "Montserrat",
    },
    SubContainer: {
        flex: 1,
        marginLeft: wp(15.466),
        marginRight: wp(15.466),
        marginTop: hp(20.86),
        marginBottom: hp(20.86),
    },
    Logo: {
        // flex: 1,
        width: wp(28.8),
        height: hp(15.27),
        alignSelf: 'center',
        borderColor: 'green'
    },
    SignInButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#F48A20',
        height: hp(5.5),
        marginTop: hp(3.5),
        color: 'white'
    }
})
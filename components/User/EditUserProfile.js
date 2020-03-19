import React from 'react'
import {
    StyleSheet, Platform,
    Image, Text, View, ScrollView, ImageBackground,
    Dimensions, TextInput, ToastAndroid, KeyboardAvoidingView,
    SafeAreaView, TouchableOpacity
} from 'react-native';
import { handleUpdate } from './EditUserProfile.functions'
import { Header, Left, Right, Button, Body, Title, Item, Label, Input, Footer, FooterTab, Badge, } from 'native-base'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import { Toast, Root, Container, Spinner } from 'native-base'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'react-native-firebase'
import * as SvgIcons from '../../assets/SVGIcons/index'
import { connect } from 'react-redux'
const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

class EditUserProfile extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor() {
        super();
        this.activeColor = "#34304C"
        this.inActiveColor = "#77869E"
        this.state = {
            fullName: null,
            imgSource: { uri: null },
            userEmail: null,
            userPassword: null,
            userPasswordConfirm: null,
            showActivity: false
        };
        this.handlePickImage = this.handlePickImage.bind(this)
        this.handleUpdate = handleUpdate.bind(this)
        this.handlefullnamechange = this.handlefullnamechange.bind(this)
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this)
        this.handleUserPasswordChange = this.handleUserPasswordChange.bind(this)
        this.handleUserPasswordChangeConfirm = this.handleUserPasswordChangeConfirm.bind(this)
    }
    handlefullnamechange(fullName) {
        this.setState({ fullName: fullName })
    }
    handleUserEmailChange(userEmail) {
        this.setState({ userEmail: userEmail })
    }
    handleUserPasswordChange(userPassword) {
        this.setState({ userPassword: userPassword })
    }
    handleUserPasswordChangeConfirm(userPasswordConfirm) {
        this.setState({ userPasswordConfirm: userPasswordConfirm })
    }
    handlePickImage() {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                // alert('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                const source = { uri: response.uri };
                ImageResizer.createResizedImage(source.uri, 200, 200, 'PNG', 99).then((output) => {
                    console.log(output.uri)
                    this.setState({ imgSource: { uri: output.uri } })
                }).catch((err) => {
                    console.log(err.message)
                });
            }
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.user) {
            if (prevState.fullName === null || prevState.imgSource === null || prevState.userEmail === null) {
                return {
                    fullName: nextProps.user.fullName,
                    imgSource: { uri: nextProps.user.profilepic },
                    userEmail: nextProps.user.email
                }
            }
        }
        return null
    }
    render() {
        console.log(this.state.imgSource)
        return (
            <Root>{
                this.state.showActivity ? (
                    <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Spinner color="red" />
                    </Container>) :
                    <KeyboardAwareScrollView>
                        <SafeAreaView style={styles.Container}>
                            <View style={styles.Header}>
                                <View style={styles.HeaderInnerView} >
                                    <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                                    <Text style={styles.HeaderTitle}>Edit User Profile</Text>
                                </View>
                            </View>
                            <View style={styles.SignUpView}>
                                <View style={styles.ProfilePictureView}>
                                    {this.state.imgSource ?
                                        <Image style={styles.Avatar} source={this.state.imgSource} resizeMode="cover" onPress={this.handlePickImage}></Image> :
                                        <SvgIcons.Upload onPress={this.handlePickImage} ></SvgIcons.Upload>
                                    }
                                </View>
                                <View style={styles.UploadButton}>
                                    {this.state.imgSource ?
                                        <Text style={styles.UploadText} onPress={this.handlePickImage}>Change</Text>
                                        : <Text style={styles.UploadText} onPress={this.handlePickImage}>Upload</Text>
                                    }
                                </View>
                                <View style={styles.SignUpForm}>
                                    <Item style={styles.SignUpField}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11), fontFamily: "Montserrat", }} placeholder="Full Name" textContentType="name"
                                            value={this.state.fullName} onChangeText={this.handlefullnamechange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11), fontFamily: "Montserrat", }} placeholder="Email" textContentType="emailAddress"
                                            value={this.state.userEmail} onChangeText={this.handleUserEmailChange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11), fontFamily: "Montserrat", }} placeholder="Password" textContentType="password" secureTextEntry
                                            value={this.state.userPassword} onChangeText={this.handleUserPasswordChange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11), fontFamily: "Montserrat", }} placeholder="Confirm Password" textContentType="password" secureTextEntry
                                            value={this.state.userPasswordConfirm} onChangeText={this.handleUserPasswordChangeConfirm} />
                                    </Item>
                                    <TouchableOpacity style={styles.SignUpButton} onPress={() => { this.handleUpdate() }}>
                                        <Text style={{ color: 'white', fontFamily: "Montserrat", }}>Update Changes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {this.props.user ? this.props.user.adminaccess ?
                                <View style={styles.Footer}>
                                    <View style={styles.ProjectsIcon} onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                        <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                            <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsLength}</Text>
                                        </View>
                                        <SvgIcons.Projects style={{ alignSelf: 'center', borderWidth: 0 }} width={wv(30)} height={hv(30)} color={this.inActiveColor} onPress={() => { this.props.navigation.navigate('Dashboard') }}></SvgIcons.Projects>
                                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Projects</Text>
                                    </View>
                                    <View style={{ width: wv(38), height: hv(42), marginTop: hv(25) + RFValue(16), marginLeft: wv(33), borderWidth: 0 }}>
                                        <SvgIcons.UsersActive width={wv(19.5)} height={hv(22)} color={this.activeColor} style={{ alignSelf: 'center' }} onPress={() => { }} ></SvgIcons.UsersActive>
                                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.activeColor }}>Profile</Text>
                                    </View>
                                    <View style={{ width: wv(52), height: wv(52), borderWidth: 0, marginLeft: wv(13.5) }}>
                                        <SvgIcons.AddProject width={wv(52)} height={wv(52)} color="white" style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddProject') }}></SvgIcons.AddProject>
                                    </View>
                                    <View style={{ width: wv(52), height: hv(44), marginLeft: wv(13.5), marginTop: hv(23) + RFValue(16), borderWidth: 0 }}>
                                        <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }}></SvgIcons.AddUserFooter>
                                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Add User</Text>
                                    </View>
                                    <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                                        <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                            <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issueCount}</Text>
                                        </View>
                                        <SvgIcons.IssueFooter width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('IssuesIndex') }}></SvgIcons.IssueFooter>
                                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Issues</Text>
                                    </View>
                                </View> :
                                <Footer style={{ backgroundColor: 'white', marginTop: hv(140.5) }}>
                                    <FooterTab>
                                        <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                            <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsLength}</Text>
                                            </Badge>
                                            <SvgIcons.Projects width={RFValue(26)} height={RFValue(26)} color="#34304C"></SvgIcons.Projects>
                                            <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', color: this.inActiveColor }}>Projects</Text>
                                        </Button>
                                        <Button vertical badge onPress={() => { }}>
                                            <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}><Text style={{ color: 'rgba(255, 255, 255, 0.1)' }}>{this.props.projectsLength}</Text></Badge>
                                            <SvgIcons.UsersActive width={RFValue(26)} height={RFValue(26)} ></SvgIcons.UsersActive>
                                            <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.activeColor }}>Profile</Text>
                                        </Button>
                                        <Button badge vertical title="" onPress={() => { this.props.navigation.navigate('IssuesIndex') }} >
                                            <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issueCount}</Text></Badge>
                                            <SvgIcons.IssueFooter width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooter>
                                            <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Issues</Text>
                                        </Button>
                                    </FooterTab>
                                </Footer> : null
                            }
                        </SafeAreaView>
                    </KeyboardAwareScrollView>
            }
            </Root>)
    }
}
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        projectsLength: state.projectReducer.projectDetails.length,
        issueCount: state.issuesReducer.issuesCount
    }
}
const mapDispatchToProps = null
export default connect(mapStateToProps, mapDispatchToProps)(EditUserProfile)

const styles = StyleSheet.create({
    Container: {
        shadowColor: "#000", shadowOpacity: 0.16
    },
    Header: {
        height: hp(8.3), borderBottomColor: 'grey', borderBottomWidth: 0
    },
    HeaderInnerView: {
        height: hp(2.9), marginVertical: hp(3.2), marginHorizontal: wp(3.0), flexDirection: 'row'
    },
    HeaderTitle: {
        marginLeft: wp(4.533), fontSize: RFValue(12), color: '#34304C', fontFamily: "Montserrat",
    },
    SignUpView: {
        height: hv(478), width: wv(342), marginTop: hv(20.5), marginHorizontal: wv(17), borderWidth: 0,
    },
    ProfilePictureView: {
        alignSelf: 'center', marginTop: hv(29.5),
    },
    Avatar: {
        width: hv(100), height: hv(100), borderRadius: hv(100) / 2
    },
    UploadButton: {
        alignSelf: 'center',
        height: hv(25), width: wv(64), marginTop: hv(27),
        borderWidth: 1, borderColor: '#34304C'
    },
    UploadText: {
        fontSize: 9, marginHorizontal: wv(10), marginVertical: hv(5), textAlign: 'center', fontFamily: "Montserrat",
    },
    SignUpForm: {
        height: hv(164), width: wv(300.5), marginHorizontal: wv(21), marginTop: hv(30.5)
    },
    SignUpField: {
        height: hv(29)
    },
    SignUpButton: {
        marginTop: hv(30.5), alignSelf: 'center', height: hv(32), width: wv(140), backgroundColor: '#F48A20', borderRadius: 20,
        justifyContent: 'center', alignItems: 'center'
    },
    Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row', marginTop: hv(113.5) },
    ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },

});

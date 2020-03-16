import React from 'react'
import {
    StyleSheet, Platform,
    Image, Text, View, ScrollView, ImageBackground,
    Dimensions, TextInput, Button, ToastAndroid, KeyboardAvoidingView,
    SafeAreaView, TouchableOpacity
} from 'react-native';
import { handleUpdate } from './EditUserProfile.functions'
import { Header, Left, Right, Body, Title, Item, Label, Input } from 'native-base'
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
                                    <Text style={styles.HeaderTitle}>SignUp</Text>
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
                                        <Input style={{ fontSize: 10, marginBottom: hv(11) }} placeholder="Full Name" textContentType="name"
                                            value={this.state.fullName} onChangeText={this.handlefullnamechange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11) }} placeholder="Email" textContentType="emailAddress"
                                            value={this.state.userEmail} onChangeText={this.handleUserEmailChange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11) }} placeholder="Password" textContentType="password" secureTextEntry
                                            value={this.state.userPassword} onChangeText={this.handleUserPasswordChange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11) }} placeholder="Confirm Password" textContentType="password" secureTextEntry
                                            value={this.state.userPasswordConfirm} onChangeText={this.handleUserPasswordChangeConfirm} />
                                    </Item>
                                    <TouchableOpacity style={styles.SignUpButton} onPress={() => { this.handleUpdate() }}>
                                        <Text style={{ color: 'white' }}>Update Changes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </KeyboardAwareScrollView>
            }
            </Root>)
    }
}
const mapStateToProps = state => {
    return {
        user: state.userReducer.user
    }
}
const mapDispatchToProps = null
export default connect(mapStateToProps, mapDispatchToProps)(EditUserProfile)

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
        marginLeft: wp(4.533), fontSize: RFValue(12), color: '#34304C'
    },
    SignUpView: {
        height: hv(478), width: wv(342), marginTop: hv(20.5), marginHorizontal: wv(17), marginBottom: hv(213.5),
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
        fontSize: 9, marginHorizontal: wv(10), marginVertical: hv(5), textAlign: 'center'
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
    }

});

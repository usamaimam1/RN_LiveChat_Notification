import React from 'react'
import {
    StyleSheet, Platform,
    Image, Text, View, ScrollView, ImageBackground,
    Dimensions, TextInput, Button, ToastAndroid, KeyboardAvoidingView,
    SafeAreaView, TouchableOpacity
} from 'react-native';
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
const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class SignUp extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor() {
        super();
        this.state = {
            fullName: null,
            imgSource: null,
            userEmail: null,
            userPassword: null,
            userPasswordConfirm: null,
            showActivity: false
        };
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this)
        this.handleUserPasswordChange = this.handleUserPasswordChange.bind(this)
        this.handleUserPasswordChangeConfirm = this.handleUserPasswordChangeConfirm.bind(this)
        this.handlefullnamechange = this.handlefullnamechange.bind(this)
        this.handlePickImage = this.handlePickImage.bind(this)
        this.handleSignUp = this.handleSignUp.bind(this)
        this.uploadImage = this.uploadImage.bind(this)
    }

    handleUserEmailChange(changedEmail) {
        this.setState({ userEmail: changedEmail })
    }
    handleUserPasswordChange(changedPassword) {
        this.setState({ userPassword: changedPassword })
    }
    handleUserPasswordChangeConfirm(changedPassword) {
        this.setState({ userPasswordConfirm: changedPassword })
    }
    handlefullnamechange(fullName) {
        this.setState({ fullName: fullName })
    }
    uploadImage = () => {

    };
    handleSignUp() {
        this.setState({ showActivity: true })
        if (this.state.userEmail && this.state.userPassword && this.state.userPasswordConfirm && this.state.fullName && this.state.imgSource) {
            if (this.state.userPassword === this.state.userPasswordConfirm) {
                firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
                    .then(() => {
                        const ref = firebase.database().ref("users")
                        const User = firebase.auth().currentUser._user
                        ref.child(User.uid).set({
                            email: User.email,
                            uid: User.uid,
                            adminaccess: false,
                            fullName: this.state.fullName,
                        }, (err) => {
                            console.log(err)
                        })
                        firebase
                            .storage()
                            .ref(`profilepics/${User.uid}`)
                            .putFile(this.state.imgSource.uri)
                            .then(storageTask => {
                                console.log(storageTask)
                                const imageRef = firebase.database().ref('users').child(User.uid).child('profilepic')
                                imageRef.set(storageTask.downloadURL, () => {
                                    console.log("Image Uploaded successfully!")
                                })
                                this.setState({ userEmail: null, userPassword: null, userPasswordConfirm: null, fullName: null, imgSource: null, showActivity: false })
                                this.props.navigation.navigate('Dashboard')
                            }).catch(error => {
                                Toast.show({
                                    text: 'User Added! Error Uploading Image',
                                    buttonText: 'OK',
                                    duration: 2000
                                })
                                this.setState({ showActivity: false })
                            });
                    })
                    .catch(error => {
                        this.setState({ userEmail: null, userPassword: null, userPasswordConfirm: null, showActivity: false })
                        Toast.show({
                            text: error.message,
                            buttonText: 'OK',
                            duration: 2000
                        })
                    })

            } else {
                // ToastAndroid.show("Passwords do not match!", ToastAndroid.LONG)
                this.setState({ userEmail: null, userPassword: null, userPasswordConfirm: null, showActivity: false })
                Toast.show({
                    text: 'Passwords Do not Match',
                    buttonText: 'OK',
                    duration: 2000
                })
            }
        } else {
            // ToastAndroid.show("Please do not leave the fields Empty!", ToastAndroid.SHORT)
            this.setState({ showActivity: false })
            Toast.show({
                text: 'Please do not leave the fields empty',
                buttonText: 'OK',
                duration: 2000
            })
        }
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
                    this.setState({ imgSource: { uri: output.uri } })
                    console.log(output.size)

                }).catch((err) => {
                    console.log(err.message)
                });
            }
        });
    }
    render() {
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
                                        <SvgIcons.Upload width={wv(120)} height={hv(120)} style={{ alignSelf: 'center' }} onPress={this.handlePickImage} ></SvgIcons.Upload>
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
                                        <Input style={{ fontSize: 10, marginBottom: hv(11),fontFamily: "Montserrat", }} placeholder="Full Name" textContentType="name"
                                            value={this.state.fullName} onChangeText={this.handlefullnamechange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11),fontFamily: "Montserrat", }} placeholder="Email" textContentType="emailAddress"
                                            value={this.state.userEmail} onChangeText={this.handleUserEmailChange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11),fontFamily: "Montserrat", }} placeholder="Password" textContentType="password" secureTextEntry
                                            value={this.state.userPassword} onChangeText={this.handleUserPasswordChange} />
                                    </Item>
                                    <Item style={[styles.SignUpField, { marginTop: hv(16) }]}>
                                        <Input style={{ fontSize: 10, marginBottom: hv(11),fontFamily: "Montserrat", }} placeholder="Confirm Password" textContentType="password" secureTextEntry
                                            value={this.state.userPasswordConfirm} onChangeText={this.handleUserPasswordChangeConfirm} />
                                    </Item>
                                    <TouchableOpacity style={styles.SignUpButton} onPress={() => { this.handleSignUp() }}>
                                        <Text style={{ color: 'white',fontFamily: "Montserrat", }}>SIGN UP</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </KeyboardAwareScrollView>
            }
            </Root>)
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
        marginLeft: wp(4.533), fontSize: RFValue(12), color: '#34304C',fontFamily: "Montserrat",
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
        fontSize: 9, marginHorizontal: wv(10), marginVertical: hv(5), textAlign: 'center',fontFamily: "Montserrat",
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

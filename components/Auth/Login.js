import React from 'react'
import {
    Text, View, Dimensions, Platform, Image, StyleSheet, ScrollView, TouchableOpacity,
    ImageBackground, TextInput, Button, ActivityIndicator, KeyboardAvoidingView, SafeAreaView
} from 'react-native'
import { Toast, Root, Container, Spinner, Item, Content, Input } from 'native-base'
import firebase from 'react-native-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default class Login extends React.Component {
    static navigationOptions = {
        header: null
    };
    constructor() {
        super();
        this.state = {
            userEmail: null,
            userPassword: null,
            isLoading: false,
            foundUser: false,
            showActivity: false
        };
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this)
        this.handleUserPasswordChange = this.handleUserPasswordChange.bind(this)
        this.handleURL = this.handleURL.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        // this.handleSignIn = this.handleSignIn(this)
    }
    handleUserEmailChange(changedEmail) {
        this.setState({ userEmail: changedEmail })
        console.log(changedEmail)
    }
    handleUserPasswordChange(changedPassword) {
        this.setState({ userPassword: changedPassword })
        console.log(changedPassword)
    }
    handleURL(url) {
        console.log(url)
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match
        while ((match = regex.exec(url))) {
            params[match[1]] = match[2]
        }
        console.log(params)
        if (params.mode == "resetPassword") {
            this.props.navigation.navigate('ForgotPassword', { code: params.oobCode })
        }
    }
    handleSubmit() {
        if (this.state.userEmail && this.state.userPassword) {
            this.setState({ showActivity: true })
            firebase.auth().signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
                .then(() => {
                    this.setState({ userEmail: null, userPassword: null, showActivity: false })
                    this.props.navigation.navigate('App')
                })
                .catch((error) => {
                    this.setState({ userEmail: null, userPassword: null, showActivity: false })
                    // ToastAndroid.show(error.message, ToastAndroid.SHORT)
                    Toast.show({
                        text: error.message,
                        buttonText: 'Ok'
                    })
                })

        } else {
            // ToastAndroid.show("Please do not leave the fields empty", ToastAndroid.SHORT)
            Toast.show({
                text: 'Please do not leave the fields empty',
                buttonText: 'Ok'
            })
        }
    }
    componentDidMount() {
        firebase.links().getInitialLink().then((url) => {
            this.handleURL(url)
        }).catch(err => {
            console.log(err.message)
        })
        firebase.links().onLink((url) => {
            this.handleURL(url)
        })

        // firebase.auth().onAuthStateChanged(user => {
        //     this.setState({ isLoading: false })
        //     this.setState({ foundUser: user ? true : false })
        //     this.props.navigation.navigate(user ? 'Dashboard' : 'Home')
        // })
    }

    render() {
        const { navigate } = this.props.navigation
        return (
            <Root>{
                this.state.showActivity ? (
                    <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Spinner color="red" />
                    </Container>) :
                    <SafeAreaView style={{ flex: 1 }}>
                        <KeyboardAwareScrollView>
                            <View style={styles.Container}>
                                <View style={{ height: hp(22.2), flex: 1, borderColor: 'red' }}>
                                    <Image
                                        source={require('../../assets/SVGIcons/logo.png')}
                                        resizeMode="contain"
                                        style={styles.Logo}>
                                    </Image>
                                </View>
                                <View style={styles.Form}>
                                    <Item rounded style={styles.Field}>
                                        <Input placeholder='Email' style={{ fontFamily: "Montserrat", }} value={this.state.userEmail} onChangeText={this.handleUserEmailChange} />
                                    </Item>
                                    <Item rounded style={[styles.Field, { marginTop: hp(1.84) }]}>
                                        <Input placeholder='Password' style={{ fontFamily: "Montserrat", }} value={this.state.userPassword} onChangeText={this.handleUserPasswordChange} textContentType="password" secureTextEntry />
                                    </Item>
                                    <Text style={styles.ForgotPassword} onPress={() => { navigate('ForgotPassword') }}>
                                        Forgot Password ?
                                        </Text>
                                    <TouchableOpacity style={styles.SignInButton} onPress={() => { this.handleSubmit() }}>
                                        <Text style={{ color: 'white', fontFamily: "Montserrat", }}>LOGIN</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={[styles.BottomText, { textAlign: 'right', fontFamily: "Montserrat", }]}>Not A User? </Text>
                                    <Text style={[styles.BottomText, { textAlign: 'left', marginLeft: 5, color: '#F48A20', fontWeight: '400', fontFamily: "Montserrat", }]}
                                        onPress={() => { navigate('SignUp') }}>
                                        Sign Up!
                                        </Text>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                //     Platform.OS === "ios" ?
                //         <SafeAreaView keyboardShouldPersistTaps="always">
                //             <KeyboardAwareScrollView>
                //                 {this.state.isLoading ?
                //                     (<Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                //                         <Spinner color="red" />
                //                     </Container>) :
                //                     contentToRender
                //                 }
                //             </KeyboardAwareScrollView>
                //         </SafeAreaView> :
                //         <KeyboardAwareScrollView keyboardShouldPersistTaps="always" >
                //             {this.state.isLoading ?
                //                 (<Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                //                     <Spinner color="red" />
                //                 </Container>) :
                //                 contentToRender
                //             }
                //         </KeyboardAwareScrollView>
            }
            </Root>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
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
    Form: {
        flex: 1,
        height: hp(25.98),
        borderColor: 'blue',
        // borderWidth: 1,
    },
    Field: {
        height: hp(5.5)
    },
    ForgotPassword: {
        alignSelf: 'flex-end',
        fontSize: RFValue(11),
        fontFamily: "Montserrat",
        marginTop: hp(1.72),
        color: '#758692'
    },
    SignInButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#F48A20',
        height: hp(5.5),
        marginTop: hp(3.5),
        color: 'white'
    },
    BottomText: {
        flex: 1,
        color: '#758692',
        marginTop: hp(1.72),
        fontFamily: "Montserrat",
        // color: '#F48A20'
    }
});
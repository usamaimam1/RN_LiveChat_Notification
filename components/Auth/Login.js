import React from 'react'
import {
    Text, View, Dimensions, Platform, Image, StyleSheet, ScrollView,
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
        const contentToRender = (<ImageBackground
            style={styles.background}
            source={require('../../assets/splash-bg.jpg')}>
            <View style={{ flex: 1 }}>
                <View style={styles.logo} >
                    <Image source={require('../../assets/ReactNativeFirebase.png')} style={{ width: 150, height: 150, margin: 10, flex: 1 }} resizeMode="contain" >

                    </Image>
                </View>
                <View style={styles.form} >
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Enter Email : " textContentType="emailAddress" style={styles.Text} onChangeText={this.handleUserEmailChange} value={this.state.userEmail}>

                        </TextInput>
                        <TextInput placeholder="Enter Password : " textContentType="password" style={styles.Text} onChangeText={this.handleUserPasswordChange} secureTextEntry={true} value={this.state.userPassword}>

                        </TextInput>
                    </View>
                    <View style={styles.signinButton}>
                        <Button title={"Sign In"} style={{ color: 'black' }} onPress={() => {
                            this.handleSubmit()
                        }}></Button>
                    </View>
                    <View style={styles.SignupText}>
                        <Text style={{ flex: 1, textAlign: 'right' }}> Not have an ID? </Text>
                        <Text style={{ flex: 1, textAlign: 'left', color: 'red' }} onPress={() => { navigate('SignUp') }}> Sign Up? </Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginBottom: 10 }}>
                        <Text style={{ flex: 1, textAlign: 'center', color: 'red', marginTop: 15 }} onPress={() => {
                            navigate('ForgotPassword')
                        }}> Forgot Password? </Text>

                    </View>
                </View>
            </View>
        </ImageBackground>)
        return (
            <Root>{
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
                                    <Input placeholder='Email' />
                                </Item>
                                <Item rounded style={[styles.Field, { marginTop: hp(1.84) }]}>
                                    <Input placeholder='Password' />
                                </Item>
                                <Text style={styles.ForgotPassword}>Forgot Password?</Text>
                                <View style={styles.SignInButton}>
                                    <Text style={{ color: 'white' }}>LOGIN</Text>
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                // this.state.showActivity ? (
                //     <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                //         <Spinner color="red" />
                //     </Container>) :
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
        borderColor: 'red',
        // borderWidth: 1
    },
    Logo: {
        // flex: 1,
        width: wp(28.8),
        height: hp(15.27),
        alignSelf: 'center',
        // borderWidth: 1,
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
        // fontFamily:,''
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
    }
});
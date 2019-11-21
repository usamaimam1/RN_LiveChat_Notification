import React from 'react'
import {
    Text,
    View,
    Dimensions,
    Platform,
    Image,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TextInput,
    Button,
    ActivityIndicator,
    KeyboardAvoidingView,
    SafeAreaView
} from 'react-native'
import { Toast, Root, Container, Spinner } from 'native-base'
import firebase from 'react-native-firebase';
import * as Progress from 'react-native-progress'
import { cloneNode } from '@babel/types';

export default class Login extends React.Component {
    static navigationOptions = {
        // header: null
    };
    constructor() {
        super();
        this.state = {
            userEmail: null,
            userPassword: null,
            isLoading: true,
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
                    this.props.navigation.navigate('Dashboard')
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

        firebase.auth().onAuthStateChanged(user => {
            this.setState({ isLoading: false })
            this.setState({ foundUser: user ? true : false })
            this.props.navigation.navigate(user ? 'Dashboard' : 'Home')
        })
    }

    render() {
        const { navigate } = this.props.navigation
        const contentToRender = (<ImageBackground
            style={styles.background}
            source={require('../assets/splash-bg.jpg')}>
            <View style={{ flex: 1 }}>
                <View style={styles.logo} >
                    <Image source={require('../assets/ReactNativeFirebase.png')} style={{ width: Dimensions.get("window").width - 20, margin: 10, flex: 1 }} resizeMode="contain" >

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
                        <Text style={{ flex: 1, textAlign: 'center', color: 'red' }} onPress={() => {
                            navigate('ForgotPassword')
                        }}> Forgot Password? </Text>

                    </View>
                </View>
            </View>
        </ImageBackground>)
        return (
            <Root>{
                this.state.showActivity ? (
                    <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Spinner color="red" />
                    </Container>) :
                    Platform.OS === "ios" ?
                        <SafeAreaView keyboardShouldPersistTaps="always">
                            {this.state.isLoading ?
                                (<Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    <Spinner color="red" />
                                </Container>) :
                                contentToRender
                            }
                        </SafeAreaView> :
                        <ScrollView keyboardShouldPersistTaps="always" >
                            {this.state.isLoading ?
                                (<Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    <Spinner color="red" />
                                </Container>) :
                                contentToRender
                            }
                        </ScrollView>
            }
            </Root>
        )
    }
}

const styles = StyleSheet.create({
    logo: {
        flex: 4,
    },
    background: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    form: {
        flex: 4,
        margin: 20
    },
    inputContainer: {

    },
    signinButton: {
        flex: 1,
        marginTop: 10,
        marginLeft: 50,
        marginRight: 50
    },
    Text: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 5,
        height: 50,
        backgroundColor: 'lightgrey'
    },
    SignupText: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 30
    }
});
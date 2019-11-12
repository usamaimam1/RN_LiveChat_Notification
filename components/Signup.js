import React from 'react'
import {
    StyleSheet,
    Platform,
    Image,
    Text,
    View,
    ScrollView,
    ImageBackground,
    Dimensions,
    TextInput,
    Button,
    ToastAndroid,
    KeyboardAvoidingView,
    SafeAreaView
} from 'react-native';
import { Toast, Root, Container, Spinner } from 'native-base'
import firebase from 'react-native-firebase'
import * as Progress from 'react-native-progress'


export default class SignUp extends React.Component {
    static navigationOptions = {
        // header: null
    }
    constructor() {
        super();
        this.state = {
            userEmail: null,
            userPassword: null,
            userPasswordConfirm: null,
            showActivity: false
        };
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this)
        this.handleUserPasswordChange = this.handleUserPasswordChange.bind(this)
        this.handleUserPasswordChangeConfirm = this.handleUserPasswordChangeConfirm.bind(this)
        this.handleSignUp = this.handleSignUp.bind(this)
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
    handleSignUp() {
        this.setState({ showActivity: true })
        if (this.state.userEmail && this.state.userPassword && this.state.userPasswordConfirm) {
            if (this.state.userPassword === this.state.userPasswordConfirm) {
                firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
                    .then(() => {
                        this.setState({ userEmail: null, userPassword: null, userPasswordConfirm: null, showActivity: false })
                        const ref = firebase.database().ref("users")
                        // console.log(firebase.auth().currentUser)
                        const User = firebase.auth().currentUser._user
                        ref.child(User.uid).set({
                            email:User.email,
                            uid:User.uid,
                            adminaccess:false
                        },(err)=>{
                            console.log(err)
                        })
                        // const upload = {
                        //     [firebase.auth().currentUser._user.uid]:
                        //     {uid:firebase.auth().currentUser._user.uid,
                        //     email:firebase.auth().currentUser._user.email}}
                        // ref.set(upload,()=>{
                        //     console.log("user added")
                        // })
                        this.props.navigation.navigate('Dashboard')
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
    render() {
        const { navigate } = this.props.navigation
        // console.log(this.state)
        const contentToRender = (<ImageBackground style={styles.background} source={require('../assets/splash-bg.jpg')}>
            <View style={{ flex: 1 }}>
                <View style={styles.logo} >
                    <Image source={require('../assets/ReactNativeFirebase.png')} style={{ width: Dimensions.get("window").width - 20, margin: 10, flex: 1 }} resizeMode="contain" >

                    </Image>
                </View>
                <View style={styles.form} >
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Enter Email : " textContentType="emailAddress" style={styles.Text} onChangeText={this.handleUserEmailChange} value={this.state.userEmail} >

                        </TextInput>
                        <TextInput placeholder="Enter Password : " textContentType="password" style={styles.Text} onChangeText={this.handleUserPasswordChange} secureTextEntry={true} value={this.state.userPassword}>

                        </TextInput>
                        <TextInput placeholder="Enter Password Again : " textContentType="password" style={styles.Text} onChangeText={this.handleUserPasswordChangeConfirm} secureTextEntry={true} value={this.state.userPasswordConfirm}>

                        </TextInput>
                    </View>
                    <View style={styles.signinButton}>
                        <Button title={"Sign Up"} onPress={() => {
                            this.handleSignUp()
                        }}> </Button>
                    </View>
                    <View style={styles.SignupText}>
                        <Text style={{ flex: 1, textAlign: 'right' }}> Already have an account? </Text>
                        <Text style={{ flex: 1, textAlign: 'left', color: 'red' }} onPress={() => { navigate('Home') }}> Sign In? </Text>
                    </View>
                </View>
            </View>
        </ImageBackground>)
        return (
            <Root>{
                this.state.showActivity ?
                    (
                        <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Spinner color="red" />
                        </Container>
                    )
                    : Platform.OS === "ios" ?
                        (<SafeAreaView>
                            {contentToRender}
                        </SafeAreaView>)
                        : (<ScrollView keyboardShouldPersistTaps="always">
                            {contentToRender}
                        </ScrollView>)
            }
            </Root>)
    }
}

const styles = StyleSheet.create({
    logo: {
        flex: 1,
    },
    background: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    form: {
        flex: 2,
        margin: 20
    },
    inputContainer: {

    },
    signinButton: {
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

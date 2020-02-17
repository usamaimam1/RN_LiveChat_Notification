import React from 'react'
import {
    StyleSheet, Platform,
    Image, Text, View, ScrollView, ImageBackground,
    Dimensions, TextInput, Button, ToastAndroid, KeyboardAvoidingView,
    SafeAreaView
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import { Toast, Root, Container, Spinner } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'react-native-firebase'
import * as Progress from 'react-native-progress'

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class SignUp extends React.Component {
    static navigationOptions = {
        // header: null
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
                alert('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                const source = { uri: response.uri };
                ImageResizer.createResizedImage(source.uri, 200, 200, 'PNG', 99).then((output) => {
                    this.setState({ imgSource: { uri: output.uri } })
                    console.log(output.size)
                    // response.uri is the URI of the new image that can now be displayed, uploaded...
                    // response.path is the path of the new image
                    // response.name is the name of the new image with the extension
                    // response.size is the size of the new image
                }).catch((err) => {
                    console.log(err.message)
                    // Oops, something went wrong. Check that the filename is correct and
                    // inspect err to get more details.
                });
            }
        });
    }
    render() {
        const { navigate } = this.props.navigation
        // console.log(this.state)
        const contentToRender = (
            <KeyboardAwareScrollView>
                <ImageBackground style={styles.background} source={require('../../assets/splash-bg.jpg')}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.logo} >
                            <Image source={require('../../assets/ReactNativeFirebase.png')} style={{ width: 150, height: 150, margin: 10, flex: 1 }} resizeMode="contain" ></Image>
                        </View>
                        <View style={styles.form} >
                            <View style={styles.inputContainer}>
                                <TextInput placeholder="Enter Full Name : " textContentType="name" style={styles.Text} onChangeText={this.handlefullnamechange} value={this.state.fullName}></TextInput>
                                <TextInput placeholder="Enter Email : " textContentType="emailAddress" style={styles.Text} onChangeText={this.handleUserEmailChange} value={this.state.userEmail}></TextInput>
                                <TextInput placeholder="Enter Password : " textContentType="password" style={styles.Text} onChangeText={this.handleUserPasswordChange} secureTextEntry={true} value={this.state.userPassword}></TextInput>
                                <TextInput placeholder="Enter Password Again : " textContentType="password" style={styles.Text} onChangeText={this.handleUserPasswordChangeConfirm} secureTextEntry={true} value={this.state.userPasswordConfirm}></TextInput>
                                <TextInput placeholder="Pick An Image" textContentType="URL" style={styles.Text} onFocus={this.handlePickImage} secureTextEntry={false} value={this.state.imgSource ? this.state.imgSource.uri : null} ></TextInput>
                            </View>
                            <View style={styles.signinButton}>
                                <Button title={"Sign Up"} onPress={() => {
                                    this.handleSignUp()
                                }}> </Button>
                            </View>
                            <View style={styles.SignupText}>
                                <Text style={{ flex: 1, textAlign: 'center' }}> Already have an account? </Text>
                                <Text style={{ flex: 1, textAlign: 'left', color: 'red' }} onPress={() => { navigate('Home') }}> Sign In? </Text>
                            </View>
                            {
                                this.state.imgSource ?
                                    <Image source={this.state.imgSource} style={{ width: 200, height: 200, alignSelf: 'center' }} >
                                    </Image> : null
                            }
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        )
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
        alignItems: 'center',
        justifyContent: 'center'
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
        justifyContent: 'center',
        marginLeft: 50
    }
});

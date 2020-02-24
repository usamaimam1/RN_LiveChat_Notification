import React from 'react'
import {
    View, Text, Image, StyleSheet, ScrollView, ImageBackground, TextInput,
    ToastAndroid, Dimensions, Button, Platform, SafeAreaView
} from 'react-native'
import { Toast, Root, Container, Content, Spinner } from 'native-base'
import firebase from 'react-native-firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class ChangePassword extends React.Component {
    static navigationOptions = {
        // header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: null,
            newPassword: null,
            newPasswordConfirm: null,
            showActivity: false
        }
        this.handleOldPassword = this.handleOldPassword.bind(this)
        this.handleNewPassword = this.handleNewPassword.bind(this)
        this.handleNewPasswordConfirm = this.handleNewPasswordConfirm.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.reauthenticate = this.reauthenticate.bind(this)
        this.handleConfirmAndValidation = this.handleConfirmAndValidation.bind(this)
    }
    handleOldPassword(oldPassword) {
        this.setState({ oldPassword: oldPassword })
    }
    handleNewPassword(newPassword) {
        this.setState({ newPassword: newPassword })
    }
    handleNewPasswordConfirm(newPasswordConfirm) {
        this.setState({ newPasswordConfirm: newPasswordConfirm })
    }
    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }
    handleChangePassword(oldPassword, newPassword) {
        this.setState({ showActivity: true })
        this.reauthenticate(oldPassword).then(() => {
            let user = firebase.auth().currentUser;
            user.updatePassword(newPassword).then(() => {
                // ToastAndroid.show("Password updated!", ToastAndroid.LONG);
                Toast.show({
                    text: 'Password Updated',
                    buttonText: 'OK',
                    duration: 2500
                })
                this.setState({ oldPassword: null, newPassword: null, newPasswordConfirm: null, showActivity: false })
                this.props.navigation.navigate('Dashboard')
            }).catch((error) => {
                // ToastAndroid.show(error.message, ToastAndroid.SHORT);
                this.setState({ showActivity: false })
                Toast.show({
                    text: error.message,
                    buttonText: 'OK',
                    duration: 2500
                })
            });
        }).catch((error) => {
            // ToastAndroid.show(error.message, ToastAndroid.SHORT)
            this.setState({ showActivity: false })
            Toast.show({
                text: error.message,
                buttonText: 'OK',
                duration: 2500
            })
        });
        // this.setState({ showActivity: false })
    }
    handleConfirmAndValidation() {
        if (this.state.oldPassword && this.state.newPassword && this.state.newPasswordConfirm) {
            if (this.state.newPassword == this.state.newPasswordConfirm) {
                this.handleChangePassword(this.state.oldPassword, this.state.newPassword)
            } else {
                // ToastAndroid.show("Passwords Do NOT Match!..")
                Toast.show({
                    text: 'Passwords Do Not Match',
                    buttonText: 'OK',
                    duration: 2500
                })
            }
        } else {
            // ToastAndroid.show("Please don't leave the fields empty...")
            Toast.show({
                text: 'Please Do Not Leave the Fields Empty',
                buttonText: 'OK',
                duration: 2500
            })
        }
    }
    render() {
        const { navigate } = this.props.navigation
        const contentToRender = (<ImageBackground style={styles.background} source={require('../../assets/splash-bg.jpg')}>
            <View style={{ flex: 1 }}>
                <View style={styles.logo} >
                    <Image source={require('../../assets/ReactNativeFirebase.png')} style={{ width: 150, height: 150, margin: 10, flex: 1 }} resizeMode="contain" >

                    </Image>
                </View>
                <View style={styles.form} >
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Enter Original Password : " textContentType="password" style={styles.Text} onChangeText={this.handleOldPassword} secureTextEntry={true} value={this.state.oldPassword} >

                        </TextInput>
                        <TextInput placeholder="Enter New Password : " textContentType="password" style={styles.Text} onChangeText={this.handleNewPassword} secureTextEntry={true} value={this.state.newPassword}>

                        </TextInput>
                        <TextInput placeholder="Enter New Password Again : " textContentType="password" style={styles.Text} onChangeText={this.handleNewPasswordConfirm} secureTextEntry={true} value={this.state.newPasswordConfirm}>

                        </TextInput>
                    </View>
                    <View style={styles.signinButton}>
                        <Button title={"Validate and Confirm"} onPress={() => {
                            this.handleConfirmAndValidation()
                        }}> </Button>
                    </View>
                </View>
            </View>
        </ImageBackground>)
        return (
            <Root>
                {
                    this.state.showActivity ? (
                        <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Spinner color="red" />
                        </Container>) :
                        Platform.OS === "ios" ?
                            (<SafeAreaView>
                                <KeyboardAwareScrollView>
                                    {contentToRender}
                                </KeyboardAwareScrollView>
                            </SafeAreaView>)
                            : (< KeyboardAwareScrollView keyboardShouldPersistTaps="always" >
                                {contentToRender}
                            </ KeyboardAwareScrollView >)
                }
            </Root>
        )
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
        marginLeft: 30
    }
})
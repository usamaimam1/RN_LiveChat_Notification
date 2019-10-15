import React from 'react'
import {
    Text,
    View,
    Image,
    Platform,
    Dimensions,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TextInput,
    Button,
    ToastAndroid,
    Alert
} from 'react-native'
import firebase from 'react-native-firebase'
import { SafeAreaView } from 'react-navigation'

export default class ForgotPassword extends React.Component {
    static navigationOptions = {
        // header: null
    }
    constructor(props) {
        super(props)
        console.log(this.props.navigation)
        this.state = {
            userEmail: null,
            passwordChangeCode: this.props.navigation.state.params.code,
            newPassword: null,
            confirmnewPassword: null,
            receivedCode: this.props.navigation.state.params.code ? true : false
        }
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this)
        this.handleUserPasswordChange = this.handleUserPasswordChange.bind(this)
        this.handleUserPasswordChangeConfirm = this.handleUserPasswordChangeConfirm.bind(this)
        this.handlepasswordChangeCode = this.handlepasswordChangeCode.bind(this)
    }
    componentDidMount() {

    }
    handleUserEmailChange(userEmail) {
        this.setState({ userEmail: userEmail })
    }
    handleUserPasswordChange(userPassword) {
        this.setState({ newPassword: userPassword })
    }
    handleUserPasswordChangeConfirm(userPasswordConfirm) {
        this.setState({ confirmnewPassword: userPasswordConfirm })
    }
    handlepasswordChangeCode(code) {
        this.setState({ passwordChangeCode: code })
    }
    render() {
        const { navigate } = this.props.navigation
        const ContentToRender = (
            <ImageBackground style={styles.background} source={require('../assets/splash-bg.jpg')}>
                {/* <ActivityIndicator size="large" animating={this.state.showActivity} /> */}
                <View style={{ flex: 1 }}>
                    <View style={styles.logo} >
                        <Image source={require('../assets/ReactNativeFirebase.png')} style={{ width: Dimensions.get("window").width - 20, margin: 10, flex: 1 }} resizeMode="contain" >

                        </Image>
                    </View>
                </View>
                <View style={styles.form} >
                    <View style={styles.inputContainer}>
                        {this.state.receivedCode ? null :
                            <TextInput placeholder="Enter Email : " textContentType="emailAddress" style={styles.Text} onChangeText={this.handleUserEmailChange} value={this.state.userEmail} >

                            </TextInput>
                        }
                        {this.state.receivedCode ?
                            <TextInput
                                placeholder="Enter Password : "
                                textContentType="password"
                                style={styles.Text}
                                onChangeText={this.handleUserPasswordChange}
                                secureTextEntry={true}
                                value={this.state.newPassword}>

                            </TextInput>
                            : null}
                        {this.state.receivedCode ?
                            <TextInput
                                placeholder="Enter Password Again : "
                                textContentType="password"
                                style={styles.Text}
                                onChangeText={this.handleUserPasswordChangeConfirm}
                                secureTextEntry={true}
                                value={this.state.confirmnewPassword}>
                            </TextInput>
                            : null}
                    </View>
                    <View style={styles.signinButton}>
                        <Button
                            title={"Submit"}
                            onPress={() => {
                                if (!this.state.receivedCode) {
                                    firebase.auth().sendPasswordResetEmail(this.state.userEmail, { android: { packageName: "com.spl.firebasetest" }, iOS: {}, url: "https://firebasetestrandom.page.link", handleCodeInApp: true })
                                        .then(() => {
                                            // console.log(url)
                                            Alert.alert(
                                                'Notification',
                                                'Please Check Your Email',
                                                [
                                                    { text: 'OK', onPress: () => navigate('Home') }
                                                ],
                                                { cancelable: false },
                                            );

                                            // this.setState({receivedCode:true})

                                        })
                                        .catch(err => {
                                            ToastAndroid.show(err.message, ToastAndroid.LONG)
                                        })
                                } else {
                                    if (this.state.newPassword && this.state.confirmnewPassword) {
                                        if (this.state.newPassword == this.state.confirmnewPassword) {
                                            firebase.auth().confirmPasswordReset(this.state.passwordChangeCode, this.state.newPassword).then(() => {
                                                ToastAndroid.show("Password Changed Successfully..", ToastAndroid.SHORT)
                                                this.setState({ newPassword: null, confirmPasswordReset: null, passwordChangeCode: null })
                                                navigate('Home')
                                            }).catch(err => {
                                                ToastAndroid.show(err.message, ToastAndroid.SHORT)
                                            })
                                        } else {
                                            ToastAndroid.show("Passwords Do not match", ToastAndroid.SHORT)
                                            this.setState({ newPassword: null, confirmnewPassword: null })
                                        }
                                    } else {
                                        ToastAndroid.show('Please do not leave the fields empty', ToastAndroid.SHORT)
                                    }
                                }
                            }} />
                    </View>
                </View>
            </ImageBackground>)
        if (Platform.OS === "ios") {
            return (
                <SafeAreaView style={styles.Container}>
                    {ContentToRender}
                </SafeAreaView>)
        } else {
            return (
                <ScrollView style={styles.Container} keyboardShouldPersistTaps="always">
                    {ContentToRender}
                </ScrollView>
            )
        }
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
        flex: 1,
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
        borderRadius: 5
    },
    SignupText: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 30
    }
})
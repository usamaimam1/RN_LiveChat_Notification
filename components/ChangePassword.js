import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TextInput,
    ToastAndroid,
    Dimensions,
    Button
} from 'react-native'
import firebase from 'react-native-firebase'

export default class ChangePassword extends React.Component {
    static navigationOptions ={
        header:null
    }
    constructor(props){
        super(props)
        this.state={
            oldPassword:null,
            newPassword:null,
            newPasswordConfirm:null
        }
        this.handleOldPassword = this.handleOldPassword.bind(this)
        this.handleNewPassword = this.handleNewPassword.bind(this)
        this.handleNewPasswordConfirm = this.handleNewPasswordConfirm.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.reauthenticate = this.reauthenticate.bind(this)
    }
    handleOldPassword(oldPassword){
        this.setState({oldPassword:oldPassword})
    }
    handleNewPassword(newPassword){
        this.setState({newPassword:newPassword})
    }
    handleNewPasswordConfirm(newPasswordConfirm){
        this.setState({newPasswordConfirm:newPasswordConfirm})
    }
    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }
    handleChangePassword(oldPassword,newPassword){
        this.reauthenticate(oldPassword).then(() => {
            let user = firebase.auth().currentUser;
            user.updatePassword(newPassword).then(() => {
              ToastAndroid.show("Password updated!",ToastAndroid.LONG);
              this.setState({oldPassword:null,newPassword:null,newPasswordConfirm:null})
              this.props.navigation.navigate('Dashboard')
            }).catch((error) => { ToastAndroid.show(error.message,ToastAndroid.SHORT); });
          }).catch((error) => { ToastAndroid.show(error.message,ToastAndroid.SHORT) });
    }
    render() {
        const {navigate} = this.props.navigation
        return (
            <ScrollView keyboardShouldPersistTaps="always">
                <ImageBackground style={styles.background} source={require('../assets/bg-hd.jpg')}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.logo} >
                            <Image source={require('../assets/ReactNativeFirebase.png')} style={{ width: Dimensions.get("window").width - 20, margin: 10, flex: 1 }} resizeMode="contain" >

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
                                   if(this.state.oldPassword && this.state.newPassword && this.state.newPasswordConfirm){
                                        if(this.state.newPassword == this.state.newPasswordConfirm){
                                            this.handleChangePassword(this.state.oldPassword,this.state.newPassword)
                                        }else{
                                            ToastAndroid.show("Passwords Do NOT Match!..")
                                        }
                                   }else{
                                       ToastAndroid.show("Please don't leave the fields empty...")
                                   }
                                }}> </Button>
                            </View>
                            {/* <View style={styles.SignupText}>
                                <Text style={{ flex: 1, textAlign: 'right' }}> Already have an account? </Text>
                                <Text style={{ flex: 1, textAlign: 'left', color: 'red' }} onPress={() => { navigate('Home') }}> Sign In? </Text>
                            </View> */}
                        </View>
                    </View>
                </ImageBackground>
            </ScrollView>
        )
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
        borderRadius: 5
    },
    SignupText: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 30
    }
})
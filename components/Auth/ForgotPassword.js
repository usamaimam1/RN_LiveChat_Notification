import React from 'react'
import {
    Text, View, Image, Platform, Dimensions, StyleSheet, ScrollView,
    ImageBackground, TextInput, Button, ToastAndroid, Alert, TouchableOpacity
} from 'react-native'
import { Toast, Root, Item, Input } from 'native-base'
import firebase from 'react-native-firebase'
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as SvgIcons from '../../assets/SVGIcons/index'
export default class ForgotPassword extends React.Component {
    static navigationOptions = {
        header: null
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
        this.handleConfirmation = this.handleConfirmation.bind(this)
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
    handleConfirmation() {
        console.log(this.state.userEmail)
        if (this.state.userEmail) {
            firebase.auth().sendPasswordResetEmail(this.state.userEmail)
                .then(() => {
                    Alert.alert('Notification', 'Please Check Your Email', [
                        { text: 'OK', onPress: () => navigate('Home') }
                    ], { cancelable: false });
                })
                .catch(err => {
                    Toast.show({ text: err.message, buttonText: 'OK', duration: 2500 })
                })
        } else {
            Toast.show({ text: 'Do not leave the fields empty', buttonText: 'Okay', duration: 2500 })
        }
    }
    render() {
        return (
            <Root>
                <KeyboardAwareScrollView>
                    <SafeAreaView style={styles.Container}>
                        <View style={styles.Header}>
                            <View style={styles.HeaderInnerView} >
                                <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                                <Text style={styles.HeaderTitle}>Forgot Password</Text>
                            </View>
                        </View>
                        <View style={styles.SubContainer}>
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
                                <TouchableOpacity style={styles.SignInButton} onPress={() => { this.handleConfirmation() }}>
                                    <Text style={{ color: 'white',fontFamily: "Montserrat", }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </KeyboardAwareScrollView>
            </Root>
        )
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
        marginLeft: wp(4.533), fontSize: RFValue(14), color: '#34304C', fontWeight: "500",fontFamily: "Montserrat",
    },
    SubContainer: {
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
    SignInButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#F48A20',
        height: hp(5.5),
        marginTop: hp(3.5),
        color: 'white'
    }
})
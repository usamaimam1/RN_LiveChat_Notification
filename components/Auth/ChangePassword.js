import React from 'react'
import {
    View, Text, Image, StyleSheet, ScrollView, ImageBackground, TextInput,
    ToastAndroid, Dimensions, Button, Platform, SafeAreaView, TouchableOpacity
} from 'react-native'
import { Toast, Root, Container, Content, Spinner, Item, Input } from 'native-base'
import firebase from 'react-native-firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as SvgIcons from '../../assets/SVGIcons/index'
export default class ChangePassword extends React.Component {
    static navigationOptions = {
        header: null
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
                Toast.show({ text: 'Password Updated', buttonText: 'OK', duration: 2500 })
                this.setState({ oldPassword: null, newPassword: null, newPasswordConfirm: null, showActivity: false })
                this.props.navigation.navigate('Dashboard')
            }).catch((error) => {
                this.setState({ showActivity: false })
                Toast.show({ text: error.message, buttonText: 'OK', duration: 2500 })
            });
        }).catch((error) => {
            this.setState({ showActivity: false })
            Toast.show({ text: error.message, buttonText: 'OK', duration: 2500 })
        });
    }
    handleConfirmAndValidation() {
        if (this.state.oldPassword && this.state.newPassword && this.state.newPasswordConfirm) {
            if (this.state.newPassword == this.state.newPasswordConfirm) {
                this.handleChangePassword(this.state.oldPassword, this.state.newPassword)
            } else {
                Toast.show({ text: 'Passwords Do Not Match', buttonText: 'OK', duration: 2500 })
            }
        } else {
            Toast.show({ text: 'Please Do Not Leave the Fields Empty', buttonText: 'OK', duration: 2500 })
        }
    }
    render() {
        return (
            <Root>
                {
                    this.state.showActivity ? (
                        <Container style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Spinner color="red" />
                        </Container>) :
                        <KeyboardAwareScrollView>
                            <SafeAreaView style={styles.Container}>
                                <View style={styles.Header}>
                                    <View style={styles.HeaderInnerView} >
                                        <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                                        <Text style={styles.HeaderTitle}>Change Password</Text>
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
                                            <Input placeholder='Old Password' style={{ fontFamily: "Montserrat", }} value={this.state.oldPassword} onChangeText={this.handleOldPassword} textContentType="password" secureTextEntry />
                                        </Item>
                                        <Item rounded style={[styles.Field, { marginTop: hp(1.84) }]}>
                                            <Input placeholder='New Password' style={{ fontFamily: "Montserrat", }} value={this.state.newPassword} onChangeText={this.handleNewPassword} textContentType="password" secureTextEntry />
                                        </Item>
                                        <Item rounded style={[styles.Field, { marginTop: hp(1.84) }]}>
                                            <Input placeholder='Confirm Password' style={{ fontFamily: "Montserrat", }} value={this.state.newPasswordConfirm} onChangeText={this.handleNewPasswordConfirm} textContentType="password" secureTextEntry />
                                        </Item>
                                        <TouchableOpacity style={styles.SignInButton} onPress={() => { this.handleConfirmAndValidation() }}>
                                            <Text style={{ color: 'white', fontFamily: "Montserrat", }}>Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </KeyboardAwareScrollView>
                }
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
        marginLeft: wp(4.533), fontSize: RFValue(14), color: '#34304C', fontWeight: "500", fontFamily: "Montserrat",
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
import React from 'react'
import { View, Text, ActivityIndicator, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'react-native-firebase'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default class LoadingScreen extends React.Component {
    constructor(props) {
        super(props)
        setTimeout(() => {
            this.loadApp()
        }, 1000)
        // this.loadApp()
    }
    loadApp = async () => {
        this.props.navigation.navigate(firebase.auth().currentUser ? 'App' : 'Auth')
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/SVGIcons/logo.png')} style={{ width: wp(45), height: hp(22) }} resizeMode="contain"></Image>
            </View>
        )
    }
}
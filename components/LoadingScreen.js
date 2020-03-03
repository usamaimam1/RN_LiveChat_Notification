import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'react-native-firebase'
export default class LoadingScreen extends React.Component {
    constructor(props) {
        super(props)
        this.loadApp()
    }
    loadApp = async () => {
        this.props.navigation.navigate(firebase.auth().currentUser ? 'App' : 'Auth')
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }
}
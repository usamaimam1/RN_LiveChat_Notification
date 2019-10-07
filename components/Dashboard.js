import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    Button,
    ToastAndroid,
    Picker
} from 'react-native'
import firebase from 'react-native-firebase'

export default class Dashboard extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor() {
        super()
        this.state={
            language:null
        }
    }
    componentDidMount() {
        // console.warn(firebase.auth().currentUser.email)
    }
    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                <Text> Welcome User {firebase.auth().currentUser.email} </Text>
                <Picker
                    selectedValue={this.state.language}
                    style={{ height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({ language: itemValue })
                    }>
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                </Picker>
                <Button title="Change Password" onPress={() => {
                    navigate('ChangePassword')
                }} />
                <Button title="Sign Out" onPress={() => {
                    firebase.auth().signOut().then(() => {
                        navigate('Home')
                    }).catch((err) => {
                        ToastAndroid.show(err.message, ToastAndroid.LONG)
                    })
                }} />
            </View>)
    }
}
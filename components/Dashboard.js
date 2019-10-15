import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    Button,
    ToastAndroid,
    Picker,
    Dimensions,
    SafeAreaView
} from 'react-native'
import firebase from 'react-native-firebase'
import OptionsMenu from 'react-native-options-menu'

export default class Dashboard extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor() {
        super()
        this.state = {
            navigateTo: null
        }
        this.handleSignOut = this.handleSignOut.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
    }
    componentDidMount() {
        // console.warn(firebase.auth().currentUser.email)
    }
    handleSignOut(){
        firebase.auth().signOut().then(() => {
            this.props.navigation.navigate('Home')
        }).catch((err) => {
            ToastAndroid.show(err.message, ToastAndroid.LONG)
        })
    }
    handleChangePassword(){
        this.props.navigation.navigate('ChangePassword')
    }
    render() {
        const { navigate } = this.props.navigation
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                    <View style={{ flex: 1, justifyContent:'center',alignItems:'flex-start' }}>
                        <Text style={{margin:10}}> Welcome User! </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        {Platform.OS == "ios" ? 
                        <OptionsMenu 
                            button={require('../assets/ReactNativeFirebase.png')}
                            buttonStyle={{ width: 40, height: 40, resizeMode: "contain" }}
                            destructiveIndex={1}
                            options={["Change Password", "Sign Out","Cancel"]}
                            actions={[this.handleChangePassword,this.handleSignOut,()=>{}]} />
                        :<OptionsMenu
                            button={require('../assets/ReactNativeFirebase.png')}
                            buttonStyle={{ width: 40, height: 40, resizeMode: "contain" }}
                            destructiveIndex={1}
                            options={["Change Password", "Sign Out"]}
                            actions={[this.handleChangePassword,this.handleSignOut]} />
                        }
                    </View>
                </View>
                <View style={{ flex: 14, justifyContent: 'center', alignItems: 'center' }}>
                   {/* <Image source={require('../assets/iqbal.jpg')} resizeMode="contain" style={{flex:1,height:height,width:width}}>
                       
                    </Image> */}
                </View>
            </SafeAreaView>
        )
    }
}
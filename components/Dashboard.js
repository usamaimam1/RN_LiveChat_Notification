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
    SafeAreaView,
    FlatList
} from 'react-native'
import firebase from 'react-native-firebase'
import OptionsMenu from 'react-native-options-menu'

import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

function Item({ body, poet }) {
    return (
        <View style={styles.item}>
            <Text style={styles.body}>{body[0]}</Text>
            <Text style={styles.body}>{body[1]}</Text>
            <Text style={styles.poet}>{poet}</Text>
        </View>
    );
}

export default class Dashboard extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor() {
        super()
        this.state = {
            userData:null,
            status: null,
            imgSource: null
        }
        this.handleSignOut = this.handleSignOut.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.pickImage = this.pickImage.bind(this)
    }
    componentDidMount() {
        const User = firebase.auth().currentUser._user
        const ref = firebase.database().ref("users").child(User.uid)
        const funcref = ref.on('value',data => {
            console.log(data)
            // this.setState({userData:data._data})
            this.setState({ status: data._value.adminaccess ? 'Admin' : 'Employee',userData:data._value })
            // console.log(data._value.adminaccess)
        })

        // const anotherRef = firebase.database().ref("users")
        // anotherRef.once('value').then(data => {
        //     console.log(data)
        // }).catch(err => {
        //     console.log(err.message)
        // })
    }
    handleSignOut() {
        firebase.auth().signOut().then(() => {
            this.props.navigation.navigate('Home')
        }).catch((err) => {
            ToastAndroid.show(err.message, ToastAndroid.LONG)
        })
    }
    handleChangePassword() {
        this.props.navigation.navigate('ChangePassword')
    }
    pickImage = () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                alert('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    imgSource: source
                });
            }
        });
    };
    render() {
        const { navigate } = this.props.navigation
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        console.log(this.state)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ margin: 10 }}> Signed In as {this.state.status} </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        {Platform.OS == "ios" ?
                            <OptionsMenu
                                button={require('../assets/ReactNativeFirebase.png')}
                                buttonStyle={{ width: 40, height: 40, resizeMode: "contain" }}
                                destructiveIndex={1}
                                options={["Change Password", "Sign Out", "Cancel"]}
                                actions={[this.handleChangePassword, this.handleSignOut, () => { }]} />
                            : <OptionsMenu
                                button={require('../assets/ReactNativeFirebase.png')}
                                buttonStyle={{ width: 40, height: 40, resizeMode: "contain" }}
                                destructiveIndex={1}
                                options={["Change Password", "Sign Out"]}
                                actions={[this.handleChangePassword, this.handleSignOut]} />
                        }
                    </View>
                </View>
                <View style={{ flex: 14, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={this.state.userData ? {uri:this.state.userData.profilepic}:null} style={{width:100,height:100}}></Image>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    item: {
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1
    },
    body: {
        flex: 2
    },
    poet: {
        flex: 1
    }
})
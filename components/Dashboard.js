import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    ToastAndroid,
    Picker,
    Dimensions,
    SafeAreaView,
    FlatList,
} from 'react-native'
import firebase from 'react-native-firebase'
import { Content, Card, CardItem, Right, Icon, Fab, Container, Footer, FooterTab, Badge, Button } from 'native-base'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OptionsMenu from 'react-native-options-menu'
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer'
import UUIDGenerator from 'react-native-uuid-generator';
import { ScrollView } from 'react-native-gesture-handler';

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
            userData: null,
            status: null,
            imgSource: null,
            iconSource: require('../assets/ReactNativeFirebase.png'),
            active: null
        }
        this.handleSignOut = this.handleSignOut.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.pickImage = this.pickImage.bind(this)
    }
    componentDidMount() {
        const User = firebase.auth().currentUser._user
        const ref = firebase.database().ref("users").child(User.uid)
        const funcref = ref.on('value', data => {
            console.log(data)
            this.setState({ status: data._value.adminaccess ? 'Admin' : 'Employee', userData: data._value })
            this.setState({ iconSource: { uri: data._value.profilepic, cache: 'force-cache' } })
        })
        const projRef = firebase.database().ref('Projects')
        const projFunc = projRef.on('value',data=>{
            
        })
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
                this.setState({ imgSource: source })
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
                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ margin: 10 }}> Signed In as {this.state.status} </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        {Platform.OS == "ios" ?
                            <OptionsMenu
                                button={this.state.iconSource}
                                buttonStyle={{ width: 40, height: 40, borderRadius: 50 }}
                                destructiveIndex={1}
                                options={["Change Password", "Sign Out", "Cancel"]}
                                actions={[this.handleChangePassword, this.handleSignOut, () => { }]} />
                            : <OptionsMenu
                                button={this.state.iconSource}
                                buttonStyle={{ width: 40, height: 40, borderRadius: 50 }}
                                destructiveIndex={1}
                                options={["Change Password", "Sign Out"]}
                                actions={[this.handleChangePassword, this.handleSignOut]} />
                        }
                    </View>
                </View>
                <View style={{ flex: 13, alignItems: 'center', borderWidth: 1 }}>
                    <Text>Welcome {this.state.userData ? this.state.userData.fullName : null}</Text>
                    <ScrollView style={{height:Dimensions.get("window").height-100}}>
                        <Text style={{textAlign:'center'}}>My Projects</Text>
                    </ScrollView>
                </View>
                {this.state.userData ? this.state.userData.adminaccess ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                        <Button rounded success style={{ width: RFValue(40), height: RFValue(40), alignItems: 'center', justifyContent: 'center' }} onPress={() => { this.props.navigation.navigate('AddProject') }}>
                            <Text style={{ fontSize: RFValue(20) }}>+</Text>
                        </Button>
                    </View> : null : null}
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
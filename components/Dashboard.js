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

function Item({ body,poet }) {
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
            navigateTo: null,
            docs: null
        }
        this.handleSignOut = this.handleSignOut.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.unsubscribe = firebase.firestore().collection("poetry").onSnapshot(querySnapShot=>{
            this.setState({ docs: querySnapShot._docs })
        })
    }
    componentDidMount() {
        firebase.firestore().collection("poetry").get().then(querySnapShot => {
            // console.log(querySnapShot._docs[0].data())
            this.setState({ docs: querySnapShot._docs })
        })
        // console.warn(firebase.auth().currentUser.email)
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
    render() {
        const { navigate } = this.props.navigation
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ margin: 10 }}> Welcome User! </Text>
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
                    <FlatList
                        data={this.state.docs}
                        renderItem={({ item }) => <Item body={item.data().body} poet={item.data().poet} />}
                        keyExtractor={item => item.id}
                    />
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    item:{
        flex:1,
        margin:10,
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:1
    },
    body:{
        flex:2
    },
    poet:{
        flex:1
    }
})
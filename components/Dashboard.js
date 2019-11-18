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
import { Content, Header, Card, CardItem, Right, Icon, Fab, Container, Footer, FooterTab, Badge, Button, Left, Body, Title, Subtitle, List, ListItem, Thumbnail } from 'native-base'
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
            active: null,
            myProjects: [],
            projectDetails: []
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
        const projFunc = projRef.on('value', data => {
            if (!data._value) {
                return
            }
            this.setState({projectDetails:[]})
            const projectIds = Object.keys(data._value)
            // console.log(Object.keys(data._value))
            const res = projectIds.filter(projectId => {
                return (
                    data._value[projectId].projectmanager[User.uid] ||
                    data._value[projectId].teamleads[User.uid] ||
                    data._value[projectId].teammembers[User.uid]
                )
            })
            res.forEach(id => {
                this.setState({ projectDetails: [...this.state.projectDetails, data._value[id]] })
            })
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
        return (
            <Container>
                <Header transparent>
                    <Left>
                        <Button transparent>
                            <Icon name="arrow-back" style={{ color: 'blue' }} />
                        </Button>
                    </Left>
                    <Body style={{ alignSelf: 'center' }}>
                        <Title style={{ color: 'black', textAlign: 'center' }}>Welcome</Title>
                        <Subtitle style={{ color: 'grey', textAlign: 'center' }}>{this.state.status}</Subtitle>
                    </Body>
                    <Right>
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
                    </Right>
                </Header>
                <Content>
                    <List>
                        {this.state.projectDetails.map(proj => {
                            return (
                                <ListItem key={proj.projectId} thumbnail onPress={()=>{
                                    console.log("clicked")
                                }}>
                                    <Left>
                                        <Thumbnail square source={{ uri: proj.projectThumbnail }} />
                                    </Left>
                                    <Body>
                                        <Text>{proj.projectTitle}</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent>
                                            <Text>View</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                            )
                        })}
                    </List>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button badge vertical>
                            <Badge><Text>2</Text></Badge>
                            <Icon name="message1" type="AntDesign" />
                            <Text>Messages</Text>
                        </Button>
                        <Button vertical>
                            <Icon name="user" type="AntDesign" />
                            <Text>User</Text>
                        </Button>
                        <Button active badge vertical>
                            <Badge ><Text>51</Text></Badge>
                            <Icon name="issue-opened" type="Octicons" />
                            <Text>Issues</Text>
                        </Button>
                        {this.state.userData ? this.state.userData.adminaccess ?
                            <Button vertical onPress={()=>{
                                this.props.navigation.navigate('AddProject')
                            }}>
                                <Icon name="plus" type="AntDesign" />
                                <Text>Add Project</Text>
                            </Button> : null : null
                        }
                    </FooterTab>
                </Footer>
            </Container>
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
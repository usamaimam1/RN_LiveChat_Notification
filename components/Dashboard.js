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
    ImageBackground,
    Alert,
    BackHandler
} from 'react-native'
import firebase from 'react-native-firebase'
import {
    Root, Content, Header, Card, CardItem, Right, Icon, Fab, Container, Footer, FooterTab, Badge, Button, Left, Body,
    Title, Subtitle, List, ListItem, Thumbnail, StyleProvider, Toast, Drawer, Switch
} from 'native-base'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OptionsMenu from 'react-native-options-menu'
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer'
import UUIDGenerator from 'react-native-uuid-generator';
import { ScrollView } from 'react-native-gesture-handler';
import SideBar from './SideBar'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {SetUser, AddUser} from '../redux/actions/index'
const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


class Dashboard extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor() {
        super()
        this.User = firebase.auth().currentUser._user
        this.state = {
            userData: null,
            status: null,
            imgSource: null,
            iconSource: require('../assets/ReactNativeFirebase.png'),
            active: null,
            projectDetails: [],
            refresh: null,
            issueCount: 0
        }
        this.enableAddandRemoveListeners = this.enableAddandRemoveListeners.bind(this)
        this.disableAddandRemoveListeners = this.disableAddandRemoveListeners.bind(this)
        this.preFetchFunc = this.preFetchFunc.bind(this)
        this.filterRelevantProjects = this.filterRelevantProjects.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.pickImage = this.pickImage.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.handleBackPress = this.handleBackPress.bind(this)
        this.closeDrawer = this.closeDrawer.bind(this)
        this.openDrawer = this.openDrawer.bind(this)
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        this.preFetchFunc()
        this.enableAddandRemoveListeners()
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        this.disableAddandRemoveListeners()
    }
    filterRelevantProjects(project) {
        const isProjectManager = project.projectmanager[this.User.uid] ? true : false
        const isTeamLead = project.teamleads ? project.teamleads[this.User.uid] ? true : false : false
        const isTeamMember = project.teammembers ? project.teammembers[this.User.uid] ? true : false : false
        console.log(isProjectManager || isTeamLead || isTeamMember)
        return isProjectManager || isTeamLead || isTeamMember
    }
    preFetchFunc() {
        const projRef = firebase.database().ref('Projects')
        projRef.once('value').then(data => {
            if (!data._value) {
                this.setState({ projectDetails: [] })
                return
            }
            console.log(data._value)
            const ProjectVals = Object.keys(data._value).map(_key => data._value[_key]).filter(this.filterRelevantProjects)
            console.log(ProjectVals)
            const issueCount = ProjectVals.map(project => project.issues ? Object.keys(project.issues).length : 0).reduce((res, curr) => res + curr)
            this.setState({ projectDetails: ProjectVals, issueCount: issueCount })
        })
    }
    enableAddandRemoveListeners() {
        const ref = firebase.database().ref("users").child(this.User.uid)
        this.userfuncref = ref.on('value', data => {
            if(data.val()){
                this.props.adduser(data._value)
                this.props.setuser(data._value)
                this.setState({ status: data._value.adminaccess ? 'Admin' : 'Employee', userData: data._value })
                this.setState({ iconSource: { uri: data._value.profilepic, cache: 'force-cache' } })
            }
        })
        this.projectchildaddedref = firebase.database().ref('Projects').on('child_added', data => {
            if (data.val()) {
                const isIncluded = this.state.projectDetails.filter(project => project.projectId === data.val().projectId)
                if (isIncluded.length === 0 && this.filterRelevantProjects(data.val())) {
                    this.setState({ projectDetails: [...this.state.projectDetails, data.val()] })
                }
            }
        })
        this.projectchildremoveref = firebase.database().ref('Projects').on('child_removed', data => {
            if (data.val()) {
                this.setState({ projectDetails: this.state.projectDetails.filter(project => project.projectId !== data.val().projectId) })
            }
        })
    }
    disableAddandRemoveListeners() {
        off('value', this.userfuncref)
        off('child_added', this.projectchildaddedref)
        off('child_removed', this.projectchildremoveref)
    }
    handleBackPress() {
        Toast.show({ text: 'Button Pressed', buttonText: 'Okay' })
        return true
    }
    formatDate(date) {
        // console.log(date)
        var monthNames = [
            "JAN", "FEB", "MAR",
            "APR", "MAY", "JUNE", "JULY",
            "AUG", "SEP", "OCT",
            "NOV", "DEC"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
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
    openDrawer() {
        this._drawer._root.open()
    }
    closeDrawer() {
        this._drawer._root.close()
    }
    render() {
        const { navigate } = this.props.navigation
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        console.log(this.props)
        return (
            <Drawer
                ref={ref => { this._drawer = ref }}
                content={<SideBar
                    imgSrc={this.state.iconSource}
                    _userData={this.props.user}
                    _navigation={this.props.navigation}
                    _onLogOut={this.handleSignOut}
                    _onChangePassword={this.handleChangePassword} />}
                onClose={() => { this.closeDrawer() }}>
                <Root>
                    <Container>
                        <ImageBackground source={require('../assets/splash-bg.jpg')}
                            style={{ width: width, height: height }}>
                            <Header transparent>
                                <Left>
                                    <Button transparent onPress={() => {
                                        this.openDrawer()
                                    }}>
                                        <Icon name="menu" style={{ color: 'blue' }} />
                                    </Button>
                                </Left>
                                <Body style={{ alignSelf: 'center' }}>
                                    <Title style={{ color: 'black', textAlign: 'center' }}>Welcome</Title>
                                    <Subtitle style={{ color: 'grey', textAlign: 'center' }}>{this.state.status}</Subtitle>
                                </Body>
                                <Right>

                                </Right>
                            </Header>
                            <Content>
                                <List>
                                    {this.state.projectDetails.map(proj => {
                                        return (
                                            <ListItem key={proj.projectId} thumbnail onPress={() => {
                                                this.props.navigation.navigate('ProjectScreen', {
                                                    projectId: proj.projectId,
                                                    userData: this.state.userData,
                                                    projectDetails: this.state.projectDetails,
                                                })
                                            }}>
                                                <Left>
                                                    <Thumbnail square source={{ uri: proj.projectThumbnail }} />
                                                </Left>
                                                <Body>
                                                    <Text>{proj.projectTitle}</Text>
                                                    <Text note numberOfLines={1} style={{ color: 'grey' }}>Date Added {this.formatDate(new Date(proj.dateAdded))}</Text>
                                                </Body>
                                                <Right>
                                                    {this.state.userData ? this.state.userData.adminaccess ?
                                                        <Button transparent onPress={() => {
                                                            Alert.alert(
                                                                'Warning',
                                                                'Are you sure to want to delete this project?',
                                                                [
                                                                    {
                                                                        text: 'Cancel',
                                                                        onPress: () => console.log('Cancel Pressed'),
                                                                        style: 'cancel',
                                                                    },
                                                                    {
                                                                        text: 'OK',
                                                                        onPress: () => {
                                                                            const ref = firebase.database().ref('Projects').child(proj.projectId)
                                                                            const projectThumbnail = proj.projectId
                                                                            firebase.storage().ref('projectThumbnails/' + projectThumbnail).delete().then(() => {
                                                                                // console.log('Project Thumbnail Removed From Storage')
                                                                            }).catch(err => {
                                                                                console.log(err.message)
                                                                            })
                                                                            ref.remove().then(() => {
                                                                                // console.log("Remove Successful!")
                                                                                this.setState({ refresh: null })
                                                                            })
                                                                            firebase.database().ref('Issues').orderByChild('projectId')
                                                                                .equalTo(proj.projectId)
                                                                                .once('value', data => {
                                                                                    data._childKeys.forEach(i => {
                                                                                        firebase
                                                                                            .database()
                                                                                            .ref('Issues')
                                                                                            .child(i)
                                                                                            .remove()
                                                                                    })
                                                                                })
                                                                            firebase.database().ref('Messages').child(proj.projectId)
                                                                                .remove()
                                                                        }
                                                                    },
                                                                ],
                                                                { cancelable: true },
                                                            );
                                                        }} >
                                                            <Icon name="cross" type="Entypo" />
                                                        </Button> : null : null}
                                                </Right>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Content>
                            <Footer>
                                <FooterTab>
                                    <Button active badge vertical>
                                        <Badge><Text>{this.state.projectDetails.length}</Text></Badge>
                                        <Icon name="project" type="Octicons" />
                                        <Text>Projects</Text>
                                    </Button>
                                    <Button vertical onPress={() => {
                                        this.props.navigation.navigate('UserProfile', {
                                            userData: this.state.userData,
                                            projectDetails: this.state.projectDetails,
                                            issueCount: this.state.issueCount
                                        })
                                    }}>
                                        <Icon name="user" type="AntDesign" />
                                        <Text>User</Text>
                                    </Button>
                                    <Button badge vertical onPress={() => {
                                        this.props.navigation.navigate('IssuesIndex', {
                                            userData: this.state.userData,
                                            projectDetails: this.state.projectDetails,
                                            issueCount: this.state.issueCount
                                        })
                                    }} >
                                        <Badge ><Text>{this.state.issueCount}</Text></Badge>
                                        <Icon name="issue-opened" type="Octicons" />
                                        <Text>Issues</Text>
                                    </Button>
                                    {this.state.userData ? this.state.userData.adminaccess ?
                                        <Button vertical onPress={() => {
                                            this.props.navigation.navigate('AddProject')
                                        }}>
                                            <Icon name="plus" type="AntDesign" />
                                            <Text>Add Project</Text>
                                        </Button> : null : null
                                    }
                                </FooterTab>
                            </Footer>
                        </ImageBackground>
                    </Container>
                </Root>
            </Drawer>
        )
    }
}
const mapDispatchToProps = dispatch =>{
  return{
      adduser: function(user){dispatch(AddUser(user))},
      setuser: function(user){dispatch(SetUser(user))}
  }
}
const mapStateToProps = state =>{
    return {user:state.userReducer.user}
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
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)
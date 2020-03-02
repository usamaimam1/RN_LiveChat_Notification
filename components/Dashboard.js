import React from 'react'
import {
    Text, View, StyleSheet, Image, ToastAndroid, Picker, Dimensions, SafeAreaView, FlatList, ImageBackground, Alert, BackHandler, AsyncStorage
} from 'react-native'
import firebase from 'react-native-firebase'
import NetInfo from '@react-native-community/netinfo'
import {
    Root, Content, Header, Card, CardItem, Right, Icon, Fab, Container, Footer, FooterTab, Badge, Button, Left, Body,
    Title, Subtitle, List, ListItem, Thumbnail, StyleProvider, Toast, Drawer, Switch, Spinner
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
import { filterRelevantProjects, enableAddandRemoveListeners, disableAddandRemoveListeners, preFetchFunc, handleSignOut, handleChangePassword, formatDate, handleBackPress, closeDrawer, openDrawer, handleDeleteProject } from './Dashboard.functions'
import SideBar from './SideBar'
import { connect } from 'react-redux'
import { SetProject, SetUser, AddUser, AddProjects, PrintUser, PrintProjects, AddProject, DeleteProject, SetActiveProjectId, AddIssues, SetIssuesCount, SetRelevantProjectIds, AddRelevantProject, SetUsers, ResetUser, ResetProjects, ResetIssues, ResetUsers, ResetSearchString, SetNetworkState } from '../redux/actions/index'
import WarningScreen from './WarningScreen'
const options = {
    title: 'Select Image',
    storageOptions: { skipBackup: true, path: 'images' }
};


class Dashboard extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.User = firebase.auth().currentUser._user
        this.state = {
            status: null,
            imgSource: null,
            iconSource: require('../assets/ReactNativeFirebase.png'),
            active: null,
            refresh: null,
            userAdded: false,
            projectAdded: false,
            issuesAdded: false,
            usersAdded: false
        }
        this.enableAddandRemoveListeners = enableAddandRemoveListeners.bind(this)
        this.disableAddandRemoveListeners = disableAddandRemoveListeners.bind(this)
        this.preFetchFunc = preFetchFunc.bind(this)
        this.filterRelevantProjects = filterRelevantProjects.bind(this)
        this.handleSignOut = handleSignOut.bind(this)
        this.handleChangePassword = handleChangePassword.bind(this)
        this.formatDate = formatDate.bind(this)
        this.handleBackPress = handleBackPress.bind(this)
        this.closeDrawer = closeDrawer.bind(this)
        this.openDrawer = openDrawer.bind(this)
        this.handleDeleteProject = handleDeleteProject.bind(this)
        // this.setupNotificationsListeners = this.setupNotificationsListeners.bind(this)
        this.setAndResetDeviceIds = this.setAndResetDeviceIds.bind(this)
        this.handleFailMessage = this.handleFailMessage.bind(this)
    }
    handleFailMessage() {
        const allLoading = this.state.userAdded && this.state.projectAdded && this.state.issuesAdded && this.state.usersAdded
        // if (this.state.userAdded && this.state.usersAdded) {
        //     const notification = new firebase.notifications.Notification().setNotificationId(1).setTitle('Users Loaded').setBody('Success !!')
        //     firebase.notifications().displayNotification(notification)

        // }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {!this.state.userAdded && !this.state.usersAdded ?
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'center' }}> Loading User ...</Text>
                        <Spinner style={{ flex: 1, alignSelf: 'flex-start' }} color="red" />
                    </View>
                    : null}
                {!this.state.projectAdded ?
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'center' }}> Loading Projects ...</Text>
                        <Spinner style={{ flex: 1, alignSelf: 'flex-start' }} color="blue" />
                    </View>
                    : null}
                {!this.state.issuesAdded ?
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'center' }}> Loading Issues ...</Text>
                        <Spinner style={{ flex: 1, alignSelf: 'flex-start' }} color="green" />
                    </View>
                    : null}
            </View>
        )
    }
    async setAndResetDeviceIds() {
        try {
            const snapshot = await firebase.database().ref("DeviceIds").child(firebase.auth().currentUser.uid).once('value')
            let fcmToken = await AsyncStorage.getItem('fcmToken');
            if (snapshot._value && fcmToken) {
                if (snapshot._value.includes(fcmToken)) {
                    console.log('Token Already Included')
                } else {
                    let _vals = [...snapshot._value, fcmToken]
                    firebase.database().ref("DeviceIds").child(firebase.auth().currentUser.uid).set(_vals)
                }
            } else {
                firebase.database().ref("DeviceIds").child(firebase.auth().currentUser.uid).set([fcmToken])
            }
        } catch (err) {
            console.log(err)
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        this.preFetchFunc()
        this.setAndResetDeviceIds()
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        this.disableAddandRemoveListeners()
        // this.notificationListener()
    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        // console.log(this.props)
        // console.log(this.User)
        return (
            !this.props.netState.isConnected || !this.props.netState.isInternetReachable ?
                <WarningScreen isConnected={this.props.netState.isConnected} isInternetReachable={this.props.netState.isInternetReachable} /> :
                <Drawer
                    ref={ref => { this._drawer = ref }}
                    content={<SideBar
                        imgSrc={this.state.iconSource}
                        _userData={this.props.user}
                        _navigation={this.props.navigation}
                        _onLogOut={this.handleSignOut}
                        _onChangePassword={this.handleChangePassword}
                        _onClose={this.closeDrawer} />}
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
                                    {this.state.userAdded && this.state.projectAdded && this.state.issuesAdded && this.state.usersAdded ?
                                        <List>
                                            {this.props.projects.length === 0 ?
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: 'grey' }}>No Projects To Display</Text>
                                                </View> :
                                                this.props.projects.map(proj => {
                                                    return (
                                                        <ListItem key={proj.projectId} thumbnail onPress={() => {
                                                            this.props.setActiveProjectId(proj.projectId)
                                                            this.props.navigation.navigate('ProjectScreen', { projectId: proj.projectId })
                                                        }}>
                                                            <Left>
                                                                <Thumbnail square source={{ uri: proj.projectThumbnail }} />
                                                            </Left>
                                                            <Body>
                                                                <Text>{proj.projectTitle}</Text>
                                                                <Text note numberOfLines={1} style={{ color: 'grey' }}>Date Added {this.formatDate(new Date(proj.dateAdded))}</Text>
                                                            </Body>
                                                            <Right>
                                                                {this.props.user ? this.props.user.adminaccess ?
                                                                    <Button transparent onPress={() => {
                                                                        Alert.alert('Warning', 'Are you sure to want to delete this project?',
                                                                            [
                                                                                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
                                                                                { text: 'OK', onPress: () => { this.handleDeleteProject(proj) } },
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
                                        </List> : this.handleFailMessage()}
                                </Content>
                                <Footer>
                                    <FooterTab>
                                        <Button active badge vertical>
                                            <Badge><Text>{this.props.projects.length}</Text></Badge>
                                            <Icon name="project" type="Octicons" />
                                            <Text>Projects</Text>
                                        </Button>
                                        <Button vertical onPress={() => {
                                            this.props.navigation.navigate('UserProfile')
                                        }}>
                                            <Icon name="user" type="AntDesign" />
                                            <Text>User</Text>
                                        </Button>
                                        <Button badge vertical onPress={() => { this.props.navigation.navigate('IssuesIndex') }} >
                                            <Badge ><Text>{this.props.issueCount}</Text></Badge>
                                            <Icon name="issue-opened" type="Octicons" />
                                            <Text>Issues</Text>
                                        </Button>
                                        {this.props.user ? this.props.user.adminaccess ?
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
                </Drawer >
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        adduser: function (user) { dispatch(AddUser(user)) },
        setuser: function (user) { dispatch(SetUser(user)) },
        printuser: function () { dispatch(PrintUser()) },
        addprojects: function (projects) { dispatch(AddProjects(projects)) },
        printprojects: function () { dispatch(PrintProjects()) },
        addproject: function (project) { dispatch(AddProject(project)) },
        setproject: function (projectId, project) { dispatch(SetProject(projectId, project)) },
        deleteproject: function (projectId) { dispatch(DeleteProject(projectId)) },
        setActiveProjectId: function (projectId) { dispatch(SetActiveProjectId(projectId)) },
        addIssues: function (issues) { dispatch(AddIssues(issues)) },
        setIssuesCount: function (issuesCount) { dispatch(SetIssuesCount(issuesCount)) },
        setRelevantProjectIds: function (relevantProjectIds) { dispatch(SetRelevantProjectIds(relevantProjectIds)) },
        addRelevantProject: function (projectId) { dispatch(AddRelevantProject(projectId)) },
        addUsers: function (users) { dispatch(SetUsers(users)) },
        resetUser: function () { dispatch(ResetUser()) },
        resetProjects: function () { dispatch(ResetProjects()) },
        resetIssues: function () { dispatch(ResetIssues()) },
        resetUsers: function () { dispatch(ResetUsers()) },
        resetSearchString: function () { dispatch(ResetSearchString()) },
        setNetworkState: function (netstate) { dispatch(SetNetworkState(netstate)) }
    }
}
const mapStateToProps = state => {
    // console.log(state)
    return {
        user: state.userReducer.user,
        projects: state.projectReducer.projectDetails,
        issueCount: state.issuesReducer.issuesCount,
        activeProjectId: state.projectReducer.activeProjectId,
        netState: state.networkReducer.netState
    }
}
// const styles = StyleSheet.create({
//     item: {
//         flex: 1,
//         margin: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderBottomWidth: 1
//     },
//     body: {
//         flex: 2
//     },
//     poet: {
//         flex: 1
//     }
// })
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
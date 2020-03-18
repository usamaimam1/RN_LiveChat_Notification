import React from 'react'
import {
    Text, View, StyleSheet, Image, ToastAndroid, Picker, TouchableOpacity, Dimensions, SafeAreaView, FlatList, ImageBackground, Alert, BackHandler,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'react-native-firebase'
import NetInfo from '@react-native-community/netinfo'
import {
    Root, Content, Header, Card, CardItem, Right, Icon, Fab, Container, Footer, FooterTab, Badge, Button, Left, Body,
    Title, Subtitle, List, ListItem, Thumbnail, StyleProvider, Toast, Drawer, Switch, Spinner
} from 'native-base'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
// import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentage as wv, heightPercentage as hv } from '../util/stylerHelpers'
import * as SvgIcons from '../assets/SVGIcons/index'
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
import { RFValue } from 'react-native-responsive-fontsize'
import CustomIcons from '../util/CustomIcons'
import Svg from 'react-native-svg'
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
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        this.preFetchFunc()
        this.setAndResetDeviceIds()
    }
    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        this.disableAddandRemoveListeners()
        // this.notificationListener()
    }
    render() {
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
                        <SafeAreaView style={{ flex: 1 }}>
                            <Container>
                                <View style={styles.Header}>
                                    <View style={styles.InnerHeaderView}>
                                        <SvgIcons.Menu width={hv(24)} height={hv(24)} onPress={() => { this.openDrawer() }}></SvgIcons.Menu>
                                        <Text style={styles.WelcomeText}>{`Welcome ${this.props.user ? this.props.user.adminaccess ? 'Admin' : 'Employee' : null}`}</Text>
                                    </View>
                                </View>
                                <Content style={{ marginTop: hv(26), marginHorizontal: wv(15) }}>
                                    {this.state.userAdded && this.state.projectAdded && this.state.issuesAdded && this.state.usersAdded ?
                                        <List>
                                            {this.props.projects.length === 0 ?
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: 'grey' }}>No Projects To Display</Text>
                                                </View> :
                                                <List>
                                                    {this.props.projects.map(item => {
                                                        return (
                                                            <View key={item.projectId} style={{ height: hv(55 + 17.5), width: wv(345.5), borderWidth: 0, marginTop: hv(13.5) }}>
                                                                <View style={{ height: hv(55), width: wv(345.5), flexDirection: 'row' }}>
                                                                    <TouchableOpacity style={{ height: hv(55), width: wv(55 + 95 + 159), flexDirection: 'row' }} onPress={() => {
                                                                        this.props.setActiveProjectId(item.projectId)
                                                                        this.props.navigation.navigate('ProjectScreen', { projectId: item.projectId })
                                                                    }}>
                                                                        <View style={{ height: hv(55), width: wv(55) }}>
                                                                            <Image source={{ uri: item.projectThumbnail }} style={{ height: RFValue(50), width: RFValue(50), borderRadius: RFValue(50 / 2) }}></Image>
                                                                        </View>
                                                                        <View style={{ marginLeft: wv(11), marginVertical: hv(5), height: hv(40), width: wv(159 + 90), borderWidth: 0 }}>
                                                                            <Text style={{ fontSize: RFValue(14), fontWeight: '500' }}>{item.projectTitle}</Text>
                                                                            <Text note numberOfLines={1} style={{ fontSize: RFValue(12), color: '#758692', marginTop: hv(5) }}>Date Added {this.formatDate(new Date(item.dateAdded))}</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    <View>
                                                                        {this.props.user ? this.props.user.adminaccess ?
                                                                            <SvgIcons.Remove width={RFValue(25)} height={RFValue(25)} style={{ marginVertical: hv(10) }} onPress={() => {
                                                                                Alert.alert('Warning', 'Are you sure to want to delete this project?',
                                                                                    [
                                                                                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
                                                                                        { text: 'OK', onPress: () => { this.handleDeleteProject(item) } },
                                                                                    ],
                                                                                    { cancelable: true },
                                                                                );
                                                                            }}></SvgIcons.Remove> : null : null}
                                                                    </View>
                                                                </View>
                                                                <View style={{ marginTop: hv(12.5), borderBottomWidth: 1, borderBottomColor: '#D8D8D8' }}></View>
                                                            </View>)
                                                    }
                                                    )}
                                                </List>
                                            }
                                        </List> : this.handleFailMessage()}
                                </Content>
                                {this.props.user ? this.props.user.adminaccess ?
                                    <View style={styles.Footer}>
                                        <View style={styles.ProjectsIcon}>
                                            <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                                <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projects.length}</Text>
                                            </View>
                                            <SvgIcons.ProjectsActive style={{ alignSelf: 'center', borderWidth: 0 }} width={wv(30)} height={hv(30)} color="#34304C"></SvgIcons.ProjectsActive>
                                            <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0 }}>Projects</Text>
                                        </View>
                                        <View style={{ width: wv(38), height: hv(42), marginTop: hv(25) + RFValue(16), marginLeft: wv(33), borderWidth: 0 }}>
                                            <SvgIcons.Users width={wv(19.5)} height={hv(22)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('UserProfile') }} ></SvgIcons.Users>
                                            <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: '#77869E' }}>Profile</Text>
                                        </View>
                                        <View style={{ width: wv(52), height: wv(52), borderWidth: 0, marginLeft: wv(13.5) }}>
                                            <SvgIcons.AddProject width={wv(52)} height={wv(52)} color="white" style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddProject') }}></SvgIcons.AddProject>
                                        </View>
                                        <View style={{ width: wv(52), height: hv(44), marginLeft: wv(13.5), marginTop: hv(23) + RFValue(16), borderWidth: 0 }}>
                                            <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }}></SvgIcons.AddUserFooter>
                                            <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: '#77869E' }}>Add User</Text>
                                        </View>
                                        <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                                            <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                                <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issueCount}</Text>
                                            </View>
                                            <SvgIcons.IssueFooter width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('IssuesIndex') }}></SvgIcons.IssueFooter>
                                            <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0 }}>Issues</Text>
                                        </View>
                                    </View> :
                                    <Footer style={{ backgroundColor: 'white' }}>
                                        <FooterTab style={{ backgroundColor: 'white' }}>
                                            <Button badge vertical>
                                                <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                                    <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projects.length}</Text>
                                                </Badge>
                                                <SvgIcons.ProjectsActive width={RFValue(26)} height={RFValue(26)} color="#34304C"></SvgIcons.ProjectsActive>
                                                <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0 }}>Projects</Text>
                                            </Button>
                                            <Button vertical badge onPress={() => { this.props.navigation.navigate('UserProfile') }}>
                                                <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}><Text style={{ color: 'rgba(255, 255, 255, 0.1)' }}>{this.props.projects.length}</Text></Badge>
                                                <SvgIcons.Users width={RFValue(26)} height={RFValue(26)} ></SvgIcons.Users>
                                                <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: '#77869E' }}>Profile</Text>
                                            </Button>
                                            <Button badge vertical onPress={() => { this.props.navigation.navigate('IssuesIndex') }} >
                                                <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                                    <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issueCount}</Text></Badge>
                                                <SvgIcons.IssueFooter width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooter>
                                                <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: '#77869E' }}>Issues</Text>
                                            </Button>
                                        </FooterTab>
                                    </Footer> : null
                                }
                            </Container>
                        </SafeAreaView>
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

const styles = StyleSheet.create({
    Header: { height: hv(68) },
    InnerHeaderView: { borderWidth: 0, flexDirection: 'row', height: hv(24), marginTop: hv(58 - 32), marginLeft: wv(13), marginBottom: hv(18) },
    WelcomeText: { marginLeft: wv(10), fontWeight: '500', textAlign: 'center', marginBottom: hv(2), fontSize: RFValue(15), fontWeight: "400" },
    Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row' },
    ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },
})
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
import React from 'react'
import {
    Text, View, StyleSheet, Image, ToastAndroid, Picker, Dimensions, SafeAreaView, FlatList, ImageBackground, Alert, BackHandler
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
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SetUser, AddUser, AddProjects, PrintUser, PrintProjects, AddProject, DeleteProject } from '../redux/actions/index'
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
        this.handleDeleteProject = this.handleDeleteProject.bind(this)
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        this.preFetchFunc()
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        this.disableAddandRemoveListeners()
    }
    filterRelevantProjects(project) {
        const isProjectManager = project.projectmanager[this.User.uid] ? true : false
        const isTeamLead = project.teamleads ? project.teamleads[this.User.uid] ? true : false : false
        const isTeamMember = project.teammembers ? project.teammembers[this.User.uid] ? true : false : false
        return isProjectManager || isTeamLead || isTeamMember
    }
    preFetchFunc() {
        const projRef = firebase.database().ref('Projects')
        projRef.once('value').then(data => {
            if (data._value) {
                const ProjectVals = Object.keys(data._value).map(_key => data._value[_key]).filter(this.filterRelevantProjects)
                this.props.addprojects(ProjectVals)
                const issueCount = ProjectVals.map(project => project.issues ? Object.keys(project.issues).length : 0).reduce((res, curr) => res + curr)
                this.setState({ issueCount: issueCount })
            }
            this.enableAddandRemoveListeners()
        })
    }
    enableAddandRemoveListeners() {
        this._userRef = firebase.database().ref("users").child(this.User.uid)
        this.userfuncref = this._userRef.on('value', data => {
            if (data.val()) {
                this.props.adduser(data._value)
                this.setState({
                    status: data._value.adminaccess ? 'Admin' : 'Employee',
                    iconSource: { uri: data._value.profilepic, cache: 'force-cache' }
                })
            }
        })
        this._projectchildaddedref = firebase.database().ref('Projects')
        this._projectchildaddedref.on('child_added', data => {
            if (data.val()) {
                const isIncluded = this.props.projects.filter(project => project.projectId === data.val().projectId)
                const isRelevant = isIncluded.length === 0 ? this.filterRelevantProjects(data._value) : false
                if (isRelevant) {
                    this.props.addproject(data._value)
                }
            }
        })
        this.projectchildremoveref = firebase.database().ref('Projects')
        this.projectchildremoveref.on('child_removed', data => {
            if (data.val()) {
                this.props.deleteproject(data._value.projectId)
            }
        })
    }
    disableAddandRemoveListeners() {
        this._userRef.off('value')
        this._projectchildaddedref.off('child_added')
        this.projectchildremoveref.off('child_removed')
    }
    handleBackPress() {
        Toast.show({ text: 'Button Pressed', buttonText: 'Okay' })
        return true
    }
    formatDate(date) {
        var monthNames = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY",
            "AUG", "SEP", "OCT", "NOV", "DEC"
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
    handleDeleteProject(proj) {
        const ref = firebase.database().ref('Projects').child(proj.projectId)
        const projectThumbnail = proj.projectId
        firebase.storage().ref('projectThumbnails/' + projectThumbnail).delete().then(() => { })
            .catch(err => { console.log(err.message) })
        ref.remove().then(() => {
            this.setState({ refresh: null })
        })
        firebase.database().ref('Issues').orderByChild('projectId').equalTo(proj.projectId).once('value', data => {
            data._childKeys.forEach(i => { firebase.database().ref('Issues').child(i).remove() })
        })
        firebase.database().ref('Messages').child(proj.projectId).remove()
    }
    render() {
        const { navigate } = this.props.navigation
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        // console.log(this.props)
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
                                    {this.props.projects.map(proj => {
                                        return (
                                            <ListItem key={proj.projectId} thumbnail onPress={() => {
                                                this.props.navigation.navigate('ProjectScreen', {
                                                    projectId: proj.projectId,
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
                                </List>
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
                                        <Badge ><Text>{this.state.issueCount}</Text></Badge>
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
        deleteproject: function (projectId) { dispatch(DeleteProject(projectId)) }
    }
}
const mapStateToProps = state => {
    console.log(state)
    return {
        user: state.userReducer.user,
        projects: state.projectReducer.projectDetails
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
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
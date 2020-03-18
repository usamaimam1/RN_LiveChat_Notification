import React from 'react'
import {
    Container, Content, Header, Button, Picker, Toast, ListItem,
    Footer, Icon, Body, Left, Right, Title, SubTitle, Badge, FooterTab, TabHeading
} from 'native-base'
import { SafeAreaView, ImageBackground, Dimensions, Text, Alert, StyleSheet, View, TouchableOpacity } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import * as SvgIcons from '../../assets/SVGIcons/index'
import OptionsMenu from 'react-native-options-menu'
import firebase from 'react-native-firebase'
import { connect } from 'react-redux'
import { SetProject, SetIssuesCount, SetActiveIssue, SetActiveProjectId } from '../../redux/actions'
class ProjectScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.activeColor = "#34304C"
        this.inActiveColor = "#77869E"
        this.state = {
            projectId: this.props.navigation.state.params.projectId,
            viewType: 'Employee',
            projectDetails: this.props.navigation.state.params.projectDetails,
            userData: this.props.navigation.state.params.userData,
            issues: null
        }
        this.handleDelete = this.handleDelete.bind(this)
        this.enableListeners = this.enableListeners.bind(this)
        this.disableListeners = this.disableListeners.bind(this)
        this.setViewType = this.setViewType.bind(this)
        this.deleteProject = this.deleteProject.bind(this)
        this.handleNavigation = this.handleNavigation.bind(this)
    }
    componentDidMount() {
        this.enableListeners()
    }
    componentWillUnmount() {
        this.disableListeners()
    }
    handleNavigation(projectId, issueId) {
        this.props.setActiveIssueId(issueId)
        this.props.navigation.navigate('IssueScreen', { projectId: projectId, issueId: issueId })
    }
    enableListeners() {
        this._projectReference = firebase.database().ref('Projects').child(this.state.projectId)
        this._projectReference.on('value', data => {
            if (!data._value) {
                this.setState({ project: [] })
                this.props.navigation.navigate('Dashboard')
                return
            }
            this.setViewType(data._value)
        })
    }
    disableListeners() {
        this._projectReference.off('value')
    }
    setViewType(project) {
        const userUid = firebase.auth().currentUser.uid
        const isProjectManager = project.projectmanager ? project.projectmanager[userUid] : false
        const isTeamLead = project.teamleads ? project.teamleads[userUid] : false
        const isTeamMember = project.teammembers ? project.teammembers[userUid] : false
        if (isProjectManager) this.setState({ viewType: 'ProjectManager' })
        else if (isTeamLead) this.setState({ viewType: 'TeamLead' })
        if (this.props.project !== project) {
            // this.props.setproject(project.projectId, project)
            // this.props.setActiveProjectId(project.projectId)
            // const oldIssuesNumber = this.props.project.issues ? Object.keys(this.props.project.issues).length : 0
            // const newIssuesNumber = project.issues ? Object.keys(project.issues).length : 0
            // this.props.setIssuesCount(this.props.issuesCount + (newIssuesNumber - oldIssuesNumber))
        }
    }
    handleDelete(issueId) {
        Alert.alert('Warning', 'Are you sure to want to delete this Issue?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
                {
                    text: 'OK', onPress: () => {
                        console.log(issueId)
                        firebase.database().ref('Projects').child(this.state.projectId).child('issues').child(issueId).remove()
                        firebase.database().ref('Issues').child(issueId).remove()
                        firebase.database().ref('Messages').child(this.state.projectId).child(issueId).remove()
                        Toast.show({ text: 'Issue has been deleted Successfully', buttonText: 'Ok', })
                    }
                },
            ],
            { cancelable: false },
        );
    }
    deleteProject() {
        try {
            Alert.alert('Warning', 'Are you sure to want to delete this Project?',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
                    {
                        text: 'OK', onPress: () => {
                            // Delete Project Data and Image Thumbnail from Storage
                            firebase.database().ref('Projects').child(this.state.projectId).remove(() => {
                                firebase.storage().ref('projectThumbnails/' + this.state.projectId).delete().then(() => {

                                }).catch(err => {
                                    Toast.show({ text: err.message, buttonText: 'Ok' })
                                })
                            })
                            // Deletes Issues bind to that Project
                            firebase.database().ref('Issues').orderByChild('projectId').equalTo(this.state.projectId).once('value', data => {
                                data._childKeys.forEach(i => {
                                    firebase.database().ref('Issues').child(i).remove()
                                })
                            })
                            // Deletes Messages Bound to the Project
                            firebase.database().ref('Messages').child(this.state.projectId).remove()
                            Toast.show({ text: 'Project has been deleted Successfully', buttonText: 'Ok', })
                            this.props.navigation.pop()
                        }
                    },
                ],
                { cancelable: false },
            );
        } catch (err) {
            Toast.show({ text: err.message, buttonText: "Ok" })
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.Container}>
                <View style={styles.Header}>
                    <View style={styles.HeaderInnerView} >
                        <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                        <Text style={styles.HeaderTitle}>{this.props.project ? this.props.project.projectTitle : ""}</Text>
                        <SvgIcons.Team width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('ViewUsers', { projectId: this.state.projectId }) }}></SvgIcons.Team>
                        {this.state.viewType === "ProjectManager" ?
                            <View style={{ flexDirection: 'row' }}>
                                <SvgIcons.UserPlus width={wv(26)} height={hv(26)} style={{ marginLeft: wv(9), alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddUser', { projectId: this.state.projectId }) }}></SvgIcons.UserPlus>
                                <SvgIcons.Remove width={wv(26)} height={hv(26)} style={{ marginLeft: wv(9), alignSelf: 'center' }} onPress={() => { this.deleteProject() }} ></SvgIcons.Remove>
                            </View>
                            : null
                        }
                    </View>
                </View>
                <View style={styles.IssuesView}>
                    {this.props.issues.length === 0 ?
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: RFValue(14), fontWeight: "400", color: "grey" }}>No Issues To Display</Text>
                        </View> :
                        this.props.issues.map((_issue, index) => {
                            return index === 0 ?
                                <TouchableOpacity key={_issue.issueId} style={styles.IssueList} onPress={() => { this.handleNavigation(_issue.projectId, _issue.issueId) }}>
                                    <View style={styles.IssueIconView}>
                                        <SvgIcons.Issue width={wv(26)} height={hv(26)} style={styles.IssueIcon}></SvgIcons.Issue>
                                    </View>
                                    <View style={styles.IssueInfo}>
                                        <Text style={styles.IssueName}>{_issue.issueTitle}</Text>
                                        <Text style={styles.ProjectName}>{this.props.project ? this.props.project.projectTitle : ""}</Text>
                                    </View>
                                    {this.state.viewType === "ProjectManager" ?
                                        <SvgIcons.Remove width={wv(25)} height={hv(25)} style={{ alignSelf: 'center' }} onPress={() => { this.handleDelete(_issue.issueId) }}></SvgIcons.Remove>
                                        : null
                                    }
                                </TouchableOpacity> :
                                <TouchableOpacity key={_issue.issueId} style={[styles.IssueList, { marginTop: hv(12.5) }]} onPress={() => { this.handleNavigation(_issue.projectId, _issue.issueId) }}>
                                    <View style={styles.IssueIconView}>
                                        <SvgIcons.Issue width={wv(26)} height={hv(26)} style={styles.IssueIcon}></SvgIcons.Issue>
                                    </View>
                                    <View style={styles.IssueInfo}>
                                        <Text style={styles.IssueName}>{_issue.issueTitle}</Text>
                                        <Text style={styles.ProjectName}>{this.props.project ? this.props.project.projectTitle : ""}</Text>
                                    </View>
                                    {this.state.viewType === "ProjectManager" ?
                                        <SvgIcons.Remove width={wv(25)} height={hv(25)} style={{ alignSelf: 'center' }} onPress={() => { this.handleDelete(_issue.issueId) }}></SvgIcons.Remove>
                                        : null
                                    }
                                </TouchableOpacity>
                        })}
                </View>
                {
                    this.state.viewType !== "Employee" ?
                        <View style={styles.Footer}>
                            <View style={styles.ProjectsIcon} onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsCount}</Text>
                                </View>
                                <SvgIcons.Projects style={{ alignSelf: 'center', borderWidth: 0 }} width={wv(30)} height={hv(30)} color={this.inActiveColor} onPress={() => { this.props.navigation.navigate('Dashboard') }}></SvgIcons.Projects>
                                <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Projects</Text>
                            </View>
                            <View style={{ width: wv(38), height: hv(42), marginTop: hv(25) + RFValue(16), marginLeft: wv(33), borderWidth: 0 }}>
                                <SvgIcons.Users width={wv(19.5)} height={hv(22)} color={this.activeColor} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('UserProfile') }} ></SvgIcons.Users>
                                <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Profile</Text>
                            </View>
                            <View style={{ width: wv(52), height: wv(52), borderWidth: 0, marginLeft: wv(13.5) }}>
                                <SvgIcons.AddProject width={wv(52)} height={wv(52)} color="white" style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddIssue', { projectId: this.state.projectId }) }}></SvgIcons.AddProject>
                            </View>
                            <View style={{ width: wv(52), height: hv(44), marginLeft: wv(13.5), marginTop: hv(23) + RFValue(16), borderWidth: 0 }}>
                                <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }} onPress={() => { this.state.viewType === "ProjectManager" && this.props.navigation.navigate('AddUser', { projectId: this.state.projectId }) }}></SvgIcons.AddUserFooter>
                                <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Add User</Text>
                            </View>
                            <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                                <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text>
                                </View>
                                <SvgIcons.IssueFooterActive width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { }}></SvgIcons.IssueFooterActive>
                                <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.activeColor }}>Issues</Text>
                            </View>
                        </View> :
                        <Footer transparent style={{ backgroundColor: 'white', marginTop: hv(10) }}>
                            <FooterTab style={{ backgroundColor: 'white' }}>
                                <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                    <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                        <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsCount}</Text>
                                    </Badge>
                                    <SvgIcons.Projects width={RFValue(26)} height={RFValue(26)} color="#34304C"></SvgIcons.Projects>
                                    <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', color: this.inActiveColor }}>Projects</Text>
                                </Button>
                                <Button vertical badge onPress={() => { this.props.navigation.navigate('UserProfile') }}>
                                    <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}><Text style={{ color: 'rgba(255, 255, 255, 0.1)' }}>{this.props.projectsLength}</Text></Badge>
                                    <SvgIcons.Users width={RFValue(26)} height={RFValue(26)} ></SvgIcons.Users>
                                    <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Profile</Text>
                                </Button>
                                <Button badge vertical title="" onPress={() => { }} >
                                    <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                        <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text></Badge>
                                    <SvgIcons.IssueFooterActive width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooterActive>
                                    <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.activeColor }}>Issues</Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                }
            </SafeAreaView >
        )
    }
}
const mapStateToProps = state => {
    const { activeProjectData } = state.projectReducer
    return {
        user: state.userReducer.user,
        project: activeProjectData.length === 1 ? activeProjectData[0] : null,
        projectsCount: state.projectReducer.projectDetails.length,
        issuesCount: state.issuesReducer.issuesCount,
        issues: state.issuesReducer.issueDetails.filter(_issue => _issue.projectId === state.projectReducer.activeProjectId)
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setproject: function (projectId, project) { dispatch(SetProject(projectId, project)) },
        setIssuesCount: function (issuesCount) { dispatch(SetIssuesCount(issuesCount)) },
        setActiveIssueId: function (activeIssueId) { dispatch(SetActiveIssue(activeIssueId)) },
        setActiveProjectId: function (activeProjectId) { dispatch(SetActiveProjectId(activeProjectId)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectScreen)

const styles = StyleSheet.create({
    Container: {
        flex: 1, shadowColor: "#000", shadowOpacity: 0.16
    },
    Header: {
        height: hp(8.3), borderBottomColor: 'grey', borderBottomWidth: 0
    },
    HeaderInnerView: {
        height: hp(2.9), marginVertical: hp(3.2), marginHorizontal: wp(3.0), flexDirection: 'row'
    },
    HeaderTitle: {
        marginLeft: wp(4.533), fontSize: RFValue(12), color: '#34304C', fontWeight: "bold", flex: 1
    },
    IssuesView: { flex: 1, marginTop: hv(36), marginHorizontal: wv(15), borderWidth: 0 },
    IssueList: { width: wv(345.5), height: hv(45), flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#D4DCE1' },
    IssueIconView: { justifyContent: 'center', alignItems: 'center' },
    IssueIcon: { alignSelf: 'center', marginBottom: hv(5) },
    IssueInfo: { height: hv(34), marginBottom: hv(12.5), marginLeft: wv(10), borderWidth: 0, flex: 1 },
    IssueName: { fontSize: RFValue(13), fontWeight: "400" },
    ProjectName: { fontSize: RFValue(12), color: '#758692', marginTop: hv(3) },
    Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row' },
    ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },
})
import React from 'react'
import {
    Container, Content, Header, Button, Picker, Toast, ListItem,
    Footer, Icon, Body, Left, Right, Title, SubTitle, Badge, FooterTab
} from 'native-base'
import { SafeAreaView, ImageBackground, Dimensions, Text, Alert } from 'react-native'
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
    }
    componentDidMount() {
        this.enableListeners()
    }
    componentWillUnmount() {
        this.disableListeners()
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
    handleDelete() {
        if (this.state.viewType !== 'ProjectManager') {
            Alert.alert('Warning', "You're not authorised for this operation")
        } else {
            Alert.alert('Notice!',
                'Are you sure to want to delete this project?',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => { this.deleteProject() } },
                ],
                { cancelable: true }
            )
        }
    }
    deleteProject() {
        // Delete Project Data and Image Thumbnail from Storage
        firebase.database().ref('Projects').child(this.state.projectId).remove(() => {
            firebase.storage().ref('projectThumbnails/' + this.state.projectId).delete().then(() => {

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
    }

    render() {
        // console.log(this.state.issues)
        const icon = <Icon name="menu" style={{ color: 'blue' }} />
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Container>
                <ImageBackground source={require('../../assets/splash-bg.jpg')}
                    style={{ width: width, height: height }}>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.navigate('Dashboard')
                            }}>
                                <Icon name="arrow-back" style={{ color: 'blue' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: 'black', textAlign: 'center' }}>{this.props.project ? this.props.project.projectTitle : 'Project'}</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                {Platform.OS == "ios" ?
                                    <OptionsMenu
                                        customButton={icon}
                                        destructiveIndex={1}
                                        options={["View Team", "Delete Project", "Cancel"]}
                                        actions={[() => { this.props.navigation.navigate('ViewUsers', { projectId: this.state.projectId }) }, () => { this.handleDelete() }, () => { }]} />
                                    : <OptionsMenu
                                        customButton={icon}
                                        destructiveIndex={1}
                                        options={["View Team", "Delete Project"]}
                                        actions={[() => { this.props.navigation.navigate('ViewUsers', { projectId: this.state.projectId }) }, () => { this.handleDelete() }]} />
                                }
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        {
                            this.props.issues.length === 0 ?
                                <Text style={{ textAlign: 'center', alignSelf: 'center', color: 'grey' }}>No Issues To Display</Text> :
                                this.props.issues.map(_issue => {
                                    return (
                                        <ListItem key={_issue.issueId} icon onPress={() => {
                                            this.props.setActiveIssueId(_issue.issueId)
                                            this.props.navigation.navigate('IssueScreen', { projectId: this.state.projectId, IssueId: _issue.issueId })
                                        }}>
                                            <Left>
                                                <Button style={{ backgroundColor: _issue.issuePriority === 'Critical' ? 'red' : 'green' }}>
                                                    <Icon active name={_issue.issueStatus === "Opened" ? "issue-opened" : "issue-closed"} type='Octicons' />
                                                </Button>
                                            </Left>
                                            <Body>
                                                <Text>{_issue.issueTitle}</Text>
                                            </Body>
                                            <Right>
                                                <Icon active name="arrow-forward" style={{ color: 'blue' }} onPress={() => { this.props.navigation.navigate('IssueScreen', { projectId: this.state.projectId, IssueId: _issue.issueId }) }} />
                                            </Right>
                                        </ListItem>
                                    )
                                })
                        }
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button vertical onPress={() => {
                                this.props.navigation.navigate('UserProfile')
                            }}>
                                <Icon name="user" type="AntDesign" />
                                <Text>User</Text>
                            </Button>
                            <Button badge active vertical >
                                <Badge ><Text>{this.props.issuesCount}</Text></Badge>
                                <Icon name="issue-opened" type="Octicons" />
                                <Text>Issues</Text>
                            </Button>
                            {this.state.viewType === 'ProjectManager' ?
                                <Button onPress={() => { this.props.navigation.navigate('AddUser', { projectId: this.state.projectId }) }}>
                                    <Icon name="adduser" type="AntDesign" />
                                    <Text>Add User</Text>
                                </Button> : null}
                            {this.state.viewType === 'TeamLead' || this.state.viewType === 'ProjectManager' ? <Button onPress={() => { this.props.navigation.navigate('AddIssue', { projectId: this.state.projectId }) }}>
                                <Icon name="issue-opened" type="Octicons" />
                                <Text>Add Issues</Text>
                            </Button> : null}
                        </FooterTab>
                    </Footer>
                </ImageBackground>
            </Container>
        )
    }
}
const mapStateToProps = state => {
    const { activeProjectData } = state.projectReducer
    return {
        user: state.userReducer.user,
        project: activeProjectData.length === 1 ? activeProjectData[0] : null,
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
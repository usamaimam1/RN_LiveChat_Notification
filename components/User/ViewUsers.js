import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Badge, Icon,
    Left, Right, Body, Button, Title, Separator, ListItem, Subtitle, Thumbnail,
} from 'native-base'
import { Text, Image, Dimension, Platform, SafeAreaView, View, StyleSheet, ScrollView } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import * as SvgIcons from '../../assets/SVGIcons/index'
import firebase from 'react-native-firebase'
import OptionsMenu from 'react-native-options-menu'
import { makeTeamLead, removefromProject, Demote } from './ViewUsers.functions'
import { connect } from 'react-redux'
import { SetProject, SetActiveProjectId } from '../../redux/actions'
class ViewUsers extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.activeColor = "#34304C"
        this.inActiveColor = "#77869E"
        this.state = {
            ProjectData: null,
            refresh: null,
            projectId: this.props.navigation.state.params.projectId,
            viewType: 'Employee'
        }
        this.makeTeamLead = makeTeamLead.bind(this)
        this.removefromProject = removefromProject.bind(this)
        this.Demote = Demote.bind(this)
        this.handleUserDelete = this.handleUserDelete.bind(this)
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ProjectData !== nextProps.ProjectData) {
            const project = nextProps.ProjectData
            const userUid = firebase.auth().currentUser.uid
            const isProjectManager = project.projectmanager ? project.projectmanager[userUid] : false
            const isTeamLead = project.teamleads ? project.teamleads[userUid] : false
            const isTeamMember = project.teammembers ? project.teammembers[userUid] : false
            if (isProjectManager) return { ProjectData: nextProps.ProjectData, viewType: 'ProjectManager' }
            else if (isTeamLead) return { ProjectData: nextProps.ProjectData, viewType: 'TeamLead' }
            else return { ProjectData: nextProps.ProjectData, viewType: 'Employee' }
        }
        return null
    }
    componentDidMount() {

    }
    handleUserDelete(child, _Id) {
        firebase.database().ref('Projects').child(this.props.ProjectData.projectId).child(child).child(_Id).remove()
        return null
    }
    render() {
        console.log(this.props)
        return (
            // <Container>
            //     <Header transparent>
            //         <Left>
            //             <Button transparent onPress={() => { this.props.navigation.navigate('ProjectScreen', { projectId: this.props.navigation.state.params.projectId }) }}>
            //                 <Icon name='arrow-back' style={{ color: 'blue' }} />
            //             </Button>
            //         </Left>
            //         <Body>
            //             <Title style={{ color: 'black' }}>Users</Title>
            //         </Body>
            //         <Right>
            //         </Right>
            //     </Header>
            //     <Content>
            //         <Separator >
            //             <Text>Project Managers</Text>
            //         </Separator>
            //         {this.props.ProjectData ? Object.keys(this.props.ProjectData.projectmanager).map(manager => {
            //             return (
            //                 this.props.users[manager] ?
            //                     <ListItem thumbnail key={manager}>
            //                         <Left>
            //                             <Thumbnail source={{ uri: this.props.users[manager].profilepic }} style={{ width: 40, height: 40 }} />
            //                         </Left>
            //                         <Body style={{ alignItems: 'center', justifyContent: 'center' }}>
            //                             <Title style={{ color: 'black' }}>{this.props.users[manager].fullName}</Title>
            //                             <Subtitle style={{ color: 'grey' }}>Project Manager</Subtitle>
            //                         </Body>
            //                         <Right>
            //                             <Icon name='briefcase' type='Entypo' style={{ color: 'blue' }} />
            //                         </Right>
            //                     </ListItem> : this.handleUserDelete('projectmanager', manager)
            //             )
            //         }) : null}
            //         <Separator>
            //             <Text>Team Leads</Text>
            //         </Separator>
            //         {this.props.ProjectData ? this.props.ProjectData.teamleads ? Object.keys(this.props.ProjectData.teamleads).map(teamlead => {
            //             return (
            //                 this.props.users[teamlead] ?
            //                     < ListItem thumbnail key={teamlead} >
            //                         <Left>
            //                             <Thumbnail source={{ uri: this.props.users[teamlead].profilepic }} style={{ width: 40, height: 40 }} />
            //                         </Left>
            //                         <Body>
            //                             <Title style={{ color: 'black' }}>{this.props.users[teamlead].fullName}</Title>
            //                             <Subtitle style={{ color: 'grey' }}>Team Lead</Subtitle>
            //                         </Body>
            //                         <Right>
            //                             {
            //                                 this.props.ProjectData.projectmanager[firebase.auth().currentUser.uid] ?
            //                                     Platform.OS === 'ios' ?
            //                                         <OptionsMenu
            //                                             customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
            //                                             options={['Demote', 'Remove From Project', 'Cancel']}
            //                                             destructiveIndex={1}
            //                                             actions={[() => { this.Demote(teamlead) }, () => { this.removefromProject('teamleads', teamlead) }, () => { }]} >
            //                                         </OptionsMenu> :
            //                                         <OptionsMenu
            //                                             customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
            //                                             options={['Demote', 'Remove From Project']}
            //                                             actions={[() => { this.Demote(teamlead) }, () => { this.removefromProject('teamleads', teamlead) }]}>
            //                                         </OptionsMenu> : null
            //                             }
            //                         </Right>
            //                     </ListItem> : this.handleUserDelete('teamleads', teamlead)
            //             )
            //         }) : null : null}
            //         <Separator>
            //             <Text>Team Members</Text>
            //         </Separator>
            //         {this.props.ProjectData ?
            //             this.props.ProjectData.teammembers ? Object.keys(this.props.ProjectData.teammembers).map(teammember => {
            //                 return (
            //                     this.props.users[teammember] ?
            //                         < ListItem thumbnail key={teammember} >
            //                             <Left>
            //                                 <Thumbnail source={{ uri: this.props.users[teammember].profilepic }} style={{ width: 40, height: 40 }} />
            //                             </Left>
            //                             <Body>
            //                                 <Title style={{ color: 'black' }}>{this.props.users[teammember].fullName}</Title>
            //                                 <Subtitle style={{ color: 'grey' }}>Team Member</Subtitle>
            //                             </Body>
            //                             <Right>
            //                                 {
            //                                     this.props.ProjectData.projectmanager[firebase.auth().currentUser.uid] ?
            //                                         Platform.OS === 'ios' ?
            //                                             <OptionsMenu
            //                                                 customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
            //                                                 options={['Make Team Lead', 'Remove From Project', 'Cancel']}
            //                                                 destructiveIndex={1}
            //                                                 actions={[() => { this.makeTeamLead(teammember) }, () => { this.removefromProject('teammembers', teammember) }, () => { }]} >
            //                                             </OptionsMenu> :
            //                                             <OptionsMenu
            //                                                 customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
            //                                                 options={['Make Team Lead', 'Remove From Project']}
            //                                                 actions={[() => { this.makeTeamLead(teammember) }, () => { this.removefromProject('teammembers', teammember) }]}>
            //                                             </OptionsMenu> : null
            //                                 }
            //                             </Right>
            //                         </ListItem> : this.handleUserDelete('teammembers', teammember)
            //                     )
            //             }) : null : null}
            //     </Content>
            //     <Footer />
            // </Container >
            <SafeAreaView style={styles.Container}>
                <View style={styles.Header}>
                    <View style={styles.HeaderInnerView} >
                        <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                        <Text style={styles.HeaderTitle}>{`${this.props.ProjectData.projectTitle} Team`}</Text>
                    </View>
                </View>
                <ScrollView style={styles.ViewUsersView}>
                    <View style={styles.UserView}>
                        <View style={styles.HeadingView}>
                            <Text style={styles.Heading}>Project Manager</Text>
                        </View>
                        {this.props.ProjectManagers.map(pm => {
                            return (
                                <View key={pm.uid}>
                                    <View style={styles.InfoView}>
                                        <Image source={{ uri: pm.profilepic }} resizeMode="cover" style={styles.Avatar}></Image>
                                        <View style={styles.InfoDetailView}>
                                            <Text style={styles.Name}>{pm.fullName}</Text>
                                            <Text style={styles.Status}>Project Manager</Text>
                                        </View>
                                        <SvgIcons.ProjectManager width={wv(30)} height={hv(27)} style={{ alignSelf: 'center' }} ></SvgIcons.ProjectManager>
                                    </View>
                                    <View style={{ height: hv(15.5), borderBottomWidth: 1, borderBottomColor: '#D4DCE1' }}>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    <View style={[styles.UserView, { marginTop: hv(15.5) }]}>
                        <View style={styles.HeadingView}>
                            <Text style={styles.Heading}>Team Leads</Text>
                        </View>
                        {this.props.TeamLeads.map(teamlead => {
                            return (
                                <View key={teamlead.uid}>
                                    <View style={styles.InfoView}>
                                        <Image source={{ uri: teamlead.profilepic }} resizeMode="cover" style={styles.Avatar}></Image>
                                        <View style={styles.InfoDetailView}>
                                            <Text style={styles.Name}>{teamlead.fullName}</Text>
                                            <Text style={styles.Status}>Team Lead</Text>
                                        </View>
                                        {this.state.viewType === "ProjectManager" ?
                                            <View style={{ flexDirection: 'row' }}>
                                                <SvgIcons.ProjectManagerB width={wv(25)} height={hv(25)} style={{ alignSelf: 'center' }} onPress={() => { this.Demote(teamlead.uid) }} ></SvgIcons.ProjectManagerB>
                                                <SvgIcons.Remove width={wv(25)} height={hv(25)} style={{ alignSelf: 'center', marginLeft: wv(8) }} onPress={() => { this.removefromProject('teamleads', teamlead.uid) }}></SvgIcons.Remove>
                                            </View>
                                            : null}
                                    </View>
                                    <View style={{ height: hv(15.5), borderBottomWidth: 1, borderBottomColor: '#D4DCE1' }}>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    <View style={[styles.UserView, { marginTop: hv(15.5) }]}>
                        <View style={{ height: hv(11.5), borderTopWidth: 1, borderTopColor: '#D4DCE1' }}>
                        </View>
                        <View style={styles.HeadingView}>
                            <Text style={styles.Heading}>Team Members</Text>
                        </View>
                        {this.props.TeamMembers.map(teammember => {
                            return (
                                <View key={teammember.uid}>
                                    <View style={styles.InfoView}>
                                        <Image source={{ uri: teammember.profilepic }} resizeMode="cover" style={styles.Avatar}></Image>
                                        <View style={styles.InfoDetailView}>
                                            <Text style={styles.Name}>{teammember.fullName}</Text>
                                            <Text style={styles.Status}>Team Member</Text>
                                        </View>
                                        {this.state.viewType === "ProjectManager" ?
                                            <View style={{ flexDirection: 'row' }}>
                                                <SvgIcons.ProjectManagerB width={wv(25)} height={hv(25)} style={{ alignSelf: 'center' }} onPress={() => { this.makeTeamLead(teammember.uid) }} ></SvgIcons.ProjectManagerB>
                                                <SvgIcons.Remove width={wv(25)} height={hv(25)} style={{ alignSelf: 'center', marginLeft: wv(8) }} onPress={() => { this.removefromProject('teammembers', teammember.uid) }}></SvgIcons.Remove>
                                            </View>
                                            : null}
                                    </View>
                                    <View style={{ height: hv(15.5), borderBottomWidth: 1, borderBottomColor: '#D4DCE1' }}>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
                {
                    this.props.user ? this.props.user.adminaccess ?
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
                                <SvgIcons.AddProject width={wv(52)} height={wv(52)} color="white" style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddProject') }}></SvgIcons.AddProject>
                            </View>
                            <View style={{ width: wv(52), height: hv(44), marginLeft: wv(13.5), marginTop: hv(23) + RFValue(16), borderWidth: 0 }}>
                                <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddUser', { projectId: this.state.projectId }) }}></SvgIcons.AddUserFooter>
                                <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Add User</Text>
                            </View>
                            <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                                <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text>
                                </View>
                                <SvgIcons.IssueFooter width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { }}></SvgIcons.IssueFooter>
                                <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Issues</Text>
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
                                    <SvgIcons.IssueFooter width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooter>
                                    <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Issues</Text>
                                </Button>
                            </FooterTab>
                        </Footer> : null
                }
            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => {
    let userMap = {}
    state.searchReducer.users.forEach(_val => {
        userMap[_val.uid] = _val
    })
    console.log(userMap)
    let ProjectManagers = []
    let TeamLeads = []
    let TeamMembers = []
    const activeProject = state.projectReducer.activeProjectData.length === 1 ? state.projectReducer.activeProjectData[0] : {}
    if (activeProject) {
        ProjectManagers = Object.keys(activeProject.projectmanager ? activeProject.projectmanager : {}).map(_id => userMap[_id])
        TeamLeads = Object.keys(activeProject.teamleads ? activeProject.teamleads : {}).map(_id => userMap[_id])
        TeamMembers = Object.keys(activeProject.teammembers ? activeProject.teammembers : {}).map(_id => userMap[_id])
    }
    return {
        user: state.userReducer.user,
        ProjectData: activeProject,
        users: userMap,
        ProjectManagers: ProjectManagers,
        TeamLeads: TeamLeads,
        TeamMembers: TeamMembers,
        projectsCount: state.projectReducer.projectDetails.length,
        issuesCount: state.issuesReducer.issuesCount
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setProject: function (id, data) { dispatch(SetProject(id, data)) },
        setActiveProjectId: function (id) { dispatch(SetActiveProjectId(id)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewUsers)

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
        marginLeft: wp(4.533), fontSize: RFValue(12), color: '#34304C', fontWeight: "bold"
    },
    ViewUsersView: { flex: 1, marginTop: hv(20.5), marginHorizontal: wv(15), },
    UserView: { flex: 1, marginTop: hv(11.5), borderWidth: 0 },
    HeadingView: { borderBottomColor: '#D8D8D8', borderBottomWidth: 1, height: hv(42 - 11.5) },
    Heading: { fontSize: RFValue(15), fontWeight: "400", marginLeft: wv(18.5), },
    InfoView: { width: wv(304.5), height: hv(55), marginHorizontal: wv(20), marginTop: hv(15.5), flexDirection: 'row', borderWidth: 0 },
    Avatar: { height: RFValue(55), width: RFValue(55), borderRadius: RFValue(55) / 2 },
    InfoDetailView: { height: hv(38), borderWidth: 0, flex: 1, marginLeft: wv(11), marginVertical: hv(24.5 - 15.5) },
    OptionsView: {},
    Name: { fontSize: RFValue(14), fontWeight: "500" },
    Status: { fontSize: RFValue(13), marginTop: hv(4), color: "#758692" },
    Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row' },
    ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },
})
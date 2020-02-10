import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Badge, Icon,
    Left, Right, Body, Button, Title, Separator, ListItem, Subtitle, Thumbnail, View
} from 'native-base'
import { Text, Image, Dimension, Platform } from 'react-native'
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
        this.state = {
            ProjectData: this.props.ProjectData,
            refresh: null
        }
        this.makeTeamLead = makeTeamLead.bind(this)
        this.removefromProject = removefromProject.bind(this)
        this.Demote = Demote.bind(this)
    }
    componentDidMount() {

    }
    render() {
        console.log(this.state)
        return (
            <Container>
                <Header transparent>
                    <Left>
                        <Button transparent onPress={() => { this.props.navigation.navigate('ProjectScreen', { projectId: this.props.navigation.state.params.projectId }) }}>
                            <Icon name='arrow-back' style={{ color: 'blue' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'black' }}>Users</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                    <Separator >
                        <Text>Project Managers</Text>
                    </Separator>
                    {this.props.ProjectData ? Object.keys(this.props.ProjectData.projectmanager).map(manager => {
                        return (
                            <ListItem thumbnail key={manager}>
                                <Left>
                                    <Thumbnail source={{ uri: this.props.ProjectData.projectmanager[manager].profilepic }} style={{ width: 40, height: 40 }} />
                                </Left>
                                <Body style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Title style={{ color: 'black' }}>{this.props.ProjectData.projectmanager[manager].fullName}</Title>
                                    <Subtitle style={{ color: 'grey' }}>Project Manager</Subtitle>
                                </Body>
                                <Right>
                                    <Icon name='briefcase' type='Entypo' style={{ color: 'blue' }} />
                                </Right>
                            </ListItem>)
                    }) : null}
                    <Separator>
                        <Text>Team Leads</Text>
                    </Separator>
                    {this.props.ProjectData ? this.props.ProjectData.teamleads ? Object.keys(this.props.ProjectData.teamleads).map(teamlead => {
                        return (
                            <ListItem thumbnail key={teamlead}>
                                <Left>
                                    <Thumbnail source={{ uri: this.props.ProjectData.teamleads[teamlead].profilepic }} style={{ width: 40, height: 40 }} />
                                </Left>
                                <Body>
                                    <Title style={{ color: 'black' }}>{this.props.ProjectData.teamleads[teamlead].fullName}</Title>
                                    <Subtitle style={{ color: 'grey' }}>Team Lead</Subtitle>
                                </Body>
                                <Right>
                                    {
                                        this.props.ProjectData.projectmanager[firebase.auth().currentUser.uid] ?
                                            Platform.OS === 'ios' ?
                                                <OptionsMenu
                                                    customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
                                                    options={['Demote', 'Remove From Project', 'Cancel']}
                                                    destructiveIndex={1}
                                                    actions={[() => { this.Demote(teamlead) }, () => { this.removefromProject('teamleads', teamlead) }, () => { }]} >
                                                </OptionsMenu> :
                                                <OptionsMenu
                                                    customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
                                                    options={['Demote', 'Remove From Project']}
                                                    actions={[() => { this.Demote(teamlead) }, () => { this.removefromProject('teamleads', teamlead) }]}>
                                                </OptionsMenu> : null
                                    }
                                </Right>
                            </ListItem>)
                    }) : null : null}
                    <Separator>
                        <Text>Team Members</Text>
                    </Separator>
                    {this.props.ProjectData ?
                        this.props.ProjectData.teammembers ? Object.keys(this.props.ProjectData.teammembers).map(teammember => {
                            return (
                                <ListItem thumbnail key={teammember}>
                                    <Left>
                                        <Thumbnail source={{ uri: this.props.ProjectData.teammembers[teammember].profilepic }} style={{ width: 40, height: 40 }} />
                                    </Left>
                                    <Body>
                                        <Title style={{ color: 'black' }}>{this.props.ProjectData.teammembers[teammember].fullName}</Title>
                                        <Subtitle style={{ color: 'grey' }}>Team Member</Subtitle>
                                    </Body>
                                    <Right>
                                        {
                                            this.props.ProjectData.projectmanager[firebase.auth().currentUser.uid] ?
                                                Platform.OS === 'ios' ?
                                                    <OptionsMenu
                                                        customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
                                                        options={['Make Team Lead', 'Remove From Project', 'Cancel']}
                                                        destructiveIndex={1}
                                                        actions={[() => { this.makeTeamLead(teammember) }, () => { this.removefromProject('teammembers', teammember) }, () => { }]} >
                                                    </OptionsMenu> :
                                                    <OptionsMenu
                                                        customButton={<Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />}
                                                        options={['Make Team Lead', 'Remove From Project']}
                                                        actions={[() => { this.makeTeamLead(teammember) }, () => { this.removefromProject('teammembers', teammember) }]}>
                                                    </OptionsMenu> : null
                                        }
                                    </Right>
                                </ListItem>)
                        }) : null : null}
                </Content>
                <Footer />
            </Container>
        )
    }
}
const mapStateToProps = state => {
    return {
        ProjectData: state.projectReducer.activeProjectData.length === 1 ? state.projectReducer.activeProjectData[0] : {}
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setProject: function (id, data) { dispatch(SetProject(id, data)) },
        setActiveProjectId: function (id) { dispatch(SetActiveProjectId(id)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewUsers)
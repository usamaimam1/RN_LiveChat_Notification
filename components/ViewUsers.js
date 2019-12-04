import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Badge, Icon,
    Left, Right, Body, Button, Title, Separator, ListItem, Subtitle, Thumbnail
} from 'native-base'
import { Text, Image, Dimension, Platform, Alert } from 'react-native'
import firebase from 'react-native-firebase'
import OptionsMenu from 'react-native-options-menu'
export default class ViewUsers extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            ProjectData: null
        }
        const projectRef = firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).on('value', data => {
            if(!data._value){
                this.setState({ProjectData:null})
                this.props.navigation.navigate('Dashboard')
            }
            this.setState({ ProjectData: data._value })
        })
        this.makeTeamLead = this.makeTeamLead.bind(this)
        this.removefromProject = this.removefromProject.bind(this)
        this.Demote = this.Demote.bind(this)
    }
    makeTeamLead(memberid) {
        const memberData = this.state.ProjectData.teammembers[memberid]
        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teamleads').child(memberid).set(memberData)
        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(memberid).remove()
    }
    removefromProject(identifier, id) {
        Alert.alert(
            'Remove!',
            'Are you sure to want to remove this user from this Project ?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        if (identifier === 'teamleads') {
                            firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teamleads').child(id).remove()
                        } else if (identifier === 'teammembers') {
                            firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(id).remove()
                        }
                    }
                },
            ],
            { cancelable: true },
        )
    }
    Demote(id){
        Alert.alert(
            'Demote!',
            'Are you sure to want to demote this user on this Project ?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(id).set(this.state.ProjectData.teamleads[id])
                        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teamleads').child(id).remove()
                    }
                },
            ],
            { cancelable: true },
        )
        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(id).set(this.state.ProjectData.teamleads[id])
    }
    componentDidMount() {

    }
    render() {
        // console.log(this.state)
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
                    {this.state.ProjectData ? Object.keys(this.state.ProjectData.projectmanager).map(manager => {
                        return (
                            <ListItem thumbnail key={manager}>
                                <Left>
                                    <Thumbnail source={{ uri: this.state.ProjectData.projectmanager[manager].profilepic }} style={{ width: 40, height: 40 }} />
                                </Left>
                                <Body style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Title style={{ color: 'black' }}>{this.state.ProjectData.projectmanager[manager].fullName}</Title>
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
                    {this.state.ProjectData ? this.state.ProjectData.teamleads ? Object.keys(this.state.ProjectData.teamleads).map(teamlead => {
                        return (
                            <ListItem thumbnail key={teamlead}>
                                <Left>
                                    <Thumbnail source={{ uri: this.state.ProjectData.teamleads[teamlead].profilepic }} style={{ width: 40, height: 40 }} />
                                </Left>
                                <Body>
                                    <Title style={{ color: 'black' }}>{this.state.ProjectData.teamleads[teamlead].fullName}</Title>
                                    <Subtitle style={{ color: 'grey' }}>Team Lead</Subtitle>
                                </Body>
                                <Right>
                                    {
                                        this.state.ProjectData.projectmanager[firebase.auth().currentUser.uid] ?
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
                                            </OptionsMenu> :null
                                    }
                                </Right>
                            </ListItem>)
                    }) : null:null}
                    <Separator>
                        <Text>Team Members</Text>
                    </Separator>
                    {this.state.ProjectData ?
                        this.state.ProjectData.teammembers ? Object.keys(this.state.ProjectData.teammembers).map(teammember => {
                            return (
                                <ListItem thumbnail key={teammember}>
                                    <Left>
                                        <Thumbnail source={{ uri: this.state.ProjectData.teammembers[teammember].profilepic }} style={{ width: 40, height: 40 }} />
                                    </Left>
                                    <Body>
                                        <Title style={{ color: 'black' }}>{this.state.ProjectData.teammembers[teammember].fullName}</Title>
                                        <Subtitle style={{ color: 'grey' }}>Team Member</Subtitle>
                                    </Body>
                                    <Right>
                                        {
                                            this.state.ProjectData.projectmanager[firebase.auth().currentUser.uid] ?
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
                                                </OptionsMenu>:null
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
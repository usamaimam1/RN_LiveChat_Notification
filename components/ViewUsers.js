import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Badge, Icon,
    Left, Right, Body, Button, Title, Separator, ListItem, Subtitle, Thumbnail
} from 'native-base'
import { Text, Image, Dimension, Platform } from 'react-native'
import firebase from 'react-native-firebase'
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
            this.setState({ ProjectData: data._value })
        })
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
                    {this.state.ProjectData ? Object.keys(this.state.ProjectData.projectmanager).map(manager => {
                        return (
                            <ListItem  thumbnail key={manager}>
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
                    {this.state.ProjectData ? Object.keys(this.state.ProjectData.teamleads).map(teamlead => {
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
                                    <Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />
                                </Right>
                            </ListItem>)
                    }) : null}
                    <Separator>
                        <Text>Team Members</Text>
                    </Separator>
                    {this.state.ProjectData ? Object.keys(this.state.ProjectData.teammembers).map(teammember => {
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
                                    <Icon name='ellipsis1' type='AntDesign' style={{ color: 'blue' }} />
                                </Right>
                            </ListItem>)
                    }) : null}
                </Content>
                <Footer />
            </Container>
        )
    }
}
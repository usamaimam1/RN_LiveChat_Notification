import React from 'react'
import {
    Container, Content, Header, Button, Picker, Toast,
    Footer, Icon, Body, Left, Right, Title, SubTitle, Badge, FooterTab
} from 'native-base'
import { SafeAreaView, ImageBackground, Dimensions, Text, Alert } from 'react-native'
import OptionsMenu from 'react-native-options-menu'
import firebase from 'react-native-firebase'
export default class ProjectScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            selected: '',
            project: null,
            viewType: 'Employee',
            userData: null
        }
        firebase.database().ref('users').child(firebase.auth().currentUser.uid).once('value', data => {
            this.setState({ userData: data._value })
        })
        this.handleDelete = this.handleDelete.bind(this)
    }
    handleDelete() {
        if (this.state.viewType !== 'ProjectManager') {
            Alert.alert('Warning', "You're not authorised for this operation")
        } else {
            Alert.alert('Notice!',
                'Are you sure to want to delete this project?',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: 'OK', onPress: () => {
                            firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).remove(()=>{
                                firebase.storage().ref('projectThumbnails/'+this.props.navigation.state.params.projectId).delete().then(()=>{
                                    console.log('Image Deleted from Storage')
                                })
                            })
                        }
                    },
                ],
                { cancelable: true }
            )
        }
    }
    componentDidMount() {
        console.log(this.props.navigation.state.params.projectId)
        const funcRef = firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).on('value', data => {
            if(!data._value){
                this.setState({project:[]})
                this.props.navigation.navigate('Dashboard')
                return
            }
            const isProjectManager = data._value.projectmanager[firebase.auth().currentUser.uid]
            const isTeamLead = data._value.teamleads ? data._value.teamleads[firebase.auth().currentUser.uid] : false
            const isTeamMember = data._value.teammembers ? data._value.teammembers[firebase.auth().currentUser.uid] : false
            if (isProjectManager)
                this.setState({ viewType: 'ProjectManager' })
            else if (isTeamLead)
                this.setState({ viewType: 'TeamLead' })
            this.setState({ project: data._value })
        })
    }

    render() {
        const icon = <Icon name="menu" style={{ color: 'blue' }} />
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Container>
                <ImageBackground source={require('../assets/splash-bg.jpg')}
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
                            <Title style={{ color: 'black', textAlign: 'center' }}>{this.state.project ? this.state.project.projectTitle : 'Project'}</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                {Platform.OS == "ios" ?
                                    <OptionsMenu
                                        customButton={icon}
                                        destructiveIndex={1}
                                        options={["View Team", "Delete Project", "Cancel"]}
                                        actions={[() => { this.props.navigation.navigate('ViewUsers', { projectId: this.props.navigation.state.params.projectId }) }, () => { this.handleDelete() }, () => { }]} />
                                    : <OptionsMenu
                                        customButton={icon}
                                        destructiveIndex={1}
                                        options={["View Team", "Delete Project"]}
                                        actions={[() => { this.props.navigation.navigate('ViewUsers', { projectId: this.props.navigation.state.params.projectId }) }, () => { this.handleDelete() }]} />
                                }
                            </Button>
                        </Right>
                    </Header>
                    <Content />
                    <Footer>
                        <FooterTab>
                            <Button badge vertical>
                                <Badge><Text>2</Text></Badge>
                                <Icon name="message1" type="AntDesign" />
                                <Text>Messages</Text>
                            </Button>
                            <Button vertical onPress={() => {
                                this.props.navigation.navigate('UserProfile', { userData: this.state.userData })
                            }}>
                                <Icon name="user" type="AntDesign" />
                                <Text>User</Text>
                            </Button>
                            <Button badge active vertical >
                                <Badge ><Text>51</Text></Badge>
                                <Icon name="issue-opened" type="Octicons" />
                                <Text>Issues</Text>
                            </Button>
                            {this.state.viewType === 'ProjectManager' ?
                                <Button onPress={() => { this.props.navigation.navigate('AddUser', { projectId: this.props.navigation.state.params.projectId }) }}>
                                    <Icon name="adduser" type="AntDesign" />
                                    <Text>Add User</Text>
                                </Button> : null}
                            {this.state.viewType === 'TeamLead' || this.state.viewType === 'ProjectManager' ? <Button onPress={()=>{this.props.navigation.navigate('AddIssue',{projectId:this.props.navigation.state.params.projectId})}}>
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
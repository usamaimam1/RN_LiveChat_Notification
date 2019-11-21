import React from 'react'
import {
    Container, Content, Header, Button, Picker,
    Footer, Icon, Body, Left, Right, Title, SubTitle,Badge,FooterTab
} from 'native-base'
import { SafeAreaView, ImageBackground, Dimensions,Text } from 'react-native'
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
            project: null
        }
    }
    componentDidMount() {
        console.log(this.props.navigation.state.params.projectId)
        const funcRef = firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).on('value', data => {
            console.log(data._value)
            this.setState({ project: data._value })
        })
    }

    render() {
        const icon = <Icon name="menu" style={{color:'blue'}} />
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
                                        actions={[() => {this.props.navigation.navigate('ViewUsers',{projectId:this.props.navigation.state.params.projectId}) }, () => { }, () => { }]} />
                                    : <OptionsMenu
                                        customButton={icon}
                                        destructiveIndex={1}
                                        options={["View Team", "Delete Project"]}
                                        actions={[() => {this.props.navigation.navigate('ViewUsers',{projectId:this.props.navigation.state.params.projectId}) }, () => { }]} />
                                }
                            </Button>
                        </Right>
                    </Header>
                    <Content />
                    <Footer>
                        <FooterTab>
                            <Button onPress={()=>{this.props.navigation.navigate('AddUser',{projectId:this.props.navigation.state.params.projectId})}}>
                                <Icon name="adduser" type="AntDesign" />
                                <Text>Add User</Text>
                            </Button>
                            <Button>
                                <Icon name="issue-opened" type="Octicons" />
                                <Text>Add Issues</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </ImageBackground>
            </Container>
        )
    }
}
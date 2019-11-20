import React from 'react'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Title,
    Card, CardItem,Badge,FooterTab
} from 'native-base'
import { Image, Text } from 'react-native'

export default class UserProfile extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            userData: this.props.navigation.state.params.userData
        }
    }
    componentDidMount() {

    }
    render() {
        console.log(this.state.userData)
        return (
            <Container>
                <Header transparent>
                    <Left>
                        <Button transparent onPress={() => {
                            this.props.navigation.navigate('Dashboard')
                        }}>
                            <Icon name="arrow-back" style={{ color: 'blue' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'black' }}>User Profile</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content padder>
                    <Card>
                        <CardItem header bordered style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Title style={{ color: 'black' }}> Profile</Title>
                        </CardItem>
                        <CardItem cardBody style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={{ uri: this.state.userData.profilepic }} style={{ height: 200, width: 200, borderRadius: 100 }} />
                        </CardItem>
                        {
                            Object.keys(this.state.userData).map(key => {
                                if (key == "profilepic" || key == "uid")
                                    return null
                                return (
                                    <CardItem footer>
                                        <Left>
                                            <Text>{key}</Text>
                                        </Left>
                                        <Right>
                                            <Text>{JSON.stringify(this.state.userData[key])}</Text>
                                        </Right>
                                    </CardItem>
                                )
                            })
                        }
                    </Card>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button badge vertical>
                            <Badge><Text>2</Text></Badge>
                            <Icon name="message1" type="AntDesign" />
                            <Text>Messages</Text>
                        </Button>
                        <Button active vertical onPress={() => {
                            this.props.navigation.navigate('UserProfile', { userData: this.state.userData })
                        }}>
                            <Icon name="user" type="AntDesign" />
                            <Text>User</Text>
                        </Button>
                        <Button badge vertical>
                            <Badge ><Text>51</Text></Badge>
                            <Icon name="issue-opened" type="Octicons" />
                            <Text>Issues</Text>
                        </Button>
                        {this.state.userData ? this.state.userData.adminaccess ?
                            <Button vertical onPress={() => {
                                this.props.navigation.navigate('AddProject')
                            }}>
                                <Icon name="plus" type="AntDesign" />
                                <Text>Add Project</Text>
                            </Button> : null : null
                        }
                    </FooterTab>
                </Footer>
            </Container >
        )
    }
}
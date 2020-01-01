import React from 'react'
import { Text, View, Image, Dimensions, Platform, ImageBackground } from 'react-native'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Badge, Title,
    FooterTab
} from 'native-base'
export default class IssuesIndex extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            userData: this.props.navigation.state.params.userData,
            projectDetails: this.props.navigation.state.params.projectDetails,
            issueCount: this.props.navigation.state.params.issueCount
        }
    }
    componentDidMount() {

    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Container>
                <ImageBackground source={require('../../assets/splash-bg.jpg')}
                    style={{ width: width, height: height }}>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                                <Icon name="arrow-back" style={{ color: 'blue' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: 'black' }}>Issues Index</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content>

                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                <Badge><Text>{this.state.projectDetails.length}</Text></Badge>
                                <Icon name="project" type="Octicons" />
                                <Text>Projects</Text>
                            </Button>
                            <Button vertical onPress={() => {
                                this.props.navigation.navigate('UserProfile', {
                                    userData: this.state.userData,
                                    projectDetails: this.state.projectDetails,
                                    issueCount: this.state.issueCount
                                })
                            }}>
                                <Icon name="user" type="AntDesign" />
                                <Text>User</Text>
                            </Button>
                            <Button active badge vertical>
                                <Badge ><Text>{this.state.issueCount}</Text></Badge>
                                <Icon name="issue-opened" type="Octicons" />
                                <Text>Issues</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </ImageBackground>
            </Container>
        )
    }
}
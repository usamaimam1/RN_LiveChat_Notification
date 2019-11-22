import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab,
    Body, Left, Right, Badge, Icon, Title, Button
} from 'native-base'
import { Text, Dimensions, Platform, Image, ImageBackground } from 'react-native'

export default class AddIssue extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            issueTitle: null,
            issuePriority: null,
            issueStatus: null,
            projectId: null
        }
    }
    componentDidMount() {

    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Container>
                <ImageBackground source={require('../assets/splash-bg.jpg')}
                    style={{ width: width, height: height }}>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => { this.props.navigation.pop() }}>
                                <Icon name='arrow-back' style={{ color: 'blue' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: 'black' }}>Add Issue</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content>
                    </Content>
                    <Footer>
                    </Footer>
                </ImageBackground>
            </Container>
        )
    }
}
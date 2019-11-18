import React from 'react'
import {
    Container, Content, Header, Button,
    Footer, Icon, Body, Left, Right, Title, SubTitle
} from 'native-base'
import { SafeAreaView } from 'react-native'

export default class ProjectScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        console.log(this.props.navigation)
    }
    render() {
        return (
            <Container>
                <Header transparent>
                    <Left>
                    </Left>
                    <Body>
                        <Title style={{ color: 'black',textAlign:'center' }}>Projects</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name='menu' style={{color:'blue'}} />
                        </Button>
                    </Right>
                </Header>
                <Content />
                <Footer />
            </Container>
        )
    }
}
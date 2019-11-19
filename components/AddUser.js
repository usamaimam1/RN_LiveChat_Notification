import React from 'react'
import {
    Container, Content, Header, Footer,Item,Input,Text,Button,Icon
} from 'native-base'
export default class AddUser extends React.Component {
    static navigationOptions ={
        header:null
    }
    constructor(props) {
        super(props)
    }
    componentDidMount() {

    }
    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" />
                        <Icon name="ios-people" />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <Content />
                <Footer />
            </Container>
        )
    }

}
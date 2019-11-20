import React from 'react'
import {
    Container, Content, Header, Footer, Item, Input, Text, Button, Icon,
    List, ListItem, Left, Right, Body, Thumbnail, Title, Subtitle
} from 'native-base'
import firebase from 'react-native-firebase'
import { ImageBackground, Dimensions } from 'react-native'
export default class AddUser extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            projectId:this.props.navigation.state.params.projectId,
            searchString: '',
            ids: [],
            results: []
        }
        this.handleSearch = this.handleSearch.bind(this)
    }
    componentDidMount() {

    }
    handleSearch() {
        this.setState({ ids: [], results: [] })
        console.log(this.state.searchString)
        const userRef = firebase.database().ref('users')
        userRef.orderByChild('fullName').startAt(this.state.searchString, 'fullName').endAt(this.state.searchString + "\uf8ff").once('value', data => {
            if (data._value)
                this.setState({ ids: Object.keys(data._value), results: data._value })
        })
    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Container>
                <ImageBackground source={require('../assets/splash-bg.jpg')}
                    style={{ width: width, height: height }}>
                    <Header searchBar rounded transparent>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.navigate('ProjectScreen')
                            }}>
                                <Icon name="arrow-back" style={{ color: 'blue' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Item>
                                <Icon name="ios-search" />
                                <Input placeholder="Search" value={this.state.searchString} onChangeText={newText => this.setState({ searchString: newText })} />
                                <Icon name="ios-people" />
                            </Item>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => { this.handleSearch() }}>
                                <Text style={{ color: 'blue' }}>Search</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <List>
                            {
                                this.state.ids.map(id => {
                                    return (
                                        <ListItem avatar key={id}>
                                            <Left>
                                                <Thumbnail source={{ uri: this.state.results[id].profilepic }} style={{ width: 40, height: 40 }} />
                                            </Left>
                                            <Body>
                                                <Title style={{ color: 'black' }}>{this.state.results[id].fullName}</Title>
                                                <Subtitle style={{ color: 'grey' }}>Employee</Subtitle>
                                            </Body>
                                            <Right>
                                                <Button transparent onPress={()=>{
                                                    firebase.database().ref('Projects').child(this.state.projectId).child('teammembers').child(id).set({isAllowed:true},()=>{
                                                        console.log("Team Member Added!")
                                                    })
                                                }}>
                                                <Icon name="add" style={{ color: 'blue' }} />
                                                </Button>
                                            </Right>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </Content>
                    <Footer />
                    </ImageBackground>
            </Container>
                )
            }
        
}
import React from 'react'
import {
    Container, Content, Header, Footer, Item, Input, Text, Button, Icon,
    List, ListItem, Left, Right, Body, Thumbnail, Title, Subtitle
} from 'native-base'
import firebase from 'react-native-firebase'
import { ImageBackground, Dimensions, Alert } from 'react-native'
export default class AddUser extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            projectId: this.props.navigation.state.params.projectId,
            searchString: '',
            ids: [],
            results: [],
            projectData: null
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.evalMemberShip = this.evalMemberShip.bind(this)
    }
    componentDidMount() {
        const projectRef = firebase.database().ref('Projects').child(this.state.projectId).on('value', data => {
            this.setState({projectData:data._value})
        })
    }
    evalMemberShip(id) {
        const isProjectManager = this.state.projectData.projectmanager[id]
        const isTeamLead = this.state.projectData.teamleads[id]
        const isTeamMember = this.state.projectData.teammembers[id]
        return (isProjectManager || isTeamLead || isTeamMember)
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
                                                <Subtitle style={{ color: 'grey' }}>{this.state.results[id].adminaccess ? 'Admin':'Employee'}</Subtitle>
                                            </Body>
                                            <Right>
                                                {this.evalMemberShip(id) ?
                                                    <Button transparent>
                                                        <Icon name='check' type='AntDesign' style={{color:'blue'}} />
                                                    </Button> :
                                                    <Button transparent onPress={() => {
                                                        firebase.database().ref('Projects').child(this.state.projectId).child('teammembers').child(id).set({ isAllowed: true,fullName:this.state.results[id].fullName,profilepic:this.state.results[id].profilepic,uid:id}, () => {
                                                            Alert.alert(
                                                                'Success!',
                                                                'User has been added successfully!',
                                                                [
                                                                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                                                    {
                                                                        text: 'OK', onPress: () => {
                                                                            this.setState({ ids: [], results: [] })
                                                                        }
                                                                    },
                                                                ],
                                                                { cancelable: true },
                                                            )
                                                        })
                                                    }}>
                                                        <Icon name="add" style={{ color: 'blue' }} />
                                                    </Button>
                                                    }
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
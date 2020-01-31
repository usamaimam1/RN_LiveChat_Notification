import React from 'react'
import {
    Container, Content, Header, Footer, Item, Input, Text, Button, Icon,
    List, ListItem, Left, Right, Body, Thumbnail, Title, Subtitle
} from 'native-base'
import firebase from 'react-native-firebase'
import { ImageBackground, Dimensions, Alert } from 'react-native'
import { connect } from 'react-redux'
class AddUser extends React.Component {
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
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.evalMemberShip = this.evalMemberShip.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
    }
    componentDidMount() {

    }
    handleAdd(id) {
        firebase.database().ref('Projects').child(this.state.projectId).child('teammembers').child(id).set({ isAllowed: true, fullName: this.state.results[id].fullName, profilepic: this.state.results[id].profilepic, uid: id }, () => {
            Alert.alert('Success!', 'User has been added successfully!',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => { this.setState({ ids: this.state.ids, results: this.state.results }) } },
                ],
                { cancelable: true },
            )
        })
    }
    evalMemberShip(id) {
        const isProjectManager = this.props.project.projectmanager[id]
        const isTeamLead = this.props.project.teamleads ? this.props.project.teamleads[id] : false
        const isTeamMember = this.props.project.teammembers ? this.props.project.teammembers[id] : false
        return (isProjectManager || isTeamLead || isTeamMember)
    }
    handleSearch() {
        this.setState({ ids: [], results: [] })
        const userRef = firebase.database().ref('users')
        const Words = this.state.searchString.split(' ')
        Words.forEach(word => {
            userRef.orderByChild('fullName').startAt(word, 'fullName').endAt(word + "\uf8ff").once('value', data => {
                if (data._value)
                    this.setState({
                        ids: [...new Set([...Object.keys(data._value), ...this.state.ids])],
                        results: { ...data._value, ...this.state.results }
                    })
            })
        })
    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Container>
                <ImageBackground source={require('../../assets/splash-bg.jpg')}
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
                                                <Subtitle style={{ color: 'grey' }}>{this.state.results[id].adminaccess ? 'Admin' : 'Employee'}</Subtitle>
                                            </Body>
                                            <Right>
                                                {this.evalMemberShip(id) ? <Icon name='check' type='AntDesign' style={{ color: 'blue' }} />
                                                    : <Icon name="add" style={{ color: 'blue' }} onPress={() => { this.handleAdd(id) }} />
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
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        project: state.projectReducer.activeProjectData.length === 1 ? state.projectReducer.activeProjectData[0] : null
    }
}
const mapDispatchToProps = null
export default connect(mapStateToProps, mapDispatchToProps)(AddUser)
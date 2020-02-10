import React from 'react'
import {
    Container, Content, Header, Footer, Item, Input, Text, Button, Icon,
    List, ListItem, Left, Right, Body, Thumbnail, Title, Subtitle
} from 'native-base'
import firebase from 'react-native-firebase'
import { ImageBackground, Dimensions, Alert, View } from 'react-native'
import { connect } from 'react-redux'
import { SetSearchString, ResetSearchString, SetActiveProjectId } from '../../redux/actions'
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
    handleAdd(user) {
        firebase.database().ref('Projects').child(this.state.projectId).child('teammembers').child(user.uid)
            .set({ isAllowed: true, fullName: user.fullName, profilepic: user.profilepic, uid: user.uid }, () => {
                Alert.alert('Success!', 'User has been added successfully!',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { } },
                    ],
                    { cancelable: true },
                )
                this.props.setActiveProjectId(this.state.projectId)
            })
    }
    evalMemberShip(id) {
        const isProjectManager = this.props.project.projectmanager[id]
        const isTeamLead = this.props.project.teamleads ? this.props.project.teamleads[id] : false
        const isTeamMember = this.props.project.teammembers ? this.props.project.teammembers[id] : false
        return (isProjectManager || isTeamLead || isTeamMember)
    }
    handleSearch(query) {
        this.setState({ searchString: query })
        if (query.length > 2) {
            this.props.setSearchString(query)
        }
    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        console.log(this.state.searchString.length)
        return (
            <Container>
                <ImageBackground source={require('../../assets/splash-bg.jpg')}
                    style={{ width: width, height: height }}>
                    <Header searchBar rounded transparent>
                        <Left style={{ flex: 1, flexDirection: 'row' }}>
                            <Button transparent style={{ flex: 1 }} onPress={() => {
                                this.props.navigation.navigate('ProjectScreen')
                            }}>
                                <Icon name="arrow-back" style={{ color: 'blue' }} />
                            </Button>
                            <Item style={{ flex: 6 }}>
                                <Icon name="ios-search" />
                                <Input placeholder="Search" value={this.state.searchString} onChangeText={newText => this.handleSearch(newText)} />
                                <Icon name="ios-people" />
                            </Item>
                        </Left>
                    </Header>
                    <Content>
                        {this.props.searchResults.length !== 0 ?
                            <List>
                                {
                                    this.props.searchResults.map(result => {
                                        return (
                                            <ListItem avatar key={result.uid}>
                                                <Left>
                                                    <Thumbnail source={{ uri: result.profilepic }} style={{ width: 40, height: 40 }} />
                                                </Left>
                                                <Body>
                                                    <Title style={{ color: 'black' }}>{result.fullName}</Title>
                                                    <Subtitle style={{ color: 'grey' }}>{result.adminaccess ? 'Admin' : 'Employee'}</Subtitle>
                                                </Body>
                                                <Right>
                                                    {this.evalMemberShip(result.uid) ? <Icon name='check' type='AntDesign' style={{ color: 'blue' }} />
                                                        : <Icon name="add" style={{ color: 'blue' }} onPress={() => { this.handleAdd(result) }} />
                                                    }
                                                </Right>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List> :
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', margin: 20 }}>{this.state.searchString.length == 0 ? null : "No Records Found"}</Text>
                            </View>
                        }
                    </Content>
                    <Footer />
                </ImageBackground>
            </Container >
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        project: state.projectReducer.activeProjectData.length === 1 ? state.projectReducer.activeProjectData[0] : null,
        searchResults: state.searchReducer.searchResults
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setSearchString: function (query) { dispatch(SetSearchString(query)) },
        resetSearchString: function () { dispatch(ResetSearchString()) },
        setActiveProjectId: function (id) { dispatch(SetActiveProjectId(id)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddUser)
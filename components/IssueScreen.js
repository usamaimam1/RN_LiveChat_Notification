import React from 'react'
import { Container, Content, Header, Footer, Body, Left, Right, Icon, Button, Title } from 'native-base'
import { Text, View, Image, Dimensions, Platfrom, ImageBackground } from 'react-native'
import OptionsMenu from 'react-native-options-menu'
import firebase from 'react-native-firebase'
export default class IssueScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        console.log(this.props.navigation.state.params)
        this.markClosed = this.markClosed.bind(this)
        this.changePriority = this.changePriority.bind(this)
        this.state = {
            issueData: null,
            userData: null,
            ProjectData: null
        }
        firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).on('value', data => {
            this.setState({ issueData: data._value })
        })
        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).on('value', data => {
            this.setState({ ProjectData: data._value })
        })
        firebase.database().ref('users').child(firebase.auth().currentUser.uid).on('value', data => {
            this.setState({ userData: data._value })
        })
    }
    markClosed() {
        firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).child('issueStatus').set('Closed')
    }
    changePriority() {
        firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).child('issuePriority').once('value', data => {
            if (data._value === "Critical") {
                firebase.database().ref("Issues").child(this.props.navigation.state.params.IssueId).child('issuePriority').set('Normal')
            } else {
                firebase.database().ref("Issues").child(this.props.navigation.state.params.IssueId).child('issuePriority').set('Critical')
            }
        })
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
                            <Title style={{ color: 'black' }}>Issues</Title>
                        </Body>
                        <Right>
                            {this.state.userData ?
                                this.state.userData.adminaccess ?
                                    Platform.OS == "ios" ?
                                        <OptionsMenu
                                            customButton={<Icon name="menu" style={{ color: 'blue' }} />}
                                            destructiveIndex={1}
                                            options={["Mark as Closed", "Change Issue Priority to Normal", "Cancel"]}
                                            actions={[() => { this.markClosed() }, () => { this.changePriority() }, () => { }]} />
                                        : <OptionsMenu
                                            customButton={<Icon name="menu" style={{ color: 'blue' }} />}
                                            destructiveIndex={1}
                                            options={["Mark as Closed", "Change Issue Priority to Normal"]}
                                            actions={[]} />
                                    : null : null
                            }

                        </Right>
                    </Header>
                    <Content />
                    <Footer />
                </ImageBackground>
            </Container>
        )
    }
}
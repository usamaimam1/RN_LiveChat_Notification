import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Input, Form, Picker, Item,
    Body, Left, Right, Badge, Icon, Title, Button, Toast, Root
} from 'native-base'
import { Text, Dimensions, Platform, ImageBackground, View, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import UUIDGenerator from 'react-native-uuid-generator';
import firebase from 'react-native-firebase'
export default class AddIssue extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            issueTitle: null,
            issuePriority: 'Critical',
            issueStatus: 'Opened',
            projectId: this.props.navigation.state.params.projectId,
            addedBy: firebase.auth().currentUser.uid,
            issueId: null
        }
        this.handleIssueSubmit = this.handleIssueSubmit.bind(this)
    }
    handleIssueSubmit() {
        const uuid = UUIDGenerator.getRandomUUID()
        uuid.then(val => {
            this.setState({ issueId: val })
            const IssueRef = firebase.database().ref('Issues')
            if (this.state.issueTitle) {
                IssueRef.child(val).set(this.state, x => {
                    if (!x) {
                        firebase.database().ref('Projects').child(this.state.projectId).child('issues').child(val).set('Added')
                        Toast.show({ text: 'Issue Added Successfully', buttonText: 'Ok' })
                    } else {
                        Toast.show({ text: JSON.stringify(x), buttonText: 'Ok' })
                    }
                })
                this.setState({ issueTitle: null })
            } else {
                Toast.show({ text: 'Please fill in the Issue Field', buttonText: 'Ok' })
            }
        })
    }
    componentDidMount() {

    }
    render() {
        // console.log(this.props.navigation.state.params.projectId)
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Root>
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                    <Container>
                        <ImageBackground source={require('../../assets/splash-bg.jpg')}
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
                                <View style={{ height: 300 }} >
                                    <Image source={require('../../assets/ReactNativeFirebase.png')} style={{ width: Dimensions.get("window").width - 20, margin: 10, flex: 1 }} resizeMode="contain" ></Image>
                                </View>
                                <View>
                                    <Form>
                                        <Item rounded picker style={{ paddingLeft: 10, paddingRight: 10, marginTop: 5, marginBottom: 5 }}>
                                            <Left style={{ margin: 5 }}>
                                                <Text>Title</Text>
                                            </Left>

                                            <Input placeholder='Your Text here!' value={this.state.issueTitle} onChangeText={(val) => { this.setState({ issueTitle: val }) }} />

                                        </Item>
                                        <Item rounded picker style={{ paddingLeft: 10, paddingRight: 10, marginTop: 5, marginBottom: 5 }}>
                                            <Left style={{ margin: 5 }}>
                                                <Text>Issue Priority</Text>
                                            </Left>

                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                style={{ width: undefined }}
                                                selectedValue={this.state.issuePriority}
                                                onValueChange={(val) => { this.setState({ issuePriority: val }) }}
                                            >
                                                <Picker.Item label="Critical" value="Critical" />
                                                <Picker.Item label="Normal" value="Normal" />
                                            </Picker>
                                        </Item>
                                        <Button rounded success style={{ width: 150, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }} onPress={() => { this.handleIssueSubmit() }}>
                                            <Text style={{ color: 'white', alignSelf: 'center' }}>Submit Issue</Text>
                                        </Button>
                                    </Form>
                                </View>
                            </Content>
                        </ImageBackground>
                    </Container>
                </KeyboardAwareScrollView>
            </Root >
        )
    }
}
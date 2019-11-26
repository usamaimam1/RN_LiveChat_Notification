import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Input, Form, Picker, Item,
    Body, Left, Right, Badge, Icon, Title, Button
} from 'native-base'
import { Text, Dimensions, Platform, ImageBackground, View, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default class AddIssue extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            issueTitle: null,
            issuePriority: 'Critical',
            issueStatus: 'Fresh',
            projectId: this.props.navigation.state.params.projectId
        }
    }
    componentDidMount() {

    }
    render() {
        console.log(this.props.navigation.state.params.projectId)
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
                        <KeyboardAwareScrollView>
                            <View style={{ height: 300 }} >
                                <Image source={require('../assets/ReactNativeFirebase.png')} style={{ width: Dimensions.get("window").width - 20, margin: 10, flex: 1 }} resizeMode="contain" ></Image>
                            </View>
                            <View>
                                <Form>
                                    <Item rounded picker style={{ paddingLeft: 10, paddingRight: 10, marginTop: 5, marginBottom: 5 }}>
                                        <Left style={{ margin: 5 }}>
                                            <Text>Title</Text>
                                        </Left>

                                        <Input placeholder='Your Text here!' value={this.state.issueTitle} onChangeText={(val) => { this.setState({ issueStatus: val }) }} />

                                    </Item>
                                    <Item rounded picker style={{ paddingLeft: 10, paddingRight: 10, marginTop: 5, marginBottom: 5 }}>
                                        <Left style={{ margin: 5 }}>
                                            <Text>Issue Priority</Text>
                                        </Left>
                                        <Right>
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
                                        </Right>
                                    </Item>
                                </Form>
                            </View>
                        </KeyboardAwareScrollView>
                    </Content>
                    <Footer>
                    </Footer>
                </ImageBackground>
            </Container>
        )
    }
}
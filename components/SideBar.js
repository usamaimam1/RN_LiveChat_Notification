import React from 'react'
import {
    Text, View, Platform, Dimensions, StyleSheet, Image, StatusBar,
    ImageBackground, Button
} from 'react-native'
import {
    Content, Container, Header, Footer, Left, Body, Right,
    Icon, ListItem, List
} from 'native-base'
export default class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: this.props._userData
        }
    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._userData !== prevState.userData) {
            return { userData: nextProps._userData }
        } else {
            return null
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.userData !== prevState.userData) {
            console.log((this.state))
            // this.setState({userData:this.state.})
        }
    }
    render() {
        return (
            <Container>
                <Content>
                    <ImageBackground
                        source={{
                            uri: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        }}
                        style={{
                            height: 150,
                            alignSelf: "stretch",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <Image
                            square
                            style={{ height: 100, width: 100, borderRadius: 50 }}
                            source={this.props.imgSrc}
                        />
                    </ImageBackground>
                    {/* Profile Navigator */}
                    <ListItem icon onPress={() => { this.props._navigation.navigate('UserProfile', { userData: this.state.userData }) }}>
                        <Left>
                            <Icon name="profile" type="AntDesign" />
                        </Left>
                        <Body>
                            <Text>Profile</Text>
                        </Body>
                    </ListItem>
                    {/* Projects Navigator */}
                    <ListItem icon onPress={() => { }}>
                        <Left>
                            <Icon name="project" type="Octicons" />
                        </Left>
                        <Body>
                            <Text>Projects</Text>
                        </Body>
                    </ListItem>
                    {/* Issues Navigator */}
                    <ListItem icon onPress={() => { }}>
                        <Left>
                            <Icon name="issue-opened" type="Octicons" />
                        </Left>
                        <Body>
                            <Text>Issues</Text>
                        </Body>
                    </ListItem>
                    {/* Messages Navigator */}
                    <ListItem icon onPress={() => { }}>
                        <Left>
                            <Icon name="message" type="Entypo" />
                        </Left>
                        <Body>
                            <Text>Messages</Text>
                        </Body>
                    </ListItem>
                    {/* Change Password */}
                    <ListItem icon onPress={() => { this.props._onChangePassword() }}>
                        <Left>
                            <Icon name="account-details" type="MaterialCommunityIcons" />
                        </Left>
                        <Body>
                            <Text>Change Password</Text>
                        </Body>
                    </ListItem>
                    {/* LogOut */}
                    <ListItem icon onPress={() => { this.props._onLogOut() }}>
                        <Left>
                            <Icon name="logout" type="AntDesign" />
                        </Left>
                        <Body>
                            <Text>Log Out</Text>
                        </Body>
                    </ListItem>
                </Content>
            </Container>
        )
    }
}
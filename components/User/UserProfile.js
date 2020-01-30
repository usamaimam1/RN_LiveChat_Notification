import React from 'react'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Title,
    Card, CardItem, Badge, FooterTab
} from 'native-base'
import { Image, Text, ImageBackground, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import { handlePickImage, handleUpdate } from './UserProfile.functions'
import { connect } from 'react-redux'
class UserProfile extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            imagePicked: false,
            imageUploaded: false,
            profilepic: this.props.user.profilepic
        }
        this.handlePickImage = handlePickImage.bind(this)
        this.handleUpdate = handleUpdate.bind(this)
    }
    componentDidMount() {

    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <Container>
                <ImageBackground source={require('../../assets/splash-bg.jpg')}
                    style={{ width: width, height: height }}>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                                <Icon name="arrow-back" style={{ color: 'blue' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: 'black' }}>User Profile</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content padder>
                        <Card>
                            <CardItem cardBody >
                                <ImageBackground
                                    source={{ uri: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" }}
                                    style={styles.thumbnail}
                                >
                                    <TouchableOpacity onPress={this.handlePickImage}>
                                        <Image square style={{ height: 200, width: 200, borderRadius: 100 }}
                                            source={{ uri: this.state.profilepic }}
                                        />
                                    </TouchableOpacity>
                                </ImageBackground>
                            </CardItem>
                            {/* Full Name Entry */}
                            <CardItem cardBody style={{ margin: 10 }}>
                                <Left>
                                    <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: "600" }}> Full Name : </Text>
                                </Left>
                                <Right>
                                    <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: "600" }}>
                                        {this.props.user.fullName}
                                    </Text>
                                </Right>
                            </CardItem>

                            {/* Email Entry */}
                            <CardItem cardBody style={{ margin: 10 }}>
                                <Left>
                                    <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: "600" }}> Email : </Text>
                                </Left>
                                <Right>
                                    <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: "600" }}>
                                        {this.props.user.email}
                                    </Text>
                                </Right>
                            </CardItem>
                            {/* Admin Access */}
                            <CardItem cardBody style={{ margin: 10 }}>
                                <Left>
                                    <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: "600" }}> Admin Access : </Text>
                                </Left>
                                <Right>
                                    <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: "600" }}>
                                        {JSON.stringify(this.props.user.adminaccess)}
                                    </Text>
                                </Right>
                            </CardItem>
                            {/* Card Footer */}
                            <CardItem footer style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Button rounded success style={{ alignItems: 'center', justifyContent: 'center', width: 80 }} onPress={this.handleUpdate}>
                                    <Text>Update</Text>
                                </Button>
                            </CardItem>
                        </Card>
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                <Badge><Text>{this.props.projectCount}</Text></Badge>
                                <Icon name="project" type="Octicons" />
                                <Text>Projects</Text>
                            </Button>
                            <Button active vertical>
                                <Icon name="user" type="AntDesign" />
                                <Text>User</Text>
                            </Button>
                            <Button badge vertical onPress={() => {
                                this.props.navigation.navigate('IssuesIndex')
                            }}>
                                <Badge ><Text>{this.state.issueCount}</Text></Badge>
                                <Icon name="issue-opened" type="Octicons" />
                                <Text>Issues</Text>
                            </Button>

                        </FooterTab>
                    </Footer>
                </ImageBackground>
            </Container >

        )
    }
}
const styles = StyleSheet.create({
    thumbnail: {
        height: 300,
        width: null,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        projectCount: state.projectReducer.projectDetails.length,
        issueCount: state.issuesReducer.issuesCount
    }
}
export default connect(mapStateToProps, null)(UserProfile)
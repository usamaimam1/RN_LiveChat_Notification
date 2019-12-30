import React from 'react'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Title,
    Card, CardItem, Badge, FooterTab
} from 'native-base'
import firebase from 'react-native-firebase'
import { Image, Text, ImageBackground, Dimensions, TouchableOpacity } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class UserProfile extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            userData: this.props.navigation.state.params.userData,
            projectDetails: this.props.navigation.state.params.projectDetails,
            issueCount: this.props.navigation.state.params.issueCount,
            imagePicked: false,
            imageUploaded: false
        }
        this.handlePickImage = this.handlePickImage.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
    }
    componentDidMount() {

    }
    handleUpdate() {
        if (this.state.imagePicked) {
            firebase.storage()
                .ref(`profilepics/${this.state.userData.uid}`)
                .putFile(this.state.userData.profilepic)
                .then(storageTask => {
                    const imageRef = firebase.database().ref('users').child(this.state.userData.uid).child('profilepic')
                    imageRef.set(storageTask.downloadURL, () => {
                        this.setState({ imagePicked: false })
                        alert('Image Updated Successfully')
                    })
                })
        } else {
            alert('Nothing to update')
        }

    }

    handlePickImage() {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                alert('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                const source = { uri: response.uri };
                ImageResizer.createResizedImage(source.uri, 200, 200, 'PNG', 99).then((output) => {
                    this.state.userData.profilepic = output.uri
                    this.setState({ userData: this.state.userData, imagePicked: true })
                }).catch((err) => {
                    console.log(err.message)
                });
            }
        });
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
                                    source={{
                                        uri: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                                    }}
                                    style={{
                                        height: 300,
                                        width: null,
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <TouchableOpacity onPress={this.handlePickImage}>
                                        <Image
                                            square
                                            style={{ height: 200, width: 200, borderRadius: 100 }}
                                            source={{ uri: this.state.userData.profilepic }}

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
                                        {this.state.userData.fullName}
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
                                        {this.state.userData.email}
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
                                        {JSON.stringify(this.state.userData.adminaccess)}
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
                                <Badge><Text>{this.state.projectDetails.length}</Text></Badge>
                                <Icon name="project" type="Octicons" />
                                <Text>Projects</Text>
                            </Button>
                            <Button active vertical>
                                <Icon name="user" type="AntDesign" />
                                <Text>User</Text>
                            </Button>
                            <Button badge vertical onPress={() => {
                                this.props.navigation.navigate('IssuesIndex', {
                                    userData: this.state.userData,
                                    projectDetails: this.state.projectDetails,
                                    issueCount: this.state.issueCount
                                })
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
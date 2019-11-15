import React from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    ImageBackground,
    TextInput,
    Dimensions,
    ScrollView
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import { Button, Toast, Root, Spinner } from 'native-base';
import UUIDGenerator from 'react-native-uuid-generator';
import firebase from 'react-native-firebase';
const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class AddProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectThumbnail: { uri: null },
            projectTitle: null,
            refresh: null,
            submitting: false
        }
        this.projectDetails = [
            { _key: 'projectTitle', _val: '' },
            { _key: 'projectThumbnail', val: '' }
        ]
        this.handlePickImage = this.handlePickImage.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount() {

    }
    handleSubmit() {
        if (this.state.projectThumbnail == null || this.state.projectTitle == null) {
            Toast.show({
                text: "Don't leave the fields empty",
                duration: 2000,
                buttonText: 'Ok'
            })
            console.log("Here")
            return
        } else {
            console.log("Not Here")
        }
        this.setState({ submitting: true })
        const uuid = UUIDGenerator.getRandomUUID()
        uuid.then(val => {
            const projectManager = firebase.auth().currentUser.uid
            const toUpload = {
                projectId: val,
                projectmanager: { [projectManager]: { isAllowed: true } },
                teammembers: {},
                teamleads: {},
                projectTitle: this.state.projectTitle,
            }
            const projectRef = firebase.database().ref('Projects').child(val)
            projectRef.set(toUpload)
            firebase.storage().ref(`projectThumbnails/${val}`)
                .putFile(this.state.projectThumbnail.uri)
                .then(storageTask => {
                    projectRef.child('projectThumbnail').set(storageTask.downloadURL)
                    Toast.show({
                        text: 'Project Added Successfully',
                        duration: 2000,
                        buttonText: 'Ok'
                    })
                    this.setState({submitting:false})
                }).catch(err => {
                    Toast.show({
                        text: err.message,
                        duration: 2000,
                        buttonText: 'Ok'
                    })
                    this.setState({submitting:false})
                })
        })
    }
    handleInput(key, newVal) {
        this.state[key] = newVal
        this.setState({ refresh: true })
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
                    this.setState({ projectThumbnail: { uri: output.uri } })
                    console.log(output.size)
                }).catch((err) => {
                    console.log(err.message)
                });
            }
        });
    }
    render() {
        console.log(this.state)
        return (<Root>
            {this.state.submitting ?
                <View>
                    <Spinner />
                </View>:
                <ScrollView style={{ flex: 1, height: Dimensions.get("window").height }} keyboardShouldPersistTaps="always">
                    <Text style={{ textAlign: 'center', fontSize: 25, fontStyle: 'italic' }}> Add Project</Text>
                    <View style={{ height: 300 }} >
                        <Image source={require('../assets/ReactNativeFirebase.png')} style={{ width: Dimensions.get("window").width - 20, margin: 10, flex: 1 }} resizeMode="contain" ></Image>
                    </View>
                    <View style={{ flex: 1, margin: 5 }}>
                        {this.projectDetails.map(x => {
                            return (
                                <View style={{ borderWidth: 1, margin: 5 }} key={x._key}>
                                    {x._key === 'projectThumbnail' ?
                                        <TextInput value={this.state.projectThumbnail.uri} placeholder={x._key} onFocus={() => { this.handlePickImage() }} style={styles.Text} /> :
                                        <TextInput value={this.state[x._key]} placeholder={x._key} onChangeText={(newVal) => { this.handleInput(x._key, newVal) }} style={styles.Text} />
                                    }
                                </View>
                            )
                        })}
                        <Button rounded success title="Add" style={{ width: 70, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.handleSubmit() }}>
                            <Text style={{ color: 'white' }}>Add</Text>
                        </Button>
                    </View>
                </ScrollView>}
        </Root>)
    }

}

const styles = StyleSheet.create({
    Text: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 5,
        height: 50,
        backgroundColor: 'lightgrey'
    }
})
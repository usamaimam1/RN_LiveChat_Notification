import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  Toast,
  Root,
  Spinner,
  Container,
  Content,
  Header,
  Footer,
  Title,
  Left,
  Icon,
  Body,
  Right,
  Subtitle,
  Item,
  Input,
} from 'native-base';
import UUIDGenerator from 'react-native-uuid-generator';
import firebase from 'react-native-firebase';
const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class AddProject extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      projectThumbnail: {uri: null},
      projectTitle: null,
      refresh: null,
      submitting: false,
      AdminData: null,
    };
    this.projectDetails = [
      {_key: 'projectTitle', _val: ''},
      {_key: 'projectThumbnail', val: ''},
    ];
    this.handlePickImage = this.handlePickImage.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    firebase
      .database()
      .ref('users')
      .child(firebase.auth().currentUser.uid)
      .once('value', data => {
        this.setState({AdminData: data._value});
      });
  }
  handleSubmit() {
    if (
      this.state.projectThumbnail == null ||
      this.state.projectTitle == null
    ) {
      Toast.show({
        text: "Don't leave the fields empty",
        duration: 2000,
        buttonText: 'Ok',
      });
      return;
    }
    this.setState({submitting: true});
    const uuid = UUIDGenerator.getRandomUUID();
    uuid.then(val => {
      const projectManager = firebase.auth().currentUser.uid;
      const toUpload = {
        projectId: val,
        projectmanager: {
          [projectManager]: {
            isAllowed: true,
            uid: this.state.AdminData.uid,
            profilepic: this.state.AdminData.profilepic,
            fullName: this.state.AdminData.fullName,
          },
        },
        teammembers: '',
        teamleads: '',
        projectTitle: this.state.projectTitle,
        dateAdded: Date.now(),
      };
      const projectRef = firebase
        .database()
        .ref('Projects')
        .child(val);
      projectRef.set(toUpload);
      firebase
        .storage()
        .ref(`projectThumbnails/${val}`)
        .putFile(this.state.projectThumbnail.uri)
        .then(storageTask => {
          projectRef.child('projectThumbnail').set(storageTask.downloadURL);
          Toast.show({
            text: 'Project Added Successfully',
            duration: 2000,
            buttonText: 'Ok',
          });
          this.setState({
            submitting: false,
            projectTitle: null,
            projectThumbnail: {uri: null},
          });
        })
        .catch(err => {
          Toast.show({
            text: err.message,
            duration: 2000,
            buttonText: 'Ok',
          });
          this.setState({
            submitting: false,
            projectTitle: null,
            projectThumbnail: {uri: null},
          });
        });
    });
  }
  handleInput(key, newVal) {
    this.state[key] = newVal;
    this.setState({refresh: true});
  }
  handlePickImage() {
    ImagePicker.showImagePicker(options, response => {
      // console.log(response);
      if (response.didCancel) {
        alert('You cancelled image picker 😟');
      } else if (response.error) {
        alert('And error occured: ', response.error);
      } else {
        const source = {uri: response.uri};
        ImageResizer.createResizedImage(source.uri, 200, 200, 'PNG', 99)
          .then(output => {
            this.setState({projectThumbnail: {uri: output.uri}});
            // console.log(output.size);
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    });
  }
  render() {
    // console.log(this.state);
    return (
      <Root>
        {this.state.submitting ? (
          <View>
            <Spinner />
          </View>
        ) : (
          <Container
            style={{flex: 1, height: Dimensions.get('window').height}}
            keyboardShouldPersistTaps="always">
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
              <Header transparent>
                <Left>
                  <Button
                    transparent
                    onPress={() => {
                      this.props.navigation.navigate('Dashboard');
                    }}>
                    <Icon name="arrow-back" style={{color: 'blue'}} />
                  </Button>
                </Left>
                <Body>
                  <Title style={{color: 'black'}}> Add Project</Title>
                </Body>
                <Right></Right>
              </Header>
              <View style={{height: 300}}>
                <Image
                  source={require('../../assets/ReactNativeFirebase.png')}
                  style={{
                    width: Dimensions.get('window').width - 20,
                    margin: 10,
                    flex: 1,
                  }}
                  resizeMode="contain"></Image>
              </View>
              <View style={{flex: 1, margin: 5}}>
                {this.projectDetails.map(x => {
                  return (
                    <View style={{margin: 5}} key={x._key}>
                      {x._key === 'projectThumbnail' ? (
                        <Item rounded>
                          <Input
                            placeholder={x._key}
                            value={this.state.projectThumbnail.uri}
                            onFocus={() => {
                              this.handlePickImage();
                            }}
                          />
                        </Item>
                      ) : (
                        <Item rounded>
                          <Input
                            value={this.state[x._key]}
                            placeholder={x._key}
                            onChangeText={newVal => {
                              this.handleInput(x._key, newVal);
                            }}
                          />
                        </Item>
                      )}
                    </View>
                  );
                })}
                {this.state.projectThumbnail.uri ? (
                  <Image
                    style={{height: 150, width: 150, alignSelf: 'center'}}
                    source={this.state.projectThumbnail}></Image>
                ) : null}
                <Button
                  rounded
                  success
                  title="Add"
                  style={{
                    width: 70,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.handleSubmit();
                  }}>
                  <Text style={{color: 'white'}}>Add</Text>
                </Button>
              </View>
            </KeyboardAwareScrollView>
          </Container>
        )}
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  Text: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    height: 50,
    backgroundColor: 'lightgrey',
  },
});

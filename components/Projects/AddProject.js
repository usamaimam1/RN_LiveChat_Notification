import React from 'react';
import {
  Text, View, Image, StyleSheet, ImageBackground,
  TextInput, Dimensions, ScrollView, SafeAreaView, TouchableOpacity
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Button, Toast, Root, Spinner, Container, Content, Header,
  Footer, Title, Left, Icon, Body, Right, Subtitle, Item, Input,
} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
// import KeyboardAwareScrollView from 'react-native-keyboard-aware-scroll-view'
import * as SvgIcons from '../../assets/SVGIcons/index'
import UUIDGenerator from 'react-native-uuid-generator';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
class AddProject extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      projectThumbnail: { uri: null },
      projectTitle: null,
      refresh: null,
      submitting: false,
      AdminData: null,
    };
    this.projectDetails = [
      { _key: 'projectTitle', _val: '' },
      { _key: 'projectThumbnail', val: '' },
    ];
    this.handlePickImage = this.handlePickImage.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    firebase.database().ref('users').child(firebase.auth().currentUser.uid).once('value', data => {
      this.setState({ AdminData: data._value });
    });
  }
  handleSubmit() {
    if (this.state.projectThumbnail.uri == null || this.state.projectTitle == null) {
      Toast.show({ text: "Don't leave the fields empty", duration: 2000, buttonText: 'Ok', });
      return;
    }
    this.setState({ submitting: true });
    const uuid = UUIDGenerator.getRandomUUID();
    uuid.then(val => {
      const projectManager = firebase.auth().currentUser.uid;
      const toUpload = {
        projectId: val,
        projectmanager: {
          [projectManager]: {
            isAllowed: true,
            uid: this.state.AdminData.uid,
            fullName: this.state.AdminData.fullName,
            profilepic: this.state.AdminData.profilepic
          },
        },
        teammembers: '',
        teamleads: '',
        projectTitle: this.state.projectTitle,
        dateAdded: Date.now(),
      };
      const projectRef = firebase.database().ref('Projects').child(val);
      projectRef.set(toUpload);
      firebase.storage().ref(`projectThumbnails/${val}`).putFile(this.state.projectThumbnail.uri).then(storageTask => {
        projectRef.child('projectThumbnail').set(storageTask.downloadURL, () => {
          Toast.show({ text: 'Project Added Successfully', duration: 2000, buttonText: 'Ok' });
          this.setState({ submitting: false, projectTitle: null, projectThumbnail: { uri: null } });
          this.props.navigation.goBack()
        });
      }).catch(err => {
        Toast.show({ text: err.message, duration: 2000, buttonText: 'Ok' });
        this.setState({ submitting: false, projectTitle: null, projectThumbnail: { uri: null } });
      });
    });
  }
  handleInput(key, newVal) {
    this.state[key] = newVal;
    this.setState({ refresh: true });
  }
  handlePickImage() {
    ImagePicker.showImagePicker(options, response => {
      // console.log(response);
      if (response.didCancel) {
        alert('You cancelled image picker 😟');
      } else if (response.error) {
        alert('And error occured: ', response.error);
      } else {
        const source = { uri: response.uri };
        ImageResizer.createResizedImage(source.uri, 200, 200, 'PNG', 99).then(output => {
          this.setState({ projectThumbnail: { uri: output.uri } });
        }).catch(err => {
          console.log(err.message);
        });
      }
    });
  }
  render() {
    // console.log(this.state);
    return (
      <Root style={{ flex: 1 }}>
        {this.state.submitting ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 200 }}>
            <Spinner />
          </View>
        ) : (
            <SafeAreaView style={styles.Container}>
              <View style={styles.Header}>
                <View style={styles.HeaderInnerView} >
                  <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                  <Text style={styles.HeaderTitle}>Add Project</Text>
                </View>
              </View>
              <View style={styles.AddProjectView}>
                <View style={styles.ProfilePictureView}>
                  {this.state.projectThumbnail.uri ?
                    <Image style={styles.Avatar} source={this.state.projectThumbnail} resizeMode="cover" onPress={this.handlePickImage}></Image> :
                    <SvgIcons.Upload onPress={this.handlePickImage} width={wv(110)} height={hv(110)} style={{ alignSelf: 'center' }} ></SvgIcons.Upload>
                  }
                </View>
                <View style={styles.UploadButton}>
                  {this.state.imgSource ?
                    <Text style={styles.UploadText} onPress={this.handlePickImage}>Change</Text>
                    : <Text style={styles.UploadText} onPress={this.handlePickImage}>Upload</Text>
                  }
                </View>
                <Item style={styles.SignUpField}>
                  <Input style={{ fontSize: 10, marginBottom: hv(11), fontFamily: "Montserrat", }} placeholder="Project Title" textContentType="name"
                    value={this.state.projectTitle} onChangeText={newText => { this.setState({ projectTitle: newText }) }} />
                </Item>
                <TouchableOpacity style={styles.SignUpButton} onPress={() => { this.handleSubmit() }}>
                  <Text style={{ color: 'white', fontFamily: "Montserrat", }}>Submit</Text>
                </TouchableOpacity>
              </View>
              {
                this.props.user ? this.props.user.adminaccess ?
                  <View style={styles.Footer}>
                    <View style={styles.ProjectsIcon} onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                      <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsCount}</Text>
                      </View>
                      <SvgIcons.Projects style={{ alignSelf: 'center', borderWidth: 0 }} width={wv(30)} height={hv(30)} color={this.inActiveColor} onPress={() => { this.props.navigation.navigate('Dashboard') }}></SvgIcons.Projects>
                      <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Projects</Text>
                    </View>
                    <View style={{ width: wv(38), height: hv(42), marginTop: hv(25) + RFValue(16), marginLeft: wv(33), borderWidth: 0 }}>
                      <SvgIcons.Users width={wv(19.5)} height={hv(22)} color={this.activeColor} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('UserProfile') }} ></SvgIcons.Users>
                      <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Profile</Text>
                    </View>
                    <View style={{ width: wv(52), height: wv(52), borderWidth: 0, marginLeft: wv(13.5) }}>
                      <SvgIcons.AddProject width={wv(52)} height={wv(52)} color="white" style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddProject') }}></SvgIcons.AddProject>
                    </View>
                    <View style={{ width: wv(52), height: hv(44), marginLeft: wv(13.5), marginTop: hv(23) + RFValue(16), borderWidth: 0 }}>
                      <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddUser', { projectId: this.state.projectId }) }}></SvgIcons.AddUserFooter>
                      <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Add User</Text>
                    </View>
                    <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                      <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text>
                      </View>
                      <SvgIcons.IssueFooter width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { }}></SvgIcons.IssueFooter>
                      <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Issues</Text>
                    </View>
                  </View> :
                  <Footer transparent style={{ backgroundColor: 'white', marginTop: hv(10) }}>
                    <FooterTab style={{ backgroundColor: 'white' }}>
                      <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                        <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                          <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsCount}</Text>
                        </Badge>
                        <SvgIcons.Projects width={RFValue(26)} height={RFValue(26)} color="#34304C"></SvgIcons.Projects>
                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', color: this.inActiveColor }}>Projects</Text>
                      </Button>
                      <Button vertical badge onPress={() => { this.props.navigation.navigate('UserProfile') }}>
                        <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}><Text style={{ color: 'rgba(255, 255, 255, 0.1)' }}>{this.props.projectsLength}</Text></Badge>
                        <SvgIcons.Users width={RFValue(26)} height={RFValue(26)} ></SvgIcons.Users>
                        <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Profile</Text>
                      </Button>
                      <Button badge vertical title="" onPress={() => { }} >
                        <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                          <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text></Badge>
                        <SvgIcons.IssueFooter width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooter>
                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Issues</Text>
                      </Button>
                    </FooterTab>
                  </Footer> : null
              }
            </SafeAreaView>
          )
        }
      </Root>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    projectsCount: state.projectReducer.projectDetails.length,
    issuesCount: state.issuesReducer.issuesCount
  }
}
const mapDispatchToProps = null
export default connect(mapStateToProps, mapDispatchToProps)(AddProject)
const styles = StyleSheet.create({
  Container: {
    shadowColor: "#000", shadowOpacity: 0.16, flex: 1
  },
  Header: {
    height: hp(8.3), borderBottomColor: 'grey', borderBottomWidth: 0
  },
  HeaderInnerView: {
    height: hp(2.9), marginVertical: hp(3.2), marginHorizontal: wp(3.0), flexDirection: 'row'
  },
  HeaderTitle: {
    fontFamily: "Montserrat", marginLeft: wp(4.533), fontSize: RFValue(12), color: '#34304C', fontWeight: "bold"
  },
  AddProjectView: { flex: 1, marginHorizontal: wv(20) },
  ProfilePictureView: {
    alignSelf: 'center', marginTop: hv(29.5),
  },
  Avatar: {
    width: hv(100), height: hv(100), borderRadius: hv(100) / 2
  },
  UploadButton: {
    alignSelf: 'center',
    height: hv(25), width: wv(64), marginTop: hv(27),
    borderWidth: 1, borderColor: '#34304C'
  },
  UploadText: {
    fontFamily: "Montserrat", fontSize: 9, marginHorizontal: wv(10), marginVertical: hv(5), textAlign: 'center'
  },
  SignUpField: {
    width: wv(200), height: hv(29), alignSelf: 'center', marginTop: hv(10)
  },
  SignUpButton: {
    marginTop: hv(30.5), alignSelf: 'center', height: hv(32), width: wv(140), backgroundColor: '#F48A20', borderRadius: 20,
    justifyContent: 'center', alignItems: 'center'
  },
  Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row' },
  ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },

});

import React from 'react';
import {
  Container, Content, Header, Footer, Body, Left, Right, Icon,
  Button, Title, Item, Input, Toast, List, Thumbnail, ListItem, StyleProvider, Root
} from 'native-base';
import {
  Text, View, Image, Dimensions, SafeAreaView,
  Platfrom, ImageBackground, FlatList, Alert
} from 'react-native';
import OptionsMenu from 'react-native-options-menu';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import * as SvgIcons from '../../assets/SVGIcons/index'
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import {
  preFetchFunc, markClosed, changePriority, handleSendMessage, fetchThumbnail, formatDate, setupChildListener,
  isCloseToBottom, isCloseToTop, handleDelete, fetchUserName
} from './IssueScreen.functions'
import { connect } from 'react-redux'
class IssueScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.preFetchFunc = preFetchFunc.bind(this)
    this.markClosed = markClosed.bind(this);
    this.changePriority = changePriority.bind(this);
    this.handleSendMessage = handleSendMessage.bind(this);
    this.fetchThumbnail = fetchThumbnail.bind(this);
    this.formatDate = formatDate.bind(this);
    this.setupChildListener = setupChildListener.bind(this)
    this.isCloseToBottom = isCloseToBottom.bind(this)
    this.isCloseToTop = isCloseToTop.bind(this)
    this.handleDelete = handleDelete.bind(this)
    this.fetchUserName = fetchUserName.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    this.evalStatus = this.evalStatus.bind(this)
    this.state = {
      defaultThumb: 'https://colorofhope.org/wp-content/uploads/2017/09/default-user-thumbnail-1.png',
      issueData: null,
      userData: null,
      ProjectData: null,
      messagesData: [],
      messageBody: null,
      initFetchLength: 0,
      preLoad: true,
      currentPosition: 'Bottom',
      fetchingPrevious: false,
      Status: 'Member',
      UserName: '',
      projectId: this.props.navigation.state.params.projectId,
      IssueId: this.props.navigation.state.params.IssueId,
    };
    this.preFetchFunc()
  }
  componentDidMount() {

  }
  evalStatus() {
    const isProjectManager = this.props.project.projectmanager ? this.props.project.projectmanager[this.props.user.uid] : false
    const isTeamLead = this.props.project.teamleads ? this.props.project.teamleads[this.props.user.uid] : false
    return isProjectManager || isTeamLead
  }
  async handleNotifications(messageBody) {
    const FIREBASE_API_KEY = "AIzaSyCZ2V_k6Q6w4PShd1Hh_gh2UVjJCJVPs0s";
    const ds = await firebase.database().ref("DeviceIds").once('value')
    console.log(ds)
    let _regIds = []
    let projectmangersIds = this.props.project.projectmanager ? Object.keys(this.props.project.projectmanager) : []
    let teamleadIds = this.props.project.teamleads ? Object.keys(this.props.project.teamleads) : []
    let teammembersIds = this.props.project.teammembers ? Object.keys(this.props.project.teammembers) : []
    let TotalIds = [...projectmangersIds, ...teamleadIds, ...teammembersIds]
    console.log(TotalIds)
    TotalIds.forEach(_Id => {
      if (_Id !== firebase.auth().currentUser.uid) {
        const Ids = ds._value[_Id]
        if (Ids)
          _regIds = [..._regIds, ...ds._value[_Id]]
      }
    })
    console.log(_regIds)
    const message = {
      registration_ids: _regIds,
      notification: {
        title: `${this.props.project.projectTitle} -> ${this.props.issue.issueTitle}`,
        body: `${this.props.user.fullName} : ${messageBody}`,
        "vibrate": 1,
        "sound": 1,
        "show_in_foreground": true,
        "priority": "high",
        "content_available": true,
      },
      data: {

      }
    }
    // curl -H "Content-Type: application/json" -H "Authorization: key=AIzaSyCZ2V_k6Q6w4PShd1Hh_gh2UVjJCJVPs0s" -X POST -d '{"registration_ids":[ "f-LRFotBIU4:APA91bHj0DULX40xBvfjQ7EZPjg6i_rlBKpUsuD5sz09181gwDpA6tS3QDmEoLakEDdO9QPM8Zv9p4IvRsg6AVUl1kOeCS31p6_3L-sMG5O2SnF0yJFML9tO586JvD9XsHAyLe70oZIu", "cGbSYxU06Ao:APA91bEcvlWcckEucZaLOP8k_v981R68HhodoZWJnDjO66X8HLECJrYdqVBF9uFFGuHQkQuG1m124cVsgVpDkuw1JpX6WrAFt07zGOEZqgObFcgHAqpMPqxjNdsvPCvUkuC2vLhNW7R5", "eQ2DW7bqkj4:APA91bEZHvBWq9duftpYLeaJGHFDZWeIBOnHgpl1DG2SuYmHSt0I7i2_Ufxj5iM7VJ2ZifNJcWrLpW__j0-VoVhIGBYjbAarAaMYbZJN9tpizo3TA5bcrWqkpOKqKG14jY7ATPXcSXPW", "dpbXmH1YNYw:APA91bGCe2QSrhl248cmSk3grRffhabvZ1F_MqXrCD-wc6IcvR4PdZ8ZcQcIe_XOj0TMsjRg0l4riL3lX4VPsBtBXlS2oxxU0OItCgvpMD3L2bdfWkdUtEQbyDYCr0LImvksUnXFXBUr", "ewF3pu3fnFw:APA91bFOrB3Wv8SMie9nZrZzu_AuzFaK9DNcIG9vEIeXIjaugf7Cbgq5BgEAKx7bER0_O44qxxZtOxDoug1vKgwEW5x3TF7skFHOG6lCAk0uClSnEy3u7zYD8iJJQhAZ2LJ4_rtIlNn-", "efx_CAi-obc:APA91bH0QVcXpA8UrhxY3BTUpeDYtCTc7iHnfaB2SFOMmoVNtk2IyyjrDTBf77EPVvQNJGKVYV13gcZL9AHvHhL06nWDefArBl_xN_UKtzIb80fBJ4QdnfYg1lavnhV8gpSmjZYotoRX", "ccGa_MZ_wco:APA91bGbqJBhAA_-swj6P1IeN4aGObPHf5Hgd_1ZXCgLyRRsUarpKg0-ODqXxrKuAsYvlsvX2oLPMA0y7r9ZCnG93Fapm7NeN5T07wg34eLNG8KZ_NIlKoLrkSAyHn_rtRUpbPkc-D8t" ],"notification":{"title":"Test","body":"Hello", "vibrate": 1,"sound": 1,"show_in_foreground": true,"priority": "high","content_available": true}} ' https://fcm.googleapis.com/fcm/send
    // curl -H "Content-Type: application/json" -H "Authorization: key=AIzaSyCZ2V_k6Q6w4PShd1Hh_gh2UVjJCJVPs0s" -X POST -d '{"to":"cr6LfE6oA4w:APA91bFdVgOr_hxRoE08vHvMCL6Id6-4W5lVJNVqrAPTOm5_5yKpx7lTiDUU1NnOBHXKTTCKoT9-I_P3hSqdHr0RC9270LUEkGvtDVyQi46JHTlXLGwZ0KOr4-rgjyzzWnMnvMqUqq78","notification":{"title":"Test","body":"Hello", "vibrate": 1,"sound": 1,"show_in_foreground": true,"priority": "high","content_available": true}} ' https://fcm.googleapis.com/fcm/send
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "key=" + FIREBASE_API_KEY
    });

    let response = await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(message) })
    response = await response.json();
    console.log(response);
  }
  componentDidMount() {
    // this.handleNotifications("Hello")
  }
  componentDidUpdate() {

  }
  render() {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return (
      <Root>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <Container>
            <Header transparent>
              <Left>
                <SvgIcons.Back width={wv(24)} height={hv(24)} style={{ marginLeft: wv(12) }} onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
              </Left>
              <Body>
                <Title style={{ color: 'black', alignSelf: 'flex-start', fontFamily: "Montserrat", }}>
                  {this.props.issue ? this.props.issue.issueTitle : 'Issue'}
                </Title>
              </Body>
              <Right>
                {this.props.user ? this.evalStatus() ?
                  Platform.OS == 'ios' ?
                    <OptionsMenu
                      customButton={<Icon name="menu" style={{ color: '#F48A20' }} />}
                      destructiveIndex={2}
                      options={[`Mark as ${this.props.issue ? this.props.issue.issueStatus === 'Opened' ? 'Closed' : 'Opened' : 'None'}`,
                      `Change Issue Priority to ${this.props.issue ? this.props.issue.issuePriority === 'Critical' ? 'Normal' : 'Critical' : 'None'}`,
                        'Delete this Issue',
                        'Cancel',
                      ]}
                      actions={[() => { this.markClosed(); }, () => { this.changePriority(); }, () => { this.handleDelete() }, () => { }]}
                    />
                    : <OptionsMenu
                      customButton={<Icon name="menu" style={{ color: 'blue' }} />}
                      destructiveIndex={2}
                      options={[
                        `Mark as ${this.props.issue.issueStatus === 'Opened' ? 'Closed' : 'Opened'}`,
                        `Change Issue Priority to ${this.props.issue.issuePriority === 'Critical' ? 'Normal' : 'Critical'}`,
                        'Delete this Issue'
                      ]}
                      actions={[() => { this.markClosed(); }, () => { this.changePriority(); }, () => { this.handleDelete() }]}
                    /> : null : null}
              </Right>
            </Header>
            <Content
              ref={c => { this._scroll = c; }}
              removeClippedSubviews
              onScroll={event => {
                const Bottom = this.isCloseToBottom(event.nativeEvent)
                const Top = this.isCloseToTop(event.nativeEvent)
                if (Top) {
                  if (this.state.fetchingPrevious) { return }
                  this.setState({ currentPosition: 'Top', fetchingPrevious: true })
                  firebase.database().ref('Messages').child(this.state.projectId).child(this.state.IssueId)
                    .orderByChild('sentTime')
                    .endAt(this.state.messagesData[0].sentTime)
                    .limitToLast(20).once('value', data => {
                      if (data._value) {
                        const Arr = Object.keys(data._value).map(messageid => data._value[messageid])
                        const sortedArr = Arr.sort((a, b) => {
                          if (a.sentTime < b.sentTime) return -1;
                          if (a.sentTime > b.sentTime) return 1;
                          return 0;
                        });
                        sortedArr.pop()
                        // console.log(`Fetching ${sortedArr.length} old messages`)
                        this.setState({ messagesData: [...sortedArr, ...this.state.messagesData], currentPosition: 'Arbitrary', fetchingPrevious: false })
                      } else {
                        // console.log('Nothing more left to fetch')
                        this.setState({ currentPosition: 'Top', fetchingPrevious: false })
                      }
                    })
                } else if (Bottom) {
                  this.setState({ currentPosition: 'Bottom' })
                } else {
                  // this.setState({ currentPosition: 'Arbitrary' })
                }
              }}
              onContentSizeChange={(w, h) => {
                if (this.state.currentPosition === 'Bottom') {
                  this._scroll._root.scrollToEnd({ animated: true });
                }
              }}>
              <List >
                {this.state.messagesData ? this.state.messagesData.map(message => {
                  return (
                    <ListItem avatar key={JSON.stringify(message.sentTime)} ref={c => { this._listitem = c }}>
                      <Left>
                        <Image
                          source={{ uri: this.props.users[message.sender] ? this.props.users[message.sender].profilepic : this.state.defaultThumb }}
                          style={{ width: RFValue(30), height: RFValue(30), borderRadius: RFValue(30) / 2, marginTop: hv(10) }}
                          resizeMode="cover"
                        />
                      </Left>
                      <Body>
                        <Text numberofLines={1} style={{ fontFamily: "Montserrat", fontSize: 10, paddingLeft: 30, fontStyle: 'italic', fontWeight: '700', paddingBottom: 5 }}>
                          {this.props.users[message.sender] ? this.props.users[message.sender].fullName : '[Deleted User]'}
                        </Text>
                        {firebase.auth().currentUser.uid === message.sender ?
                          <Item rounded success
                            style={{
                              minHeight: 30, alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20,
                              borderColor: 'black', backgroundColor: '#F48A20',
                            }}>
                            <Text style={{ fontFamily: "Montserrat", color: 'white', fontSize: RFValue(14), fontWeight: "300", marginHorizontal: wv(12.5), marginVertical: hv(3) }}>{message.messageBody}</Text>
                          </Item>
                          : <Item rounded
                            style={{
                              minHeight: 30, alignItems: 'center', justifyContent: 'flex-start',
                              paddingLeft: 20, borderColor: 'black', backgroundColor: '#34304C',
                            }}>
                            <Text note style={{ fontFamily: "Montserrat", color: 'white', fontSize: RFValue(14), fontWeight: "300", marginHorizontal: wv(12.5), marginVertical: hv(3) }}>
                              {message.messageBody}
                            </Text>
                          </Item>
                        }
                      </Body>
                      <Right
                        style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: hv(10), paddingLeft: 5, }}>
                        <Text style={{ fontSize: RFValue(11), color: '#161F3D', fontFamily: "Montserrat", }}>
                          {this.formatDate(new Date(message.sentTime))}
                        </Text>
                      </Right>
                    </ListItem>
                  );
                })
                  : null}
              </List>
            </Content>
            <Footer style={{ backgroundColor: 'white' }}>
              <Body style={{ flexDirection: 'row' }}>
                <Item rounded style={{ width: wv(283), height: hv(36), alignSelf: 'center', marginLeft: wv(39.5) }}>
                  <Input
                    style={{ fontFamily: "Montserrat", }}
                    placeholder="Your Message"
                    value={this.state.messageBody}
                    onChangeText={val => {
                      this.setState({ messageBody: val });
                    }}
                  />
                </Item>
                <SvgIcons.SendMessage width={wv(40)} height={hv(40)} style={{ alignSelf: 'center', marginLeft: wv(6) }} onPress={() => { this.handleSendMessage() }}></SvgIcons.SendMessage>
              </Body>
            </Footer>
          </Container>
        </KeyboardAwareScrollView >
      </Root>
    );
  }
}
const mapStateToProps = state => {
  let userMap = {}
  state.searchReducer.users.forEach(_user => {
    userMap[_user.uid] = _user
  })
  return {
    user: state.userReducer.user,
    project: state.projectReducer.activeProjectData.length === 1 ? state.projectReducer.activeProjectData[0] : null,
    issue: state.issuesReducer.issueDetails.filter(_x => _x.issueId === state.issuesReducer.activeIssueId)[0],
    users: userMap
  }
}
const mapDispatchToProps = null
export default connect(mapStateToProps, mapDispatchToProps)(IssueScreen)

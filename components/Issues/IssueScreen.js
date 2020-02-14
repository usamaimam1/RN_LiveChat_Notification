import React from 'react';
import {
  Container, Content, Header, Footer, Body, Left, Right, Icon,
  Button, Title, Item, Input, Toast, List, Thumbnail, ListItem, StyleProvider, Root
} from 'native-base';
import {
  Text, View, Image, Dimensions,
  Platfrom, ImageBackground, FlatList, Alert
} from 'react-native';
import OptionsMenu from 'react-native-options-menu';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
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
    this.state = {
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
          <StyleProvider style={getTheme(material)}>
            <Container>
              <ImageBackground
                source={require('../../assets/splash-bg.jpg')}
                style={{ width: width, height: height }}>
                <Header transparent>
                  <Left>
                    <Button transparent onPress={() => {
                      this.props.navigation.pop();
                    }}>
                      <Icon name="arrow-back" style={{ color: 'blue' }} />
                    </Button>
                  </Left>
                  <Body>
                    <Title style={{ color: 'black' }}>
                      {this.props.issue ? this.props.issue.issueTitle : 'Issue'}
                    </Title>
                  </Body>
                  <Right>
                    {this.props.user ? this.state.Status !== 'Member' ?
                      Platform.OS == 'ios' ?
                        <OptionsMenu
                          customButton={<Icon name="menu" style={{ color: 'blue' }} />}
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
                            <Thumbnail
                              source={{ uri: this.fetchThumbnail(message.sender), }}
                              style={{ width: 30, height: 30 }}
                            />
                          </Left>
                          <Body>
                            <Text numberofLines={1} style={{ fontSize: 10, paddingLeft: 30, fontStyle: 'italic', fontWeight: '700', paddingBottom: 5 }}>
                              {this.fetchUserName(message.sender)}
                            </Text>
                            {firebase.auth().currentUser.uid === message.sender ?
                              <Item rounded success
                                style={{
                                  minHeight: 30, alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20,
                                  borderColor: 'black', backgroundColor: 'lightgreen',
                                }}>
                                <Text style={{ color: 'black' }}>{message.messageBody}</Text>
                              </Item>
                              : <Item rounded
                                style={{
                                  minHeight: 30, alignItems: 'center', justifyContent: 'flex-start',
                                  paddingLeft: 20, borderColor: 'black', backgroundColor: 'lightblue',
                                }}>
                                <Text note style={{ color: 'black' }}>
                                  {message.messageBody}
                                </Text>
                              </Item>
                            }
                          </Body>
                          <Right
                            style={{ alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 5, }}>
                            <Text style={{ fontSize: 11 }}>
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
                  <Body>
                    <Item rounded>
                      <Input
                        placeholder="Your Message"
                        value={this.state.messageBody}
                        onChangeText={val => {
                          this.setState({ messageBody: val });
                        }}
                      />
                      <Button
                        transparent
                        onPress={() => {
                          this.handleSendMessage();
                        }}>
                        <Icon name="paper-plane" type="Entypo"></Icon>
                      </Button>
                    </Item>
                  </Body>
                </Footer>
              </ImageBackground>
            </Container>
          </StyleProvider>
        </KeyboardAwareScrollView >
      </Root>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    project: state.projectReducer.activeProjectData.length === 1 ? state.projectReducer.activeProjectData[0] : null,
    issue: state.issuesReducer.issueDetails.filter(_x => _x.issueId === state.issuesReducer.activeIssueId)[0]
  }
}
const mapDispatchToProps = null
export default connect(mapStateToProps, mapDispatchToProps)(IssueScreen)

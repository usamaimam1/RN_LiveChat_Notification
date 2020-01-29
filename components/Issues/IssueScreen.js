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
// import { declareExportDeclaration } from '@babel/types'
export default class IssueScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.markClosed = this.markClosed.bind(this);
    this.changePriority = this.changePriority.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.fetchThumbnail = this.fetchThumbnail.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.setupChildListener = this.setupChildListener.bind(this)
    this.isCloseToBottom = this.isCloseToBottom.bind(this)
    this.isCloseToTop = this.isCloseToTop.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.fetchUserName = this.fetchUserName.bind(this)
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
      UserName: ''
    };
    firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).on('value', data => {
      this.setState({ issueData: data._value });
    });
    firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).on('value', data => {
      this.setState({ ProjectData: data._value });
      const isProjectManager = data._value.projectmanager ? data._value.projectmanager[firebase.auth().currentUser.uid] : false
      const isTeamLead = data._value.teamleads ? data._value.teamleads[firebase.auth().currentUser.uid] : false
      if (isProjectManager) {
        this.setState({ Status: 'ProjectManager', UserName: data._value.projectmanager[firebase.auth().currentUser.uid].fullName })
      } else if (isTeamLead) {
        this.setState({ Status: 'TeamLead', UserName: data._value.teamleads[firebase.auth().currentUser.uid].fullName })
      } else {
        this.setState({ Status: 'Member', UserName: data._value.teammembers[firebase.auth().currentUser.uid].fullName })
      }
    });
    firebase.database().ref('users').child(firebase.auth().currentUser.uid).on('value', data => {
      this.setState({ userData: data._value });
    });
    firebase.database().ref('Messages').child(this.props.navigation.state.params.projectId).child(this.props.navigation.state.params.IssueId)
      .orderByChild('sentTime')
      .endAt(Date.now())
      .limitToLast(20)
      .once('value', data => {
        const Arr = Object.keys(data._value ? data._value : []).map(k => {
          return data._value[k];
        });
        const sortArr = Arr.sort((a, b) => {
          if (a.sentTime < b.sentTime) return -1
          else if (a.sentTime > b.sentTime) return 1
          else return 0
        })
        this.setState({ messagesData: [...this.state.messagesData, ...sortArr] })
        this.setupChildListener()
      });

  }
  fetchUserName(id) {
    const isProjectManager = this.state.ProjectData.projectmanager ? this.state.ProjectData.projectmanager[id] : false
    const isTeamLead = this.state.ProjectData.teamleads ? this.state.ProjectData.teamleads[id] : false
    if (isProjectManager) {
      return this.state.ProjectData.projectmanager[id].fullName
    } else if (isTeamLead) {
      return this.state.ProjectData.teamleads[id].fullName
    } else {
      return this.state.ProjectData.teammembers[id].fullName
    }
  }
  handleDelete() {
    const isProjectManager = this.state.ProjectData.projectmanager ? this.state.ProjectData.projectmanager[firebase.auth().currentUser.uid] : false
    const isTeamLead = this.state.ProjectData.teamleads ? this.state.ProjectData.teamleads[firebase.auth().currentUser.uid] : false
    if (isProjectManager || isTeamLead) {
      Alert.alert(
        'Warning',
        'Are you sure to want to delete this Issue?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', onPress: () => {
              firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('issues').child(this.props.navigation.state.params.IssueId).remove()
              firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).remove()
              firebase.database().ref('Messages').child(this.props.navigation.state.params.projectId).child(this.props.navigation.state.params.IssueId).remove()
              Toast.show({
                text: 'Issue has been deleted Successfully', buttonText: 'Ok',
              }).onClose(reason => {
                // console.log(reason)
                this.props.navigation.pop()
              })
            }
          },
        ],
        { cancelable: false },
      );
    }
  }
  isCloseToBottom(nativeEvent) {
    const paddingToBottom = 20;
    return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - paddingToBottom
  };
  isCloseToTop(nativeEvent) {
    return nativeEvent.contentOffset.y === 0
  }
  setupChildListener() {
    firebase.database().ref('Messages').child(this.props.navigation.state.params.projectId).child(this.props.navigation.state.params.IssueId)
      .orderByChild('sentTime')
      .startAt(this.state.messagesData.length === 0 ? Date.now() : this.state.messagesData[this.state.messagesData.length - 1].sentTime)
      .on('child_added', data => {
        const mostRecentmessage = this.state.messagesData[this.state.messagesData.length - 1]
        const currentMessage = data._value
        if (!mostRecentmessage) {
          this.setState({ messagesData: [...this.state.messagesData, currentMessage] })
        }
        else if (currentMessage && mostRecentmessage) {
          if (currentMessage.sentTime === mostRecentmessage.sentTime && currentMessage.messageBody === mostRecentmessage.messageBody && currentMessage.sender === mostRecentmessage.sender) {
            return
          } else {
            if (this.state.currentPosition !== "Bottom") {
              if (currentMessage.sender !== firebase.auth().currentUser.uid) {
                Toast.show({ text: 'New Messages Arrived', buttonText: 'Ok' })
              }
            }
            this.setState({ messagesData: [...this.state.messagesData, data._value] })
          }
        }
      });
  }
  formatDate(date) {
    var monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var time = 'AM';
    if (hours > 12) {
      hours = hours - 12;
      time = 'PM';
    }
    if (minutes < 10) {
      minutes = '0' + JSON.stringify(minutes);
    }
    return hours + ':' + minutes + ' ' + time;
  }
  fetchThumbnail(id) {
    if (this.state.ProjectData) {
      const projThumb = this.state.ProjectData.projectmanager
        ? this.state.ProjectData.projectmanager[id]
          ? this.state.ProjectData.projectmanager[id].profilepic
          : null
        : null;
      const leadThumb = this.state.ProjectData.teamleads
        ? this.state.ProjectData.teamleads[id]
          ? this.state.ProjectData.teamleads[id].profilepic
          : null
        : null;
      const memberThumb = this.state.ProjectData.teammembers
        ? this.state.ProjectData.teammembers[id]
          ? this.state.ProjectData.teammembers[id].profilepic
          : null
        : null;
      if (projThumb) {
        return projThumb;
      } else if (leadThumb) {
        return leadThumb;
      } else {
        return memberThumb;
      }
    } else {
      return null;
    }
  }
  markClosed() {
    if (this.state.issueData.issueStatus === 'Opened') {
      firebase
        .database().ref('Issues').child(this.props.navigation.state.params.IssueId).child('issueStatus').set('Closed');
    } else {
      firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).child('issueStatus').set('Opened');
    }
  }
  changePriority() {
    firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).child('issuePriority')
      .once('value', data => {
        if (data._value === 'Critical') {
          firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).child('issuePriority').set('Normal');
        } else {
          firebase.database().ref('Issues').child(this.props.navigation.state.params.IssueId).child('issuePriority').set('Critical');
        }
      });
  }
  handleSendMessage() {
    if (this.state.messageBody) {
      const message = {
        messageBody: this.state.messageBody,
        sender: firebase.auth().currentUser.uid,
        sentTime: Date.now(),
      };
      this.setState({ messageBody: null });
      firebase.database().ref('Messages').child(this.props.navigation.state.params.projectId).child(this.props.navigation.state.params.IssueId)
        .push(message, err => {
          console.log(err);
        })
    } else {
      Toast.show({ text: 'Please Enter A Message First', buttonText: 'Ok' });
    }
  }
  componentDidMount() { }
  componentDidUpdate() {
    // this._scroll._root.scrollToEnd({ animated: true });
  }
  render() {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    // console.log(this.state.currentPosition);
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
                      {this.state.issueData
                        ? this.state.issueData.issueTitle
                        : 'Issue'}
                    </Title>
                  </Body>
                  <Right>
                    {this.state.userData ? (
                      this.state.Status !== 'Member' ? (
                        Platform.OS == 'ios' ? (
                          <OptionsMenu
                            customButton={
                              <Icon name="menu" style={{ color: 'blue' }} />
                            }
                            destructiveIndex={2}
                            options={[`Mark as ${this.state.issueData.issueStatus === 'Opened' ? 'Closed' : 'Opened'}`,
                            `Change Issue Priority to ${this.state.issueData.issuePriority === 'Critical' ? 'Normal' : 'Critical'}`,
                              'Delete this Issue',
                              'Cancel',
                            ]}
                            actions={[() => { this.markClosed(); },
                            () => { this.changePriority(); },
                            () => { this.handleDelete() },
                            () => { }]}
                          />
                        ) : (
                            <OptionsMenu
                              customButton={
                                <Icon name="menu" style={{ color: 'blue' }} />
                              }
                              destructiveIndex={2}
                              options={[
                                `Mark as ${
                                this.state.issueData.issueStatus === 'Opened' ? 'Closed' : 'Opened'}`,
                                `Change Issue Priority to ${this.state.issueData.issuePriority === 'Critical'
                                  ? 'Normal' : 'Critical'}`,
                                'Delete this Issue'
                              ]}
                              actions={[
                                () => { this.markClosed(); },
                                () => { this.changePriority(); },
                                () => { this.handleDelete() }
                              ]}
                            />
                          )
                      ) : null
                    ) : null}
                  </Right>
                </Header>
                <Content
                  ref={c => {
                    this._scroll = c;
                    // console.log(this._scroll ? this._scroll._root : null)
                  }}

                  removeClippedSubviews
                  onScroll={event => {
                    const Bottom = this.isCloseToBottom(event.nativeEvent)
                    const Top = this.isCloseToTop(event.nativeEvent)
                    if (Top) {
                      if (this.state.fetchingPrevious) {
                        return
                      }
                      this.setState({ currentPosition: 'Top', fetchingPrevious: true })
                      firebase.database().ref('Messages')
                        .child(this.props.navigation.state.params.projectId)
                        .child(this.props.navigation.state.params.IssueId)
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
                    // console.log(w);
                    // console.log(h);
                    if (this.state.currentPosition === 'Bottom') {
                      this._scroll._root.scrollToEnd({ animated: true });
                    }
                  }}>
                  <List >
                    {this.state.messagesData
                      ? this.state.messagesData.map(message => {
                        return (
                          <ListItem
                            avatar
                            key={JSON.stringify(message.sentTime)}
                            ref={c => { this._listitem = c }}>
                            <Left>
                              <Thumbnail
                                source={{
                                  uri: this.fetchThumbnail(message.sender),
                                }}
                                style={{ width: 30, height: 30 }}
                              />
                            </Left>
                            <Body>
                              <Text numberofLines={1} style={{ fontSize: 10, paddingLeft: 30, fontStyle: 'italic', fontWeight: '700', paddingBottom: 5 }}>
                                {this.fetchUserName(message.sender)}</Text>
                              {firebase.auth().currentUser.uid ===
                                message.sender ? (
                                  <Item
                                    rounded
                                    success
                                    style={{
                                      minHeight: 30,
                                      alignItems: 'center',
                                      justifyContent: 'flex-end',
                                      paddingRight: 20,
                                      borderColor: 'black',
                                      backgroundColor: 'lightgreen',
                                    }}>
                                    <Text style={{ color: 'black' }}>
                                      {message.messageBody}
                                    </Text>
                                  </Item>
                                ) : (
                                  <Item
                                    rounded
                                    style={{
                                      minHeight: 30,
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                      paddingLeft: 20,
                                      borderColor: 'black',
                                      backgroundColor: 'lightblue',
                                    }}>
                                    <Text note style={{ color: 'black' }}>
                                      {message.messageBody}
                                    </Text>
                                  </Item>
                                )}
                            </Body>
                            <Right
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                paddingLeft: 5,
                              }}>
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

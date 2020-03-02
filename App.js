import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, AsyncStorage } from 'react-native';

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import firebase from 'react-native-firebase';
import * as actions from './redux/actions/actionTypes'
import { connect } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/Signup'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/Auth/ForgotPassword';
import ChangePassword from './components/Auth/ChangePassword';
import AddProject from './components/Projects/AddProject'
import ProjectScreen from './components/Projects/ProjectScreen'
import AddUser from './components/User/AddUser'
import UserProfile from './components/User/UserProfile'
import ViewUsers from './components/User/ViewUsers'
import AddIssue from './components/Issues/AddIssue'
import IssueScreen from './components/Issues/IssueScreen'
import IssuesIndex from './components/Issues/IssuesIndex'
import { SetNetworkState } from './redux/actions';

const MainNavigator = createStackNavigator({
  Home: { screen: Login },
  SignUp: { screen: SignUp },
  Dashboard: { screen: Dashboard },
  ForgotPassword: { screen: ForgotPassword, params: { code: null } },
  ChangePassword: { screen: ChangePassword },
  AddProject: { screen: AddProject },
  ProjectScreen: { screen: ProjectScreen },
  AddUser: { screen: AddUser },
  UserProfile: { screen: UserProfile },
  ViewUsers: { screen: ViewUsers },
  AddIssue: { screen: AddIssue },
  IssueScreen: { screen: IssueScreen },
  IssuesIndex: { screen: IssuesIndex }
});

const Navigator = createAppContainer(MainNavigator);

class App extends React.Component {
  constructor(props) {
    super(props)
    this.getToken = this.getToken.bind(this)
    this.checkPermission = this.checkPermission.bind(this)
    this.requestPermission = this.requestPermission.bind(this)
    this.createNotificationListeners = this.createNotificationListeners.bind(this)
    this.removeNotificationListeners = this.removeNotificationListeners.bind(this)
  }
  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

  createNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener = firebase
      .notifications()
      .onNotification(notification => {
        notification.android.setChannelId('test-channel').setSound('default')
        firebase.notifications().displayNotification(notification);
      });
  };

  removeNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener();
  };

  componentDidMount() {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.props.setNetworkState(state)
    });
  }

  componentWillUnmount() {
    this.removeNotificationListeners();
    this.unsubscribe()
  }
  render() {
    return (
      <Navigator />
    )
  }
}
const mapStateToProps = null
const mapDispatchToProps = dispatch => {
  return {
    setNetworkState: function (netstate) { dispatch(SetNetworkState(netstate)) }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
// export default class App extends React.Component{
//   render(){
//     return(<MainNavigator screenProps={{code:null}} />)
//   }
// };
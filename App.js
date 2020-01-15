import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { Root } from 'native-base'
import {Provider} from 'react-redux'
import store from './redux/store'
import firebase from 'react-native-firebase';

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

export default class App extends React.Component{
  render(){
    return(
      <Provider store={store}>
        <Navigator />
      </Provider>
    )
  }
}


// export default class App extends React.Component{
//   render(){
//     return(<MainNavigator screenProps={{code:null}} />)
//   }
// };
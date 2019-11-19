import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'


import firebase from 'react-native-firebase';

import Login from './components/Login'
import SignUp from './components/Signup'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';
import AddProject from './components/AddProject'
import ProjectScreen from './components/ProjectScreen'
import AddUser from './components/AddUser'

const MainNavigator = createStackNavigator({
  Home: {screen: Login},
  SignUp: {screen: SignUp},
  Dashboard:{screen:Dashboard},
  ForgotPassword:{screen:ForgotPassword,params:{code:null}},
  ChangePassword:{screen:ChangePassword},
  AddProject:{screen:AddProject},
  ProjectScreen:{screen:ProjectScreen},
  AddUser:{screen:AddUser}
});

const App = createAppContainer(MainNavigator);
export default App


// export default class App extends React.Component{
//   render(){
//     return(<MainNavigator screenProps={{code:null}} />)
//   }
// };
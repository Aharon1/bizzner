/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createStackNavigator,createAppContainer } from 'react-navigation';
import MainScreen from './components/Main';
import ProfileScreen from './components/Profile';
import EventsScreen from './components/Events';
const NavigateScreens = createStackNavigator ({
  Home:{screen:MainScreen},
  Profile:{
      screen:ProfileScreen,
      navigationOptions:{
      header:null
    }
  },
  Events:{
    screen : EventsScreen,
    navigationOptions:{
      header:null
    }
  }
  },{
    //initialRouteName:'Events',
  
});
const AppContainer = createAppContainer(NavigateScreens);
class BizznerApp extends Component{
  render(){
    return <AppContainer />;
  }
} 
export default BizznerApp;
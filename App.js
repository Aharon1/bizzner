/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import MainStyles from './components/StyleSheet';
import { createStackNavigator, createAppContainer } from 'react-navigation';
class MainScreen extends Component {
    static navigationOptions =
    {
      title: 'Home',
    };
    gotoNextActivity = () =>
    {
      this.props.navigation.navigate('Profile');
      
    }
    render() {
      return ( 
        <View style = { MainStyles.container } >
          <View style = {[MainStyles.minContainer,{width:250}]} >
            <Image source={require('./assets/bizzner-logo.png')} style={{width:213,height:55}}/>
            <Text style={MainStyles.mPHeading}> Your daily dose of inspiring people to meet </Text> 
          </View>
            <TouchableOpacity style={[ MainStyles.btn, MainStyles.linBtn]} onPress={() =>this.props.navigation.navigate('Profile')}>
              <Image source={require('./assets/l-btn.png')} style={[{width:'100%'}]} resizeMode={'contain'}/>
            </TouchableOpacity>
            <TouchableOpacity style={[ MainStyles.btn]}>
              <Image source={require('./assets/e-btn.png')}  style={{width:'100%'}} resizeMode={'contain'}/>
            </TouchableOpacity>
            <View style = { MainStyles.minContainer } >
              <Image source={require('./assets/or.png')} style={[MainStyles.orImg,{width:'100%'}]} resizeMode={'contain'}/>
            </View>
            <TouchableOpacity style={[ MainStyles.btn]}>
              <Image source={require('./assets/su-btn.png')} style={{width:'100%'}} resizeMode={'contain'}/>
            </TouchableOpacity>
        </View>
        );
    }
}

class ProfileScreen extends Component{
 
  static navigationOptions =
  {
     title: 'Profile',
  };
 
  render() {
    
    return (
 
      <View >
 
        <Text >This is Second Screen Activity.</Text>
      
      </View>
    );
  }
}

const BizznerApp = createStackNavigator(
  {
    Home: MainScreen,
    profile: ProfileScreen
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(BizznerApp);
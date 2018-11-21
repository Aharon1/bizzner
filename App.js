/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainStyles from './components/StyleSheet';

export default class BizznerApp extends React.Component {
    render() {
        return ( 
        <View style = { MainStyles.container } >
          <Image source={require('./assets/bizzner-logo.png')} style={{width:200,height:55}}/>
          <Text style={MainStyles.mPHeading}> Your daily dose of inspiring people to meet </Text> 
          <TouchableOpacity style={[ MainStyles.btn, MainStyles.linBtn ]}>
            <Text>Press Me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ MainStyles.btn, MainStyles.linBtn ]}>
            <Icon name="whatshot"/>
            <Text>Press Me</Text>
          </TouchableOpacity>
        </View>
        );
    }
}
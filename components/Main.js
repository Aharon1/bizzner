import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import MainStyles from 'components/StyleSheet';

const MainScreen = () => {
        return ( 
        <View style = { MainStyles.container } >
          <View style = { MainStyles.minContainer } >
            <Image source={require('./assets/bizzner-logo.png')} style={{width:213,height:55}}/>
            <Text style={MainStyles.mPHeading}> Your daily dose of inspiring people to meet </Text> 
          </View>
          <TouchableOpacity style={[ MainStyles.btn, MainStyles.linBtn ]}>
            <Image source={require('./assets/l-icon.png')} style={{width:26,height:26}}/>
            <Text>Sign in with Linkedin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ MainStyles.btn, MainStyles.emailBtn ]}>
            <Image source={require('./assets/e-icon.png')} style={{width:30,height:25}}/>
            <Text>Continue with Email</Text>
          </TouchableOpacity>
          <View style = { MainStyles.minContainer } >
            <Text style={MainStyles.saperator}>OR</Text>
          </View>
          <TouchableOpacity style={[ MainStyles.btn, MainStyles.sUpBtn ]}>
            <Image source={require('./assets/sign-in-icon.png')} style={{width:32,height:24}}/>
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
        );

}
export default  MainScreen;
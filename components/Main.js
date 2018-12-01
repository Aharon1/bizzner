import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity} from 'react-native';
import MainStyles from './StyleSheet';
import LinkedInSDK from 'react-native-linkedin-sdk';
class MainScreen extends Component {
  static navigationOptions =
  {
    header:null
    //title: 'Home',
  };
  Login() {
    const token = LinkedInSDK.signIn({
      // https://developer.linkedin.com/docs/oauth2
   
      // iOS (Required)
      // The "API Key" value generated when you registered your application.
      clientID: '81fcixszrwwavz',
   
      // iOS (Required)
      clientSecret: 'm3sWUS3DpPoHZdZk',
   
      // iOS (Required)
      // A unique string value of your choice that is hard to guess. Used to prevent CSRF.
      state: 'mvdeisred',
   
      // iOS, Android (Required)
      scopes: [
        'r_basicprofile',
        'r_emailaddress',
      ],
   
      // iOS (Required)
      // The URI your users will be sent back to after authorization.  This value must match one of the defined OAuth 2.0 Redirect URLs in your application configuration.
      // e.g. https://www.example.com/auth/linkedin
      redirectUri: 'http://localhost:8081/auth/linkedin/callback',
    });
    //this.props.navigation('Profile');
    const profile = LinkedInSDK.getRequest('https://api.linkedin.com/v1/people/~?format=json');
   
    console.log(token, profile);
    
  }
  render() {
    const {navigate} = this.props.navigation;
    
    return ( 
      <View style = { MainStyles.container } >
        <View style = {[MainStyles.minContainer,{width:250}]} >
          <Image source={require('../assets/bizzner-logo.png')} style={{width:213,height:55}}/>
          <Text style={MainStyles.mPHeading}> Your daily dose of inspiring people to meet </Text> 
        </View>
          <TouchableOpacity style={[ MainStyles.btn, MainStyles.linBtn]} onPress={()=> navigate('Profile') }>
            <Image source={require('../assets/l-btn.png')} style={[{width:'100%'}]} resizeMode={'contain'}/>
          </TouchableOpacity>
          <TouchableOpacity style={[ MainStyles.btn]}>
            <Image source={require('../assets/e-btn.png')}  style={{width:'100%'}} resizeMode={'contain'}/>
          </TouchableOpacity>
          <View style = { MainStyles.minContainer } >
            <Image source={require('../assets/or.png')} style={[MainStyles.orImg,{width:'100%'}]} resizeMode={'contain'}/>
          </View>
          <TouchableOpacity style={[ MainStyles.btn]}>
            <Image source={require('../assets/su-btn.png')} style={{width:'100%'}} resizeMode={'contain'}/>
          </TouchableOpacity>
      </View>
      );
  }
}
export default MainScreen
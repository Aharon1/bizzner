import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import MainStyles from './StyleSheet';
import LinkedInSDK from 'react-native-linkedin-sdk';
class MainScreen extends Component {
  static navigationOptions =
  {
    header:null
    //title: 'Home',
  };
   async saveDetails(key,value){
    await AsyncStorage.setItem(key,value);
  }
  async Login() {
    const token = await LinkedInSDK.signIn({
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
      redirectUri: 'https://github.com/joonhocho/react-native-linkedin-sdk/oauth2callback',
    });
    //
    const profile = await LinkedInSDK.getRequest('https://api.linkedin.com/v1/people/~:(first-name,last-name,email-address,headline,summary,location:(name),positions:(title,is-current))?format=json');
    // this.saveDetails('firstName',profile.data.firstName);
    // this.saveDetails('lastName',profile.data.lastName);
    // this.saveDetails('emailAddress',profile.data.emailAddress);
    // this.saveDetails('headline',profile.data.headline);
    // this.saveDetails('location',profile.data.location.name);
    // this.saveDetails('position',profile.data.positions.values[0].title);
    let userDetails = {
      firstName:profile.data.firstName,
      lastName:profile.data.lastName,
      emailAddress:profile.data.emailAddress,
      headline:profile.data.headline,
      location:profile.data.location.name,
      position:profile.data.positions.values[0].title,
    }
    //this.saveDetails('userDetails',JSON.stringify(userDetails));
    console.log(token, profile);
    this.props.navigation.navigate('Profile',userDetails);
  }
  
  render() {
    const {navigate} = this.props.navigation;
    
    return ( 
      <View style = { MainStyles.container } >
        <View style = {[MainStyles.minContainer,{width:250}]} >
          <Image source={require('../assets/bizzner-logo.png')} style={{width:213,height:55}}/>
          <Text style={MainStyles.mPHeading}> Your daily dose of inspiring people to meet </Text> 
        </View>
          <TouchableOpacity style={[ MainStyles.btn, MainStyles.linBtn]} onPress={()=> this.Login() }>
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
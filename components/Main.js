import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import MainStyles from './StyleSheet';
import LinkedInSDK from 'react-native-linkedin-sdk';
import Loader from './Loader';
class MainScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading:false
    };
  }
  static navigationOptions =
  { 
    header:null
  };
   async saveDetails(key,value){
    await AsyncStorage.setItem(key,value);
  }
  async Login() {
    this.setState({
      loading: true
    });
    const token = await LinkedInSDK.signIn({
      clientID: '81fcixszrwwavz',
      clientSecret: 'm3sWUS3DpPoHZdZk',
      state: 'mvdeisred',
      scopes: [
        'r_basicprofile',
        'r_emailaddress',
      ],
      redirectUri: 'https://github.com/joonhocho/react-native-linkedin-sdk/oauth2callback',
    });
    //
    const profile = await LinkedInSDK.getRequest('https://api.linkedin.com/v1/people/~:(first-name,last-name,email-address,headline,summary,location:(name),positions:(title,is-current))?format=json');
    const profilePicture = await LinkedInSDK.getRequest('https://api.linkedin.com/v1/people/~/picture-urls::(original)?format=json');
    let userDetails = {
      firstName:profile.data.firstName,
      lastName:profile.data.lastName,
      emailAddress:profile.data.emailAddress,
      headline:profile.data.headline,
      location:profile.data.location.name,
      position:profile.data.positions.values[0].title,
      profilePicture:profilePicture.data.values[0]
    }
    await AsyncStorage.setItem('isUserLoggedin','true');
    this.setState({loading:false})
    this.props.navigation.navigate('Profile',userDetails);
  }
  render() {
    const {navigate} = this.props.navigation;
    return ( 
      <View style = { MainStyles.container } >
        <Loader loading={this.state.loading} />
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
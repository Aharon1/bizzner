import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, AsyncStorage,Platform,Linking} from 'react-native';
import MainStyles from './StyleSheet';
import LinkedInSDK from 'react-native-linkedin-sdk';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import {SERVER_URL} from '../Constants';
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
      redirectUri: 'https://github.com/joonhocho/react-native-linkedin-sdk/oauth2callback',//'http://bizzner.com/app/linkedin-auth.php',
    }).catch(error=>{
      console.log(error);
    });
    //
    if(!token.accessToken){
      Toast.show('Linkedin is temporarily disabled',Toast.SHORT);
      this.setState({
        loading: false
      });
      return false;
    }
    console.log('token',token);
    const profile = await LinkedInSDK.getRequest('https://api.linkedin.com/v1/people/~:(first-name,last-name,email-address,headline,summary,location:(name),positions:(title,is-current))?format=json');
    const profilePicture = await LinkedInSDK.getRequest('https://api.linkedin.com/v1/people/~/picture-urls::(original)?format=json');
    var profileData = profile.data;
    var userDetails = {
      "firstName":profile.data.firstName,
      "lastName":profile.data.lastName,
      "emailAddress":profile.data.emailAddress,
      "headline":profile.data.headline,
      "location":profile.data.location.name,
      "position":profile.data.positions.values[0].title,
      "profilePicture":profilePicture.data.values[0]
    }
    var params = 'firstName='+encodeURIComponent(profileData.firstName)+'&';
    params += 'lastName='+encodeURIComponent(profileData.lastName)+'&';
    params += 'emailAddress='+encodeURIComponent(profileData.emailAddress)+'&';
    params += 'headline='+encodeURIComponent(profileData.headline)+'&';
    params += 'location='+encodeURIComponent(profileData.location.name)+'&';
    params += 'position='+encodeURIComponent(profileData.positions.values[0].title)+'&';
    params += 'profilePicture='+encodeURIComponent(profilePicture.data.values[0]);
    fetch(SERVER_URL+'?action=check_user_details&'+params)
    .then(res=>res.json())
    .then(res=>{
      if(res.code == 200){
        this.saveDetails('isUserLoggedin','true');
        this.saveDetails('userID',res.body.ID);
        Toast.show(res.message,Toast.SHORT);
        setTimeout(()=>{
          this.setState({loading:false})
          this.props.navigation.navigate('Profile');
        },200)
        
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }
  componentDidMount() { // B
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.checkToken(url)
      });
    } 
    else {
        Linking.addListener('url', this.handleOpenURL);
    }
  }
  componentWillUnmount() { // C
      Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL = (event) => { // D
      this.checkToken(event.url);
  }
  checkToken = (url)=>{
      if(url){
          var fullUrl = url.split('/');
          var tokenString = fullUrl[fullUrl.length - 2];
          if(tokenString == 'token'){
              var token = fullUrl[fullUrl.length - 1];
              fetch(SERVER_URL+'?action=check-token&token='+token)
              .then(res=>res.json())
              .then(response=>{
                  if(response.code == 200){
                      this.saveDetails('isUserLoggedin','true');
                      this.saveDetails('userID',response.body.ID);
                      Toast.show(response.message, Toast.SHORT);
                      this.props.navigation.navigate('ConfirmScreen');
                  }
                  else{
                      Toast.show(response.message, Toast.SHORT);
                  }
              })
              .catch(err=>{
                  console.log(err)
              })
          }
      }
  }
  render() {
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
          <TouchableOpacity style={[ MainStyles.btn]} onPress={()=>{this.props.navigation.navigate('SignIn')}}>
            <Image source={require('../assets/e-btn.png')}  style={{width:'100%'}} resizeMode={'contain'}/>
          </TouchableOpacity>
          <View style = { MainStyles.minContainer } >
            <Image source={require('../assets/or.png')} style={[MainStyles.orImg,{width:'100%'}]} resizeMode={'contain'}/>
          </View>
          <TouchableOpacity style={[ MainStyles.btn]} onPress={()=>{this.props.navigation.navigate('SignUp')}}>
            <Image source={require('../assets/su-btn.png')} style={{width:'100%'}} resizeMode={'contain'}/>
          </TouchableOpacity>
      </View>
      );
  }
}
export default MainScreen
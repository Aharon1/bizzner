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
<<<<<<< HEAD
      // https://developer.linkedin.com/docs/oauth2
   
      // iOS (Required)
      // The "API Key" value generated when you registered your application.
=======
>>>>>>> MustafaCode
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
<<<<<<< HEAD
    this.setState({loading:false})
    this.props.navigation.navigate('Profile',userDetails);
    /*navigator.geolocation.getCurrentPosition(positions=>{
      let Latitude = positions.coords.latitude;
      let Longitude = positions.coords.longitude;
      var fetchData = 'http://bizzner.com/app?action=search_location_db&latitude='+Latitude+'&longitude='+Longitude;
      this.saveDetails('Latitude',''+Latitude+'');
      this.saveDetails('Longitude',''+Longitude+'');
      fetch(fetchData,{
          method:'POST',
          body:JSON.stringify({
              action:'search_location_db',
              latitude:Latitude,//22.7150822,
              longitude:Longitude//75.8707448
          })
      })
      .then(response=>{
          var bodyText = JSON.parse(response._bodyText);
          var results = bodyText.results
          const placesArray = [];
          for (const bodyKey in results){
              placesArray.push({
                  name:results[bodyKey].group_name,
                  address:results[bodyKey].group_address,
                  isStarted:results[bodyKey].group_status,
                  photoUrl:results[bodyKey].photoUrl,
                  key:'key-'+bodyKey,
                  place_id:results[bodyKey].place_id,
                  latitude:results[bodyKey].latitude,
                  longitude:results[bodyKey].longitude
              });
          }            
          this.props.navigation.navigate('Events',{locationList:placesArray});
          this.setState({loading:false});
      }).catch(err => {
        this.setState({loading:false});
        console.log('Error What is this',err);
      })
      
    },error=>{
      this.setState({loading:false});
      console.log('Error',error);
    })*/
  }
  async checkUser(){
    let isUserLoggedIn = await AsyncStorage.getItem('isUserLoggedin');
    if(isUserLoggedIn == 'true'){
      this.setState({
        loading: true
      });
      navigator.geolocation.getCurrentPosition(positions=>{
        let Latitude = positions.coords.latitude;
        let Longitude = positions.coords.longitude;
        var fetchData = 'http://dissdemo.biz/bizzler?action=search_location_db&latitude='+Latitude+'&longitude='+Longitude;
        fetch(fetchData,{
            method:'POST',
            body:JSON.stringify({
                action:'search_location_db',
                latitude:Latitude,//22.7150822,
                longitude:Longitude//75.8707448
            })
        })
        .then(response=>{
            var bodyText = JSON.parse(response._bodyText);
            const placesArray = [];
            for (const bodyKey in bodyText){
                placesArray.push({
                    name:bodyText[bodyKey].group_name,
                    address:bodyText[bodyKey].group_address,
                    isStarted:bodyText[bodyKey].group_status,
                    photoUrl:bodyText[bodyKey].photoUrl,
                    key:bodyKey
                });
            }            
            this.props.navigation.navigate('Events',{locationList:placesArray});
            this.setState({loading:false});
        }).catch(err => {
          this.setState({loading:false});
          console.log('Error What is this',err);
        })
        
      },error=>{
        this.setState({loading:false});
        console.log('Error',error);
      })
      
    }
=======
    this.setState({loading:false});
    console.log(userDetails);
    this.props.navigation.navigate('Profile',userDetails);
>>>>>>> MustafaCode
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
import React, { Component } from 'react';
import {SERVER_URL} from '../Constants';
import { Text, View, Image, TouchableOpacity, ScrollView,
  TextInput,KeyboardAvoidingView,Animated,ToastAndroid,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { DialogContent,SlideAnimation } from 'react-native-popup-dialog';
import ToggleSwitch from 'toggle-switch-react-native'
import Loader from './Loader';
import RequestPermssions from './AsyncModules/Permission';
import Permissions from 'react-native-permissions'
import PushNotification from 'react-native-push-notification';
class ProfileScreen extends Component{
    constructor(props){
      super(props);
      this.state = {
        loading:true,
        visible: false,
        firstName:'',
        lastName:'',
        emailAddress : '',
        location : '',
        headline : '',
        position : '',
        profilePicture : '',
        animation: new Animated.Value(30),
        gpsOn:true,
        pushOn:true
      };
    }
    componentDidMount(){
      this.get_usersDetails();
    }
    get_usersDetails = async ()=>{
      var UserID = await AsyncStorage.getItem('userID');
      this.setState({UserID});
      setTimeout(()=>{
        fetch(SERVER_URL+'?action=get_user_data&user_id='+UserID)
        .then(res=>res.json())
        .then(response=>{
          if(response.code == 200){
            var body = response.body;
            this.setState({
              loading:false,
              firstName:body.first_name,
              lastName:body.last_name,
              emailAddress : body.user_email,
              location : body.country,
              headline : body.headline,
              position : body.current_position,
              profilePicture : body.user_pic_thumb
            });
          }
          else{}
        })
      },200)
    }
    GoToNextScreen(){
      if(this.state.gpsOn){
        Permissions.check('location', { type: 'always' }).then(response => {
          console.log('location',response);
          if(response == "undetermined"){
            Permissions.request('location', { type: 'always' }).then(response => {
              console.log('location',response);
              if(response != 'authorized'){
                //ToastAndroid.showWithGravity('We can\'t fetch events near you!',ToastAndroid.SHORT,ToastAndroid.BOTTOM);
              }
              else{
              }
              this.setState({visible:false,loading:true});
              var fetchData = SERVER_URL+'?action=save_profile';
              fetch(fetchData,{
                  method:'POST',
              }).then(postResponse=>{
                  this.setState({loading:false})
                  this.props.navigation.navigate('Home');
              })
            })
          }
          else{
            this.setState({visible:false,loading:true});
              var fetchData = SERVER_URL+'?action=save_profile';
              fetch(fetchData,{
                  method:'POST',
              }).then(postResponse=>{
                  this.setState({loading:false})
                  this.props.navigation.navigate('Home');
              })
          }
        })
      }
      
      /*PushNotification.configure({
          onRegister: function(token) {
              console.log( 'TOKEN:', token );
          },
          onNotification: function(notification) {
              console.log( 'NOTIFICATION:', notification );
              notification.finish(PushNotificationIOS.FetchResult.NoData);
          },
          senderID: "71450108131",
          permissions: {
              alert: true,
              badge: true,
              sound: true
          },
          popInitialNotification: true,
          requestPermissions: true,
      });*/
      
    }
    getDetail(key){
      /*try{
        let value = await AsyncStorage.getItem('userDetails');
        return JSON.parse(value);
      }catch(error){
        alert(error);
      }*/
      const { navigation } = this.props;
      return navigation.getParam(key);
    }
    capturePhoto = async function(){
      if (this.useCamera) {
        const options = { quality: 1, base64: true };
        this.useCamera.capture({metadata:options}).then(res=>{
          console.log('Response',res);
        })
        //this.setState({ profilePicture: data.uri  });
      }
    }
    picPhoto = async function(){
      if(RequestPermssions.Camera()){
        

      }
    };
    togglePicOption = () => {
      
      this.setState((prevState) => {
        Animated.spring(this.state.animation, {
          toValue: prevState.isModalVisible ? 0 : 1,
        }).start()
        return {
          isModalVisible: !prevState.isModalVisible
        }
      })
    }
    render() {
      /*const userDetails = this.getDetail();
      console.log(userDetails);*/
      return (
        <View style={MainStyles.normalContainer}>
          <Loader loading={this.state.loading} />
          {/*Header Section*/}
          <View style={MainStyles.profileHeader}>
            {/*Header Profile Picture Section*/}
            <View style={MainStyles.pHeadPicWrapper}>
              <View style={MainStyles.pHeadPic}>
                {
                  this.state.profilePicture == ''
                  && 
                  <Image source={require('../assets/dummy.jpg')} style={{width:130,height:130}}/>
                }
                {
                  this.state.profilePicture != ''
                  && 
                  <Image source={{uri:this.state.profilePicture}} style={{width:130,height:130}}/>
                }
                
              </View>
              <View style={MainStyles.pHeadPicEditBtnWrapper}>
                
                <TouchableOpacity  style={MainStyles.pHeadPicEditBtn} onPress={this.togglePicOption}>
                  <Icon name="pencil" style={MainStyles.pHeadPicEditBtnI}/>
                </TouchableOpacity>
                <Animated.View style={[MainStyles.pHeadPicOptions,{
                  zIndex:500,
                    top: this.state.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 35]
                    })
                  }]}>
                  <TouchableOpacity style={MainStyles.pHPOBtn} onPress={this.picPhoto}>
                    <Text>Take a Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={MainStyles.pHPOBtn} onPress={()=>{alert('This');}}>
                    <Text>Pick Photo</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
            {/*Header Profile Name Section*/}
            <View style={MainStyles.profileTextWrapper}>
              <Text style={MainStyles.pTWText}>PROFILE</Text>
              <Text style={MainStyles.pTWNameText}>{this.state.firstName} {this.state.lastName}</Text>
            </View>
          </View>
          
          {/*Body Section*/}
          <ScrollView style={MainStyles.profileBody}>
            <KeyboardAvoidingView  style={{flex:1}}>
                <View style={MainStyles.inputFieldWithIcon}>
                  <Icon name="envelope" style={MainStyles.iFWIIcon}/>
                  <TextInput style={MainStyles.ifWITI} placeholder="Email" keyboardType="email-address" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.emailAddress}/>
                </View>
                <View style={MainStyles.inputFieldWithIcon}>
                  <Icon name="map-marker" style={MainStyles.iFWIIcon}/>
                  <TextInput style={MainStyles.ifWITI} placeholder="Country" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.location}/>
                </View>
                <View style={MainStyles.inputFieldWithIcon}>
                  <Icon name="adn" style={MainStyles.iFWIIcon}/>
                  <TextInput style={MainStyles.ifWITI} placeholder="Occupation" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.headline}/>
                </View>
                <View style={MainStyles.inputFieldWithIcon}>
                  <Icon name="briefcase" style={MainStyles.iFWIIcon}/>
                  <TextInput style={MainStyles.ifWITI} placeholder="Current position" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.position}/>
                </View>
              <View style={MainStyles.inputFieldWithIcon}>
                <Icon name="camera-retro" style={MainStyles.iFWIIcon}/>
                <TextInput style={MainStyles.ifWITI} placeholder="Interests" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                <TouchableOpacity style={MainStyles.iFWIPlus}>
                  <Icon name="plus-circle" style={MainStyles.ifWIPlusIcon}/>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            <View style={[MainStyles.btnWrapper,{flex:1,justifyContent:'flex-end',flexDirection: 'row'}]}>
              <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.setState({ visible: true });}}>
                <Text style={MainStyles.btnSaveText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Dialog
                visible={this.state.visible}
                dialogStyle={MainStyles.confirmPopup}
                dialogAnimation={new SlideAnimation()}
                dialogStyle={{width:300,padding:0}} 
                containerStyle={{zIndex: 10}}
                rounded={false}
            >
              <View style={[MainStyles.confirmPopupHeader,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                  <Text style={{color:'#8da6d5',fontFamily: 'Roboto-Medium',fontSize:16}}>Allow</Text>
                  <TouchableOpacity onPress={()=>{this.setState({visible:false})}}>
                      <Image source={require('../assets/close-icon.png')} style={{width:25,height:25}}/>
                  </TouchableOpacity>
              </View>
              <DialogContent style={{padding:0,borderWidth: 0,backgroundColor:'#d1dbed'}}>
                  <View style={MainStyles.confirmPopupContent}>
                      <View style={[MainStyles.cPCOption1,{paddingTop:20}]}>
                          <View>
                          <Text style={{fontSize:17,fontFamily:'Roboto-Light',color:'#03163a',maxWidth:100}}>Push notifications</Text>
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                              <View>
                              <Text style={{fontSize:17,fontFamily:'Roboto-Light',color:'#000',marginRight:10}}>NO</Text>
                              </View>
                              <ToggleSwitch
                                  isOn={this.state.pushOn}
                                  onColor='#39b54a'
                                  offColor='#8da6d5'
                                  onToggle={ (isOn) => {this.setState({pushOn:isOn})} }
                              />
                              <View>
                              <Text style={{fontSize:17,fontFamily:'Roboto-Light',color:'#000',marginLeft:10}}>YES</Text>
                              </View>
                          </View>
                      </View>
                      <View style={[MainStyles.cPCOption2]}>
                          <View>
                          <Text style={{fontSize:17,fontFamily:'Roboto-Light',color:'#03163a',maxWidth:100}}>GPS</Text>
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                              <Text style={{fontSize:17,fontFamily:'Roboto-Light',color:'#000',marginRight:10}}>NO</Text>
                              <ToggleSwitch
                                  isOn={this.state.gpsOn}
                                  onColor='#39b54a'
                                  offColor='#8da6d5'
                                  size='medium'
                                  onToggle={ (isOn) => {this.setState({gpsOn:isOn})} }
                              />
                              <Text style={{fontSize:16,fontFamily:'Roboto-Light',color:'#000',marginLeft:10}}>YES</Text>
                          </View>
                      </View>
                      <View style={{alignItems:'center',flexDirection:'row',alignContent:'center',justifyContent:"center"}}>
                          <View style={{width:230}}>
                              <Text style={{fontFamily:'Roboto-Regular',fontSize:16,color:'#03163a',alignItems:'center',justifyContent:'center'}}>
                              Note: <Text style={{fontFamily:'Roboto-Light',fontSize:16}}>Its important your location, Allow GPS location? Yes / No</Text>
                              </Text>
                          </View>
                      </View>
                      <View style={[MainStyles.btnWrapper,{justifyContent:'center',flexDirection: 'row'}]}>
                          <TouchableOpacity style={[MainStyles.btnSave,{marginBottom:0}]} onPress={()=>{this.GoToNextScreen()}}>
                              <Text style={MainStyles.btnSaveText}>Continue</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </DialogContent>
          </Dialog>
        </View>
      );
    }
  }
  export default ProfileScreen
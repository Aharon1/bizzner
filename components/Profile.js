import React, { Component } from 'react';
import {SERVER_URL} from '../Constants';
import { Text, View, Image, TouchableOpacity, ScrollView,
  TextInput,KeyboardAvoidingView,Animated,DeviceEventEmitter,
  AsyncStorage,SafeAreaView,ActionSheetIOS,Picker,Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { DialogContent,SlideAnimation } from 'react-native-popup-dialog';
import ToggleSwitch from 'toggle-switch-react-native'
import Loader from './Loader';
import RequestPermssions from './AsyncModules/Permission';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import PushNotification from 'react-native-push-notification';
import FormData from 'FormData';
import ImagePicker from 'react-native-image-picker';
import countryList from 'react-select-country-list';
class ProfileScreen extends Component{
  constructor(props){
    super(props);
    var cOptionsList = countryList().getLabels();
    cOptionsList.unshift('Cancel');
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
      interests:[],
      animation: new Animated.Value(30),
      gpsOn:true,
      pushOn:true,
      IShow:false,
      InterestsTags:[],
      usersInteretsIds:{},
      isOpenCamera:false,
      base64Image:'',
      CountryList:countryList().getLabels(),
      cOptions:cOptionsList
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
            profilePicture : body.originalPic,
            interests:body.interests,
            InterestsTags:response.interestTags,
            usersInteretsIds:response.usersInteretsIds
          });
        }
      })
    },200)
  }
  GoToNextScreen(){
    this.setState({visible:false,loading:false});
    this._saveProfile();
    /*if(this.state.gpsOn){
      Permissions.check('location', { type: 'always' }).then(response => {
        if(response == "undetermined"){
          Permissions.request('location', { type: 'always' }).then(response => {
            if(response != 'authorized'){
            }
            else{
            }
            this.setState({visible:false,loading:false});
            this._saveProfile();
          })
        }
        else{
          this.setState({visible:false,loading:false});
          this._saveProfile();
        }
      })
    }*/
    
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
  _saveProfile = ()=>{
    
    var interests = this.state.usersInteretsIds.join(',');
    var fetchData = SERVER_URL+'?action=save_profile';
    var params = '&ID='+this.state.UserID;
    params += '&first_name='+this.state.firstName;
    params += '&last_name='+this.state.lastName;
    params += '&user_email='+this.state.emailAddress;
    params += '&country='+this.state.location;
    params += '&headline='+this.state.headline;
    params += '&current_position='+this.state.position;
    params += '&interests='+encodeURIComponent(interests);
    params += '&notification_on='+this.state.pushOn;
    params += '&gps_on='+this.state.gpsOn;
    this.setState({loading:true});
    fetch(SERVER_URL+'/media-upload.php', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
        file:this.state.imageData,
        ID:this.state.UserID,
        first_name:this.state.firstName,
        last_name:this.state.lastName,
        user_email:this.state.emailAddress,
        country:this.state.location,
        headline:this.state.headline,
        current_position:this.state.position,
        interests:this.state.interests,
        notification_on:this.state.pushOn,
        gps_on:this.state.gpsOn,
      })
    }).then((res) => res.json())
    .then(response=>{
      console.log(response);
      Toast.show(response.message,Toast.SHORT);
      this.setState({loading:false});
      this.props.navigation.navigate('Current Events');
    })
    .catch(err=>{
      console.log(err)
    });/* (progressEvent) => {
      const progress = progressEvent.loaded / progressEvent.total;
      console.log(progress);
    })*/
    /*let data = new FormData();
    data.append('action', 'ADD');
    data.append('param', 0);
    data.append('secondParam', 0);
    data.append('file', new Blob([payload], { type: 'text/csv' }));*/
    // this works
    /*let request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      console.log(request);
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        console.log('success', request.responseText);
      } else {
        console.warn('error');
      }
    };
    request.open('POST', fetchData+params);
    request.send(formData);*/
    /*axios.post(fetchData+params,{
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      data:formData
    })
    .then(res=>{
      console.log(res.data);
    })*/
    /*this.setState({loading:true});
    fetch(fetchData+params,{
        method:'POST',
        headers: {
          //Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
    })
    .then(res=>res.json())
    .then(postResponse=>{
        Toast.show(postResponse.message,Toast.SHORT);
        this.setState({loading:false});
        this.props.navigation.navigate('Current Events');
    })
    .catch(err=>{
      console.log(err);
    })*/
  }
  capturePhoto = async function(){
    if (this.useCamera) {
      const options = { quality: 1, base64: true };
      this.useCamera.capture({metadata:options}).then(res=>{
      })
      //this.setState({ profilePicture: data.uri  });
    }
  }
  picPhoto = ()=>{
    //if(RequestPermssions.Camera()){
      var options = {
        maxWidth:1024,
        maxHeight:1024,
        mediaType:'photo',
        quality:1,
        allowsEditing:true,
        noData:false,
        storageOptions:{
          skipBackup:true,
          cameraRoll:false,
        }
      }
      ImagePicker.launchImageLibrary(options, (response) => {
        // Same code as in above section!
        if(!response.didCancel){
          this.setState({ imageData:{
            name:response.fileName,
            type:response.type,
            uri:response.path,
            base64:response.data,
            size:response.fileSize
            },profilePicture:response.uri  });
        }
        this.togglePicOption();
      });
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
  takePicture = async function() {
    var options = {
      maxWidth:1024,
      maxHeight:1024,
      mediaType:'photo',
      quality:1,
      allowsEditing:true,
      noData:false,
      storageOptions:{
        skipBackup:true,
        cameraRoll:false,
      }
    }
    ImagePicker.launchCamera(options, (response) => {
      console.log(response);
      // Same code as in above section!
      if(!response.didCancel){
        this.setState({ imageData:{
          name:response.fileName,
          type:response.type,
          uri:response.uri,
          base64:response.data,
          size:response.fileSize
        },profilePicture:response.uri  });
      }
    this.togglePicOption();
    });
  };
  selectTag = (item)=>{
    if(this.state.usersInteretsIds.indexOf(item.id) === -1){
        var selectedITs = this.state.usersInteretsIds;
        selectedITs.push(item.id);
        this.state.interests.push(item);
        this.setState({selectedITs})
    }
    else{
        var selectedITs = this.state.usersInteretsIds;
        selectedITs.splice(this.state.usersInteretsIds.indexOf(item.id),1);
        this.state.interests.filter((i,key)=>{
          if(i.id == item.id){
            delete this.state.interests[key];
          }
        });
        this.setState({selectedITs});
    }
  }
  pickerIos = ()=>{
    ActionSheetIOS.showActionSheetWithOptions({
        options: this.state.cOptions,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if(buttonIndex != 0){
          this.setState({location: this.state.cOptions[buttonIndex]})
        }
      });
  }
  render() {
    
    var behavior = (Platform.OS == 'ios')?'padding':'';
    return (
      <SafeAreaView style={MainStyles.normalContainer}>
        <Loader loading={this.state.loading} />
        {/*Header Section*/}
        <View style={MainStyles.profileHeader}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Current Events') } style={{position:'absolute',top:15,left:15}}>
              <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }}/>
          </TouchableOpacity>
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
              {/*
                this.state.base64Image != ''
                && 
                <Image source={require(this.state.profilePicture)} style={{width:130,height:130}}/>
              */}
            </View>
            <View style={MainStyles.pHeadPicEditBtnWrapper}>
              
              <TouchableOpacity  style={MainStyles.pHeadPicEditBtn} onPress={this.togglePicOption}>
                <Icon name="pencil" style={MainStyles.pHeadPicEditBtnI}/>
              </TouchableOpacity>
              <Animated.View style={[MainStyles.pHeadPicOptions,{
              zIndex:500000,
                top: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0]
                })
              }]}>
                <TouchableOpacity style={MainStyles.pHPOBtn} onPress={()=>{this.takePicture()}}>
                  <Text>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={MainStyles.pHPOBtn} onPress={()=>{this.picPhoto()}}>
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
        <KeyboardAvoidingView  style={{flex:1}} enabled behavior={behavior}>
          <ScrollView style={MainStyles.profileBody}>
          
              <View style={MainStyles.inputFieldWithIcon}>
                <Icon name="envelope" style={MainStyles.iFWIIcon}/>
                <TextInput style={MainStyles.ifWITI} placeholder="Email" keyboardType="email-address" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.emailAddress}/>
              </View>
              <View style={MainStyles.inputFieldWithIcon}>
                <Icon name="map-marker" style={MainStyles.iFWIIcon}/>
                
                {
                    Platform.OS == 'android' && 
                    <Picker
                    selectedValue={this.state.location}
                    style={MainStyles.cEFWIPF}
                    textStyle={{fontSize: 17,fontFamily:'Roboto-Light'}}
                    itemTextStyle= {{
                        fontSize: 17,fontFamily:'Roboto-Light',
                    }}
                    itemStyle={[MainStyles.cEFWIPF,{fontSize: 18,fontFamily:'Roboto-Light'}]}
                    onValueChange={(itemValue, itemIndex) => this.setState({location: itemValue})}>
                        <Picker.Item label="Choose " value="" />
                        {
                          this.state.CountryList.map(item=>{
                            return (
                              <Picker.Item key={'key-'+item} label={item} value={item} />
                            )
                          })
                        }
                    </Picker>
                }
                {
                    Platform.OS == 'ios' && 
                    <TouchableOpacity style={[MainStyles.cEFWITF,{alignItems:'center'}]} onPress={()=>{this.pickerIos()}}>
                        <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.location}</Text>
                    </TouchableOpacity>
                    
                }
                {/* <TextInput style={MainStyles.ifWITI} placeholder="Country" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.location}/> */}
              </View>
              <View style={MainStyles.inputFieldWithIcon}>
                <Icon name="adn" style={MainStyles.iFWIIcon}/>
                <TextInput style={MainStyles.ifWITI} placeholder="Occupation" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.headline} onChangeText={(text)=>{this.setState({headline:text})}}/>
              </View>
              <View style={MainStyles.inputFieldWithIcon}>
                <Icon name="briefcase" style={MainStyles.iFWIIcon}/>
                <TextInput style={MainStyles.ifWITI} placeholder="Current position" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.position} onChangeText={(text)=>{this.setState({position:text})}}/>
              </View>
              <View style={MainStyles.inputFieldWithIcon}>
                <Icon name="camera-retro" style={MainStyles.iFWIIcon}/>
                {
                  this.state.interests.length == 0 && 
                  <TextInput style={MainStyles.ifWITI} placeholder="Interests" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                }
                {
                  this.state.interests.length > 0 && 
                  <View style={{
                  flex:9,
                  flexDirection:'row',
                  flexWrap:'wrap',
                  alignItems:'center',
                  justifyContent:'flex-start'
                  }}>
                    {
                      this.state.interests.map((item,key)=>(
                        <View key = { key } style={{
                          backgroundColor:'#0846b8',
                          paddingVertical:5,
                          paddingHorizontal:10,
                          borderColor:'#0846b8',
                          borderRadius:30,
                          borderWidth:1,
                          textAlign:"center",
                          margin:2,
                          justifyContent:'center',
                          flexDirection:'row'
                          }}>
                          <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',fontSize:13}}>{item.tag_name}</Text> 
                          <TouchableOpacity style={{
                            justifyContent:'center',
                            marginLeft:4
                          }}
                          onPress={()=>{
                            var selectedITs = this.state.usersInteretsIds;
                            selectedITs.splice(this.state.usersInteretsIds.indexOf(item.id),1);
                            this.setState({selectedITs});
                            this.state.interests.filter((i,key)=>{
                              if(i.id == item.id){
                                delete this.state.interests[key];
                              }
                            });
                          }}
                          >
                            <Icon name="times" color="#FFF"/>
                          </TouchableOpacity>
                        </View>
                      ))
                    }
                </View>
              }
              <TouchableOpacity style={MainStyles.iFWIPlus} onPress={()=>{this.setState({IShow:true})}}>
                <Icon name="plus-circle" style={MainStyles.ifWIPlusIcon}/>
              </TouchableOpacity>
            </View>
          
            <View style={[MainStyles.btnWrapper,{flex:1,justifyContent:'flex-end',flexDirection: 'row'}]}>
              <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.GoToNextScreen();}}>
                <Text style={MainStyles.btnSaveText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
        <Dialog
              visible={this.state.IShow}
              dialogStyle={MainStyles.confirmPopup}
              dialogAnimation={new SlideAnimation()}
              dialogStyle={{width:320,padding:0}} 
              containerStyle={{zIndex: 10}}
              rounded={true}
        >
            <View style={[MainStyles.confirmPopupHeader,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                <Text style={{color:'#8da6d5',fontFamily: 'Roboto-Medium',fontSize:16}}>Add Interests</Text>
                <TouchableOpacity onPress={()=>{this.setState({IShow:false})}}>
                    <Image source={require('../assets/close-icon.png')} style={{width:25,height:25}}/>
                </TouchableOpacity>
            </View>
            <DialogContent style={{padding:0,borderWidth: 0,backgroundColor:'#d1dbed'}}>
              <View style={MainStyles.confirmPopupContent}>
              <ScrollView style={MainStyles.tagsContent} contentContainerStyle={{
                  justifyContent:"center",
                  alignItems:'center',
              }}>
                  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'center'}}>
                      {
                          this.state.InterestsTags.map(( item, key ) =>
                          {
                            var isSelected = this.state.usersInteretsIds.filter(p =>p === item.id);
                            return(
                              <TouchableOpacity key = { key } style={[
                                  MainStyles.InterestsTags,
                                  (isSelected.length>0)?{backgroundColor:'#0846b8'}:''
                              ]} onPress={()=>{this.selectTag(item)}}>
                                  <Text style={[
                                      MainStyles.ITText,
                                      (isSelected.length>0)?{color:'#FFF'}:''
                                  ]}>{item.tag_name}</Text>
                              </TouchableOpacity>
                          )})
                      }
                  </View>
                  <TouchableOpacity style={{
                      backgroundColor:'#3a6cc7',
                      padding:15,
                      marginTop:15,
                      borderRadius:50,
                  }} onPress={this.loadMoreTags}>
                      <Icon name="chevron-down" style={{color:'#FFF'}} size={15}/>
                  </TouchableOpacity>
                  <View style={{
                      marginTop:30
                  }}>
                      <TouchableOpacity style={{
                          paddingVertical:10,
                          paddingHorizontal:20,
                          backgroundColor:'#0947b9',
                          borderRadius:50
                      }}
                      onPress={()=>{
                          this.setState({IShow:false});
                      }}
                      >
                          <Text style={{
                              fontSize:18,
                              color:'#FFF',
                              fontFamily:'Roboto-Regular'
                          }}>ADD</Text>
                      </TouchableOpacity>
                  </View>
              </ScrollView>
              </View>
            </DialogContent>
        </Dialog>
        
      </SafeAreaView>
    );
  }
}
export default ProfileScreen
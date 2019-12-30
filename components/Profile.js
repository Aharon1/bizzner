import React, { Component } from 'react';
import { SERVER_URL, btnShadow } from '../Constants';
import {
  Text, View, Image, TouchableOpacity, ScrollView,
  TextInput, KeyboardAvoidingView, Animated, DeviceEventEmitter,
  ActionSheetIOS, Picker, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { DialogContent, SlideAnimation } from 'react-native-popup-dialog';
import ToggleSwitch from 'toggle-switch-react-native';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import countryList from 'react-select-country-list';
import HardText from '../HardText';
import { loadingChange } from '../Actions';
import { connect } from 'react-redux';
import Axios from 'axios';
const options = {
  title: 'Select Profile Picture',
  takePhotoButtonTitle: HardText.r_take_photo,
  chooseFromLibraryButtonTitle: HardText.r_pick_photo,
  maxWidth: 500,
  maxHeight: 500,
  mediaType: 'photo',
  quality: 1,
  allowsEditing: true,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    var cOptionsList = countryList().getLabels();
    cOptionsList.unshift('Cancel');
    this.state = {
      loading: true,
      visible: false,
      firstName: '',
      lastName: '',
      emailAddress: '',
      location: '',
      headline: '',
      position: '',
      profilePicture: '',
      interests: [],
      animation: new Animated.Value(30),
      gpsOn: true,
      pushOn: true,
      IShow: false,
      InterestsTags: [],
      usersInteretsIds: {},
      isOpenCamera: false,
      base64Image: '',
      CountryList: countryList().getLabels(),
      cOptions: cOptionsList,
      renderedListData: [],
      userID: this.props.reducer.userData
    };
  }
  componentDidMount() {
    this.props.loadingChangeAction(true);
    this.get_usersDetails();
  }
  get_usersDetails = async () => {
    await Axios.get(`${SERVER_URL}?action=get_user_data&user_id=${this.state.userID}`)
      .then(res => {
        let { code, body, message, interestTags, usersInteretsIds } = res.data;
        if (code == 200) {
          this.setState({
            loading: false,
            firstName: body.first_name,
            lastName: body.last_name,
            emailAddress: body.user_email,
            location: body.country,
            headline: body.headline,
            position: body.current_position,
            profilePicture: body.user_pic_full,
            interests: body.interests,
            InterestsTags: interestTags,
            usersInteretsIds: usersInteretsIds
          });
        }
        this.props.loadingChangeAction(false);
      }).catch(err => {
        setTimeout(() => {
          Toast.show(err.message, Toast.SHORT);
        }, 200);
        this.props.loadingChangeAction(false);
      })
  }
  GoToNextScreen() {
    this.setState({ visible: false }, () => {
      this._saveProfile();
    });
  }
  _saveProfile = () => {
    this.props.loadingChangeAction(true);
    let {imageData,userID,firstName,lastName,emailAddress,location,headline,position,pushOn,gpsOn,usersInteretsIds} = this.state;
    let interests = usersInteretsIds.join(',');
    Axios(`${SERVER_URL}/media-upload.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'default',
      data: {
        file: imageData,
        ID: userID,
        first_name: firstName,
        last_name: lastName,
        user_email: emailAddress,
        country: location,
        headline: headline,
        current_position: position,
        interests: interests,
        notification_on: pushOn,
        gps_on: gpsOn,
      }
    })
      .then(res => {
        console.log(res.data);
        let {message} = res.data;
        Toast.show(message, Toast.SHORT);
        this.props.loadingChangeAction(false);
        //this.props.navigation.navigate('Current Events');
      })
      .catch(err => {
        setTimeout(() => {
          Toast.show(err.message, Toast.SHORT);
        }, 200);
        this.props.loadingChangeAction(false);
      });
  }
  capturePhoto = async function () {
    if (this.useCamera) {
      const options = { quality: 1, base64: true };
      this.useCamera.capture({ metadata: options }).then(res => {
      })
    }
  }
  picPhoto = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        //Toast.show('User cancelled image picker', Toast.SHORT);
      } else if (response.error) {
        Toast.show(response.error, Toast.SHORT);
      } else if (response.customButton) {
        Toast.show(response.customButton, Toast.SHORT);
      } else {
        this.setState({
          imageData: {
            name: response.fileName,
            type: response.type,
            uri: response.path,
            base64: response.data,
            size: response.fileSize
          }, profilePicture: response.uri
        });
      }
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
  takePicture = async function () {
    var options = {
      maxWidth: 1024,
      maxHeight: 1024,
      mediaType: 'photo',
      quality: 1,
      allowsEditing: true,
      noData: false,
      storageOptions: {
        skipBackup: true,
        cameraRoll: false,
      }
    }
    ImagePicker.launchCamera(options, (response) => {
      // Same code as in above section!
      if (!response.didCancel) {
        this.setState({
          imageData: {
            name: response.fileName,
            type: response.type,
            uri: response.uri,
            base64: response.data,
            size: response.fileSize
          }, profilePicture: response.uri
        });
      }
      this.togglePicOption();
    });
  };
  selectTag = (item) => {
    let {usersInteretsIds,interests} = this.state;
    if (usersInteretsIds.indexOf(item.id) === -1) {
      var selectedITs = usersInteretsIds;
      selectedITs.push(item.id);
      interests.push(item);
      this.setState({ selectedITs })
    }
    else {
      var selectedITs = usersInteretsIds;
      selectedITs.splice(usersInteretsIds.indexOf(item.id), 1);
      interests.filter((i, key) => {
        if (i.id == item.id) {
          delete interests[key];
        }
      });
      this.setState({ selectedITs });
    }
  }
  pickerIos = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: this.state.cOptions,
      cancelButtonIndex: 0,
    },
      (buttonIndex) => {
        if (buttonIndex != 0) {
          this.setState({ location: this.state.cOptions[buttonIndex] })
        }
      });
  }
  searchInterest = (keyword) => {
    if (keyword.length > 0) {
      let text = keyword.toLowerCase()
      let fullList = this.state.InterestsTags;
      let filteredList = fullList.filter((item) => { // search from a full list, and not from a previous search results list
        if (item.tag_name.toLowerCase().match(text))
          return item;
      })
      if (!text || text === '') {
        this.setState({
          renderedListData: fullList,
          noFilterData: false,
        })
      } else if (!filteredList.length) {
        // set no data flag to true so as to render flatlist conditionally
        this.setState({
          noFilterData: true
        })
      }
      else if (Array.isArray(filteredList)) {
        this.setState({
          noFilterData: false,
          renderedListData: filteredList
        })
      }
    }
    else {
      this.setState({
        renderedListData: []
      })
    }
  }
  render() {

    var behavior = (Platform.OS == 'ios') ? 'padding' : '';
    return (
      <View style={MainStyles.normalContainer}>
        {/*Header Section*/}
        <View style={MainStyles.profileHeader}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Current Events')} style={{ position: 'absolute', top: 15, left: 15 }}>
            <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }} />
          </TouchableOpacity>
          {/*Header Profile Picture Section*/}
          <View style={MainStyles.pHeadPicWrapper}>
            <View style={MainStyles.pHeadPic}>
              {
                this.state.profilePicture == ''
                &&
                <Image source={require('../assets/dummy.jpg')} style={{ width: 130, height: 130 }} />
              }
              {
                this.state.profilePicture != ''
                &&
                <Image source={{ uri: this.state.profilePicture }} style={{ width: 130, height: 130 }} />
              }
              {/*
                this.state.base64Image != ''
                && 
                <Image source={require(this.state.profilePicture)} style={{width:130,height:130}}/>
              */}
            </View>
            <View style={MainStyles.pHeadPicEditBtnWrapper}>

              <TouchableOpacity style={MainStyles.pHeadPicEditBtn} onPress={this.picPhoto}>
                <Icon name="pencil" style={MainStyles.pHeadPicEditBtnI} />
              </TouchableOpacity>
              {/*Header Profile Name Section*/}
              <View style={MainStyles.profileTextWrapper}>
                <Text style={MainStyles.pTWText}>{HardText.profile}</Text>
                <Text style={MainStyles.pTWNameText}>{this.state.firstName} {this.state.lastName}</Text>
              </View>
              <Animated.View style={[MainStyles.pHeadPicOptions, {
                zIndex: 500000,
                top: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [650, 0]
                })
              }]}>
                <TouchableOpacity style={MainStyles.pHPOBtn} onPress={() => { this.takePicture() }}>
                  <Text>{HardText.take_photo}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={MainStyles.pHPOBtn} onPress={() => { this.picPhoto() }}>
                  <Text>{HardText.pick_photo}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

        </View>
        {/*Body Section*/}
        <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior={behavior}>
          <ScrollView style={MainStyles.profileBody}>

            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="envelope" style={MainStyles.iFWIIcon} />
              <TextInput style={MainStyles.ifWITI} placeholder="Email" keyboardType="email-address" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.emailAddress} />
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="map-marker" style={MainStyles.iFWIIcon} />

              {
                Platform.OS == 'android' &&
                <Picker
                  selectedValue={this.state.location}
                  style={MainStyles.cEFWIPF}
                  textStyle={{ fontSize: 17, fontFamily: 'Roboto-Light' }}
                  itemTextStyle={{
                    fontSize: 17, fontFamily: 'Roboto-Light',
                  }}
                  itemStyle={[MainStyles.cEFWIPF, { fontSize: 18, fontFamily: 'Roboto-Light' }]}
                  onValueChange={(itemValue, itemIndex) => this.setState({ location: itemValue })}>
                  <Picker.Item label="Choose " value="" />
                  {
                    this.state.CountryList.map(item => {
                      return (
                        <Picker.Item key={'key-' + item} label={item} value={item} />
                      )
                    })
                  }
                </Picker>
              }
              {
                Platform.OS == 'ios' &&
                <TouchableOpacity style={[MainStyles.cEFWITF, { alignItems: 'center' }]} onPress={() => { this.pickerIos() }}>
                  <Text style={{ color: '#03163a', fontFamily: 'Roboto-Light', fontSize: 18 }}>{this.state.location}</Text>
                </TouchableOpacity>

              }
              {/* <TextInput style={MainStyles.ifWITI} placeholder="Country" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.location}/> */}
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="adn" style={MainStyles.iFWIIcon} />
              <TextInput style={MainStyles.ifWITI} placeholder="Occupation" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.headline} onChangeText={(text) => { this.setState({ headline: text }) }} />
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="briefcase" style={MainStyles.iFWIIcon} />
              <TextInput style={MainStyles.ifWITI} placeholder="Current position" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.position} onChangeText={(text) => { this.setState({ position: text }) }} />
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="camera-retro" style={MainStyles.iFWIIcon} />
              {
                this.state.interests.length == 0 &&
                <TextInput style={MainStyles.ifWITI} placeholder="Interests" placeholderTextColor="#03163a" underlineColorAndroid="transparent" />
              }
              {
                this.state.interests.length > 0 &&
                <View style={{
                  flex: 9,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                  {
                    this.state.interests.map((item, key) => (
                      <View key={key} style={{
                        backgroundColor: '#0846b8',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderColor: '#0846b8',
                        borderRadius: 30,
                        borderWidth: 1,
                        textAlign: "center",
                        margin: 2,
                        justifyContent: 'center',
                        flexDirection: 'row'
                      }}>
                        <Text style={{ color: '#FFF', fontFamily: 'Roboto-Regular', fontSize: 13 }}>{item.tag_name}</Text>
                        <TouchableOpacity style={{
                          justifyContent: 'center',
                          marginLeft: 4
                        }}
                          onPress={() => {
                            var selectedITs = this.state.usersInteretsIds;
                            selectedITs.splice(this.state.usersInteretsIds.indexOf(item.id), 1);
                            this.setState({ selectedITs });
                            this.state.interests.filter((i, key) => {
                              if (i.id == item.id) {
                                delete this.state.interests[key];
                              }
                            });
                          }}
                        >
                          <Icon name="times" color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    ))
                  }
                </View>
              }
              <TouchableOpacity style={MainStyles.iFWIPlus} onPress={() => { this.setState({ IShow: true }) }}>
                <Icon name="plus-circle" style={MainStyles.ifWIPlusIcon} />
              </TouchableOpacity>
            </View>

            <View style={[MainStyles.btnWrapper, { flex: 1, }]}>
              <TouchableOpacity style={[MainStyles.btnSave,{...btnShadow}]} onPress={() => { this.GoToNextScreen(); }}>
                <Text style={MainStyles.btnSaveText}>{HardText.save}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Dialog
          visible={this.state.visible}
          dialogStyle={MainStyles.confirmPopup}
          dialogAnimation={new SlideAnimation()}
          dialogStyle={{ width: 300, padding: 0 }}
          containerStyle={{ zIndex: 10 }}
          rounded={false}
        >
          <View style={[MainStyles.confirmPopupHeader, { alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }]}>
            <Text style={{ color: '#8da6d5', fontFamily: 'Roboto-Medium', fontSize: 16 }}>Allow</Text>
            <TouchableOpacity onPress={() => { this.setState({ visible: false }) }}>
              <Image source={require('../assets/close-icon.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </View>
          <DialogContent style={{ padding: 0, borderWidth: 0, backgroundColor: '#d1dbed' }}>
            <View style={MainStyles.confirmPopupContent}>
              <View style={[MainStyles.cPCOption1, { paddingTop: 20 }]}>
                <View>
                  <Text style={{ fontSize: 17, fontFamily: 'Roboto-Light', color: '#03163a', maxWidth: 100 }}>Push notifications</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Roboto-Light', color: '#000', marginRight: 10 }}>NO</Text>
                  </View>
                  <ToggleSwitch
                    isOn={this.state.pushOn}
                    onColor='#39b54a'
                    offColor='#8da6d5'
                    onToggle={(isOn) => { this.setState({ pushOn: isOn }) }}
                  />
                  <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Roboto-Light', color: '#000', marginLeft: 10 }}>YES</Text>
                  </View>
                </View>
              </View>
              <View style={[MainStyles.cPCOption2]}>
                <View>
                  <Text style={{ fontSize: 17, fontFamily: 'Roboto-Light', color: '#03163a', maxWidth: 100 }}>GPS</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 17, fontFamily: 'Roboto-Light', color: '#000', marginRight: 10 }}>NO</Text>
                  <ToggleSwitch
                    isOn={this.state.gpsOn}
                    onColor='#39b54a'
                    offColor='#8da6d5'
                    size='medium'
                    onToggle={(isOn) => { this.setState({ gpsOn: isOn }) }}
                  />
                  <Text style={{ fontSize: 16, fontFamily: 'Roboto-Light', color: '#000', marginLeft: 10 }}>YES</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', flexDirection: 'row', alignContent: 'center', justifyContent: "center" }}>
                <View style={{ width: 230 }}>
                  <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16, color: '#03163a', alignItems: 'center', justifyContent: 'center' }}>
                    Note: <Text style={{ fontFamily: 'Roboto-Light', fontSize: 16 }}>Its important your location, Allow GPS location? Yes / No</Text>
                  </Text>
                </View>
              </View>
              <View style={[MainStyles.btnWrapper, { justifyContent: 'center', flexDirection: 'row' }]}>
                <TouchableOpacity style={[MainStyles.btnSave, { marginBottom: 0 }]} onPress={() => { this.GoToNextScreen() }}>
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
          dialogStyle={{ width: 320, padding: 0 }}
          containerStyle={{ zIndex: 10 }}
          rounded={true}
        >
          <View style={[MainStyles.confirmPopupHeader, { alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }]}>
            <Text style={{ color: '#8da6d5', fontFamily: 'Roboto-Medium', fontSize: 16 }}>{HardText.add_interests}</Text>
            <TouchableOpacity onPress={() => { this.setState({ IShow: false, renderedListData: [] }) }}>
              <Image source={require('../assets/close-icon.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </View>
          <DialogContent style={{ padding: 0, borderWidth: 0, backgroundColor: '#d1dbed' }}>
            <View style={MainStyles.confirmPopupContent}>
              <View style={[MainStyles.tagsContent, {
                justifyContent: "center",
                alignItems: 'center',
              }]} >
                <TextInput style={{
                  height: 40,
                  width: '100%',
                  fontSize: 16,
                  textAlign: 'left',
                  paddingHorizontal: 15,
                  paddingVertical: 0,
                  fontFamily: 'Roboto-Light',
                  borderColor: '#0846b8',
                  borderWidth: 1,
                  marginBottom: 15,
                  borderRadius: 20
                }} placeholder="Search Interests..." placeholderTextColor="#0846b8" keyboardType="web-search"
                  ref={input => this.searchInput = input}
                  onChangeText={text => { this.searchInterest(text) }} />
                <View style={{ maxHeight: 250 }}>
                  <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                    {
                      this.state.renderedListData.length < 1 &&
                      this.state.InterestsTags.map((item, key) => {
                        var isSelected = this.state.usersInteretsIds.filter(p => p === item.id);
                        return (
                          <TouchableOpacity key={key} style={[
                            MainStyles.InterestsTags,
                            (isSelected.length > 0) ? { backgroundColor: '#0846b8' } : ''
                          ]} onPress={() => { this.selectTag(item) }}>
                            <Text style={[
                              MainStyles.ITText,
                              (isSelected.length > 0) ? { color: '#FFF' } : ''
                            ]}>{item.tag_name}</Text>
                          </TouchableOpacity>
                        )
                      }
                      )
                    }
                    {
                      this.state.renderedListData.length > 0 &&
                      this.state.renderedListData.map((item, key) => {
                        var isSelected = this.state.usersInteretsIds.filter(p => p === item.id);
                        return (
                          <TouchableOpacity key={key} style={[
                            MainStyles.InterestsTags,
                            (isSelected.length > 0) ? { backgroundColor: '#0846b8' } : ''
                          ]} onPress={() => { this.selectTag(item) }}>
                            <Text style={[
                              MainStyles.ITText,
                              (isSelected.length > 0) ? { color: '#FFF' } : ''
                            ]}>{item.tag_name}</Text>
                          </TouchableOpacity>
                        )
                      }
                      )
                    }
                  </ScrollView>
                </View>
                {/* <TouchableOpacity style={{
                      backgroundColor:'#3a6cc7',
                      padding:15,
                      marginTop:15,
                      borderRadius:50,
                  }} onPress={this.loadMoreTags}>
                      <Icon name="chevron-down" style={{color:'#FFF'}} size={15}/>
                  </TouchableOpacity> */}
                <View style={{
                  marginTop: 30
                }}>
                  <TouchableOpacity style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#0947b9',
                    borderRadius: 50,
                    ...btnShadow
                  }}
                    onPress={() => {
                      this.setState({ IShow: false });
                    }}
                  >
                    <Text style={{
                      fontSize: 18,
                      color: '#FFF',
                      fontFamily: 'Roboto-Regular'
                    }}>{HardText.add}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </DialogContent>
        </Dialog>

      </View>
    );
  }
}
const mapStateToProps = (state) => {
  const { reducer } = state
  return { reducer }
};
const mapDispatchToProps = dispatch => ({
  loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
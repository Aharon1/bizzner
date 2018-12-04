import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { DialogContent,ScaleAnimation } from 'react-native-popup-dialog';
import ToggleSwitch from 'toggle-switch-react-native'
class ProfileScreen extends Component{
    state = {
        visible: false
      };
    GoToNextScreen(){
      this.setState({visible:false});
      this.props.navigation.navigate('Events');
    }
    render() {
      return (
        <View style={MainStyles.normalContainer}>
          {/*Header Section*/}
          <View style={MainStyles.profileHeader}>
          {/*Header Profile Picture Section*/}
          <View style={MainStyles.pHeadPicWrapper}>
            <View style={MainStyles.pHeadPic}>
              <Image source={require('../assets/profile-pic.png')} style={{width:130,height:130}}/>
            </View>
            <View style={MainStyles.pHeadPicEditBtnWrapper}>
              <TouchableOpacity  style={MainStyles.pHeadPicEditBtn}>
                <Icon name="pencil" style={MainStyles.pHeadPicEditBtnI}/>
              </TouchableOpacity>
            </View>
           </View>
          {/*Header Profile Name Section*/}
          <View style={MainStyles.profileTextWrapper}>
            <Text style={MainStyles.pTWText}>PROFILE</Text>
            <Text style={MainStyles.pTWNameText}>John Yanushpolski</Text>
          </View>
         </View>
          {/*Body Section*/}
          <ScrollView style={MainStyles.profileBody}>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="envelope" style={MainStyles.iFWIIcon}/>
              <TextInput style={MainStyles.ifWITI} placeholder="Email" keyboardType="email-address" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="map-marker" style={MainStyles.iFWIIcon}/>
              <TextInput style={MainStyles.ifWITI} placeholder="Country" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="adn" style={MainStyles.iFWIIcon}/>
              <TextInput style={MainStyles.ifWITI} placeholder="Occupation" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="briefcase" style={MainStyles.iFWIIcon}/>
              <TextInput style={MainStyles.ifWITI} placeholder="Current position" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
            </View>
            <View style={MainStyles.inputFieldWithIcon}>
              <Icon name="camera-retro" style={MainStyles.iFWIIcon}/>
              <TextInput style={MainStyles.ifWITI} placeholder="Interests" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
              <TouchableOpacity style={MainStyles.iFWIPlus}>
                <Icon name="plus-circle" style={MainStyles.ifWIPlusIcon}/>
              </TouchableOpacity>
            </View>
            <View style={[MainStyles.btnWrapper,{flex:1,justifyContent:'flex-end',flexDirection: 'row'}]}>
              <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.setState({ visible: true });}}>
                <Text style={MainStyles.btnSaveText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Dialog
                visible={this.state.visible}
                dialogStyle={MainStyles.confirmPopup}
                dialogAnimation={new ScaleAnimation()}
                dialogStyle={{width:300,padding:0}} 
                containerStyle={{zIndex: 10}}
                rounded={false}
            >
                <View style={[MainStyles.confirmPopupHeader,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                    <Text style={{color:'#8da6d5',fontFamily: 'RobotMedium',fontSize:16}}>Allow</Text>
                    <TouchableOpacity onPress={()=>{this.setState({visible:false})}}>
                        <Image source={require('../assets/close-icon.png')} style={{width:25,height:25}}/>
                    </TouchableOpacity>
                </View>
                <DialogContent style={{padding:0,borderWidth: 0,backgroundColor:'#d1dbed'}}>
                    <View style={MainStyles.confirmPopupContent}>
                        <View style={[MainStyles.cPCOption1,{paddingTop:20}]}>
                            <View>
                            <Text style={{fontSize:17,fontFamily:'RobotoLight',color:'#03163a',maxWidth:100}}>Push notifications</Text>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <View>
                                <Text style={{fontSize:17,fontFamily:'RobotoLight',color:'#000',marginRight:10}}>NO</Text>
                                </View>
                                <ToggleSwitch
                                    isOn={true}
                                    onColor='#39b54a'
                                    offColor='#8da6d5'
                                    onToggle={ (isOn) => {} }
                                />
                                <View>
                                <Text style={{fontSize:17,fontFamily:'RobotoLight',color:'#000',marginLeft:10}}>YES</Text>
                                </View>
                            </View>
                       </View>
                        <View style={[MainStyles.cPCOption2]}>
                            <View>
                            <Text style={{fontSize:17,fontFamily:'RobotoLight',color:'#03163a',maxWidth:100}}>GPS</Text>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={{fontSize:17,fontFamily:'RobotoLight',color:'#000',marginRight:10}}>NO</Text>
                                <ToggleSwitch
                                    isOn={false}
                                    onColor='#39b54a'
                                    offColor='#8da6d5'
                                    size='medium'
                                    onToggle={ (isOn) => {} }
                                />
                                <Text style={{fontSize:16,fontFamily:'RobotoLight',color:'#000',marginLeft:10}}>YES</Text>
                            </View>
                       </View>
                        <View style={{alignItems:'center',flexDirection:'row',alignContent:'center',justifyContent:"center"}}>
                            <View style={{width:230}}>
                                <Text style={{fontFamily:'RobotoRegular',fontSize:16,color:'#03163a',alignItems:'center',justifyContent:'center'}}>
                                Note: <Text style={{fontFamily:'RobotoLight',fontSize:16}}>Its important your location, Allow GPS location? Yes / No</Text>
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
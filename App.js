/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './components/StyleSheet';
import { createStackNavigator,createAppContainer   } from 'react-navigation';

class MainScreen extends Component {
    static navigationOptions =
    {
      header:null
      //title: 'Home',
    };
    render() {
      const {navigate} = this.props.navigation;
      return ( 
        <View style = { MainStyles.container } >
          <View style = {[MainStyles.minContainer,{width:250}]} >
            <Image source={require('./assets/bizzner-logo.png')} style={{width:213,height:55}}/>
            <Text style={MainStyles.mPHeading}> Your daily dose of inspiring people to meet </Text> 
          </View>
            <TouchableOpacity style={[ MainStyles.btn, MainStyles.linBtn]} onPress={() =>navigate('Profile')}>
              <Image source={require('./assets/l-btn.png')} style={[{width:'100%'}]} resizeMode={'contain'}/>
            </TouchableOpacity>
            <TouchableOpacity style={[ MainStyles.btn]}>
              <Image source={require('./assets/e-btn.png')}  style={{width:'100%'}} resizeMode={'contain'}/>
            </TouchableOpacity>
            <View style = { MainStyles.minContainer } >
              <Image source={require('./assets/or.png')} style={[MainStyles.orImg,{width:'100%'}]} resizeMode={'contain'}/>
            </View>
            <TouchableOpacity style={[ MainStyles.btn]}>
              <Image source={require('./assets/su-btn.png')} style={{width:'100%'}} resizeMode={'contain'}/>
            </TouchableOpacity>
        </View>
        );
    }
}
/*Profile App */
class ProfileScreen extends Component{
  render() {
    return (
      <View style={MainStyles.normalContainer}>
        {/*Header Section*/}
        <View style={MainStyles.profileHeader}>
        {/*Header Profile Picture Section*/}
        <View style={MainStyles.pHeadPicWrapper}>
          <View style={MainStyles.pHeadPic}>
            <Image source={require('./assets/profile-pic.png')} style={{width:130,height:130}}/>
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
            <TouchableOpacity style={MainStyles.btnSave}>
              <Text style={MainStyles.btnSaveText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const NavigateScreens = createStackNavigator ({
  Home:{screen:MainScreen},
  Profile:{screen:ProfileScreen}
  },{
  navigationOptions:{
    header:null
  }
});
const AppContainer = createAppContainer(NavigateScreens);
class BizznerApp extends Component{
  render(){
    return <AppContainer />;
  }
} 
export default BizznerApp;
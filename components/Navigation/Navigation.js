/**
 * Bizzner App
 * http://bizzner.com
 *
 * @format
 * @flow
 */
import React from 'react';
import { ScrollView, TouchableOpacity,View,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import { SettingsScreen, ComplainScreen, CurrentEventsScreen, HistoryScreen, EditProfileScreen, MessagesScreen, LogoutScreen } from './Screens';
import MainScreen from '../Main';
import SplashScreen from '../Splash';
import EventDetail from '../singleScreens/EventDetail';
import EventChatScreen from '../singleScreens/EventChatScreen';
import PrivateChatScreen from '../singleScreens/PrivateChat';
import SignUp from '../SignScreen/SignUp';
import ConfirmScreen from '../SignScreen/ConfirmScreen';
import SignIn from '../SignScreen/SignIn';
import ForgotPassword from '../SignScreen/ForgotPassword';
import Interests from '../Interests';
import EventChatListScreen from '../singleScreens/EventsChatList';
import HistoryEventDetails from '../singleScreens/HistoryEventDetails';
import CreateEvent from '../CreateEvent';
const drawerItemStyle = { 
    borderBottomWidth: 1, 
    borderBottomColor: '#8da6d5', 
    height: 60, 
    textAlign: 'left' 
};
const drawerLabelStyle = { 
    margin: 0, 
    fontSize: 15, 
    fontFamily: 'Roboto-Medium',
    paddingHorizontal:20
};
const Drawer = createDrawerNavigator({
    ['Current Events']: {
        screen: CurrentEventsScreen
    },
    ['Profile']: {
        screen: EditProfileScreen,
    },
    ['History']: {
        screen: HistoryScreen
    },
    [`Complain`]: {
        screen: ComplainScreen,
    },
    /*[`Settings`]: {
        screen: SettingsScreen,
    },*/
    [`Logout`]: {
        screen:LogoutScreen
    },
    
},
    {
        initialRouteName: 'Current Events',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        drawerWidth: 250,
        contentComponent: props =>
            <SafeAreaView>
            <ScrollView style={{marginTop:10,padding:0}}>
                <TouchableOpacity style={{ paddingLeft: 20,justifyContent:'flex-end' }} onPress={props.navigation.closeDrawer}>
                    <Icon name="bars" style={{ fontSize: 20, color: '#8da6d5' }} />
                </TouchableOpacity>
                <DrawerItems
                    {...props}
                    itemStyle={drawerItemStyle}
                    inactiveTintColor={'#3d6cba'}
                    itemsContainerStyle={{ paddingHorizontal: 0 }}
                    labelStyle={drawerLabelStyle}
                    iconContainerStyle={{ marginHorizontal: 0, marginLeft: 16 }}
                    activeBackgroundColor={'#fff'}
                />

            </ScrollView>
            </SafeAreaView>
});
const shadow = {
    shadowColor: '#000', shadowRadius: 5, shadowOpacity: 0.6, shadowOffset: {
        width: 5, height: 0
    }
}
const Navigation = createStackNavigator({
    Auth: {
        screen: MainScreen
    },
    Home: {
        screen: Drawer,
    },
    ['Messages']: {
        screen: MessagesScreen
    },
    Profile: {
        screen: EditProfileScreen,
    },
    Splash: {
        screen: SplashScreen
    },
    SignUp:{
        screen:SignUp
    },
    ConfirmScreen:{
        screen:ConfirmScreen
    },
    SignIn:{
        screen:SignIn
    },
    ForgotPassword:{
        screen:ForgotPassword
    },
    InterestsScreen:{
        screen:Interests
    },
    HistoryEventDetails:{
        screen:HistoryEventDetails
    },
    ['EventDetail']:{
        screen:EventDetail
    },
    ['Event Chat']:{
        screen:EventChatScreen
    },
    ['Private Chat']:{
        screen:PrivateChatScreen
    },
    EventChatList:{
        screen:EventChatListScreen
    },
    CreateEvent:{
        screen:CreateEvent
    }
}, {
    headerMode: 'none',
    initialRouteName: 'Splash',
    containerOptions: {
        style: {
            backgroundColor: '#f00',
            flex: 1

            }
        }
    });
export default Navigation;
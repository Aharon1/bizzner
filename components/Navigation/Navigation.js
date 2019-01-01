/**
 * Bizzner App
 * http://bizzner.com
 *
 * @format
 * @flow
 */
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import { SettingsScreen, ComplainScreen, CurrentEventsScreen, HistoryScreen, EditProfileScreen, MessagesScreen, LogoutScreen } from './Screens';
import MainScreen from '../Main';
import SplashScreen from '../Splash';
import EventDetail from '../singleScreens/EventDetail';
import EventChatScreen from '../singleScreens/EventChatScreen';
const drawerItemStyle = { borderBottomWidth: 1, borderBottomColor: '#f3f3f3', height: 60, textAlign: 'left' };
const drawerLabelStyle = { margin: 0, fontSize: 15, fontFamily: 'Roboto-Medium' };
const Drawer = createDrawerNavigator({
    ['CURRENT EVENTS']: {
        screen: CurrentEventsScreen
    },
    ['MESSAGES']: {
        screen: MessagesScreen
    },
    ['PROFILE']: {
        screen: EditProfileScreen,
    },
    ['HISTORY']: {
        screen: HistoryScreen
    },
    [`COMPLAIN`]: {
        screen: ComplainScreen,
    },
    [`SETTINGS`]: {
        screen: SettingsScreen,
    },
    [`LOGOUT`]: {
        screen:LogoutScreen
    },
    ['EventDetail']:{
        screen:EventDetail
    },
    ['Event Chat']:{
        screen:EventChatScreen
    },
},
    {
        initialRouteName: 'CURRENT EVENTS',
        overlayColor: 'rgba(0, 0, 0, 0.2)',
        drawerWidth: 280,
        contentComponent: props =>
            <ScrollView>
                <TouchableOpacity style={{ paddingLeft: 12 }} onPress={props.navigation.closeDrawer}>
                    <Icon name="bars" style={{ fontSize: 18, color: '#8da6d5' }} />
                </TouchableOpacity>
                <DrawerItems
                    {...props}
                    itemStyle={drawerItemStyle}
                    inactiveTintColor={'#3d6cba'}
                    itemsContainerStyle={{ paddingHorizontal: 20 }}
                    labelStyle={drawerLabelStyle}
                    iconContainerStyle={{ marginHorizontal: 0, marginRight: 16 }}
                    activeBackgroundColor={'#fff'}
                />

            </ScrollView>
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
    Profile: {
        screen: EditProfileScreen,
    },
    Splash: {
        screen: SplashScreen
    },

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
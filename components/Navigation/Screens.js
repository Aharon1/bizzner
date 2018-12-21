/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import MainScreen from '../Main';
import ProfileScreen from '../Profile';
import EventsScreen from '../Events';
import Logout from '../AsyncModules/Logout';


function createEmptyScreen(label, icon) {
    return class extends React.Component {
        static navigationOptions = {
            drawerLabel: label,
            drawerIcon: () => (
                <Icon name={icon} solid={true} style={{ fontSize: 20, color: '#86a7d6' }} />
            )
        };
        render() {
            return <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}><Text>{label}</Text></View>;
        }
    }
}

function createScreen(label, icon, Component) {
    return class extends React.Component {
        static navigationOptions = {
            drawerLabel: label,
            drawerIcon: () => (
                <Icon name={icon} style={{ fontSize: 20, color: '#86a7d6' }} />
            )
        };
        render() {
            return <Component {...this.props} />;
        }
    }
}

export const SettingsScreen = createEmptyScreen('SETTINGS', 'cog');
export const ComplainScreen = createEmptyScreen('COMPLAIN', 'pen');
export const HistoryScreen = createEmptyScreen('EVENTS HISTORY', 'history')
export const EditProfileScreen = createScreen('EDIT PROFILE', 'user', ProfileScreen);
export const MessagesScreen = createEmptyScreen('PRIVATE MESSAGES', 'comment');
export const CurrentEventsScreen = createScreen('CURRENT EVENTS', 'calendar-check', EventsScreen);
export const LogoutScreen = createScreen('LOGOUT', 'sign-out-alt', Logout);

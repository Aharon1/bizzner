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

export const SettingsScreen = createEmptyScreen('Settings', 'cog');
export const ComplainScreen = createEmptyScreen('Complain', 'pen');
export const HistoryScreen = createEmptyScreen('Events History', 'history')
export const EditProfileScreen = createScreen('Edit Profile', 'user', ProfileScreen);
export const MessagesScreen = createEmptyScreen('Private Messages', 'comment');
export const CurrentEventsScreen = createScreen('Current Events', 'calendar-check', EventsScreen);
export const LogoutScreen = createScreen('Logout', 'sign-out-alt', Logout);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View,SafeAreaView } from 'react-native';
import ProfileScreen from '../Profile';
import EventsScreen from '../Events';
import Logout from '../AsyncModules/Logout';
import PrivateMsgScreen from '../PrivateMsg';
import HistoryPageScreen from '../History';
import ComplainPageScreen from '../Complain';
import HardText from '../../HardText';

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

function createScreen(label, icon, Component,title) {    
    return class extends React.Component {
        static navigationOptions = ({ navigation }) =>  {
            const { params } = navigation.state;
            return {
                title:title,
                headerTitle:title,
                drawerLabel: ()=>{
                    if(label == 'Private Messages'){
                        return (<SafeAreaView style={{
                            flexDirection:'row',
                            alignItems:'center'
                        }}>
                            <Text style={{
                                margin: 0, 
                                fontSize: 15, 
                                fontFamily: 'Roboto-Medium',
                                paddingHorizontal:20,
                                color:'#3d6cba'
                            }}>{label}</Text>
                            {
                                params && params.privateCount > 0 && 
                                <Text style={{
                                    color:'#FFF',
                                    fontFamily:'Roboto-Medium',
                                    fontSize:12,
                                    backgroundColor:'#5cc06c',
                                    width:25,
                                    height:25,
                                    textAlign:'center',
                                    textAlignVertical:'center',
                                    borderRadius:100
                                }}>{params.privateCount}</Text>
                            }       
                        </SafeAreaView >)
                    }
                    else{
                        return label
                    }
                },
                drawerIcon: () => (
                    <Icon name={icon} style={{ fontSize: 20, color: '#86a7d6' }} />
                )
            }
        };
        render() {
            return <Component {...this.props} />;
        }
    }
}

export const SettingsScreen = createEmptyScreen('Settings', 'cog');
export const ComplainScreen = createScreen(HardText.m_complain, 'pen',ComplainPageScreen,HardText.complain);
export const HistoryScreen = createScreen(HardText.m_events_history, 'history',HistoryPageScreen,HardText.events_history);
export const EditProfileScreen = createScreen(HardText.m_edit_profile, 'user', ProfileScreen);
export const MessagesScreen = createScreen('Private Messages', 'comment',PrivateMsgScreen);
export const CurrentEventsScreen = createScreen(HardText.m_curr_events, 'calendar-check', EventsScreen,HardText.events);
export const LogoutScreen = createScreen(HardText.m_logout, 'sign-out-alt', Logout);


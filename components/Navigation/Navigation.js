/**
 * Bizzner App
 * http://bizzner.com
 *
 * @format
 * @flow
 */
import React from 'react';
import { ScrollView, TouchableOpacity, View, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createAppContainer,getActiveChildNavigationOptions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerActions, DrawerItems } from 'react-navigation-drawer';
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
import { COLORS } from '../../Constants';
import HardText from '../../HardText';
const drawerItemStyle = {
    borderBottomWidth: 1,
    borderBottomColor: '#8da6d5',
    paddingVertical: 14,
    textAlign: 'left'
};
const drawerLabelStyle = {
    margin: 0,
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    paddingHorizontal: 15
};
const Drawer = createDrawerNavigator({
    ['Current Events']: {
        screen: CurrentEventsScreen
    },
    Profile: {
        screen: EditProfileScreen,
        navigationOptions: {
            header: null
        },
    },
    History: {
        screen: HistoryScreen
    },
    Complain: {
        screen: ComplainScreen,
    },
    Logout: {
        screen: LogoutScreen,
        navigationOptions: {
            header: null
        },
    },

},
    {
        initialRouteName: 'Current Events',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        drawerWidth: 250,
        contentComponent: props =>
            <SafeAreaView>
                <ScrollView style={{ marginTop: 10, padding: 0 }}>
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
        screen: MainScreen,
    },
    Home: {
        screen: Drawer,
        navigationOptions: ({ navigation,screenProps }) => {
            return {
                //headerTitle: HardText.events,
                ...getActiveChildNavigationOptions(navigation,screenProps),
                headerTintColor: COLORS.headerText,
                headerLeft: (
                    <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }}>
                        <Icon name="bars" style={{ fontSize: 24, color: COLORS.headerText }} />
                    </TouchableOpacity>
                ),
                headerTitleStyle: {
                    fontSize: 14,
                    marginLeft: 0,
                    paddingLeft: 0
                }
            }
        },
    },
    ['Messages']: {
        screen: MessagesScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: HardText.chat_list,
        }),
    },
    Profile: {
        screen: EditProfileScreen,
    },
    Splash: {
        screen: SplashScreen,
        navigationOptions: {
            header: null
        },
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        },
    },
    ConfirmScreen: {
        screen: ConfirmScreen
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            headerBackTitle: 'SIGN IN',
            headerTitle: 'SIGN IN',
        }
    },
    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: {
            headerBackTitle: 'FORGOT PASSWORD',
            headerTitle: 'FORGOT PASSWORD',
        }
    },
    InterestsScreen: {
        screen: Interests
    },
    HistoryEventDetails: {
        screen: HistoryEventDetails,
        navigationOptions: ({ navigation }) => ({
            headerTitle: HardText.event_details,
        }),
    },
    ['EventDetail']: {
        screen: EventDetail,
        navigationOptions: ({ navigation }) => ({
            headerTitle: HardText.event_details,
        }),
    },
    ['Event Chat']: {
        screen: EventChatScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: HardText.event_chat,
        }),
    },
    ['Private Chat']: {
        screen: PrivateChatScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: HardText.chat_list,
        }),
    },
    EventChatList: {
        screen: EventChatListScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: HardText.chat_private_chat,
        }),
    },
    CreateEvent: {
        screen: CreateEvent,
        navigationOptions: ({ navigation }) => ({
            headerTitle: HardText.create_event,
            headerLeft: (
                <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => { navigation.goBack() }}>
                    <Icon name="times" style={{ fontSize: 22, color: COLORS.headerText }} />
                </TouchableOpacity>
            ),
            headerTitleStyle: {
                fontSize: 14,
                marginLeft: 0,
                paddingLeft: 0
            }
        }),
    }
}, {
    //headerMode: 'none',
    initialRouteName: 'Splash',
    containerOptions: {
        style: {
            backgroundColor: '#f00',
            flex: 1
        }
    },
    defaultNavigationOptions: ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: COLORS.headerColor,
            },
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                    <Icon name="chevron-left" size={23} style={{ color: COLORS.headerText }} />
                </TouchableOpacity>
            ),
            headerRight: (
                <View style={{ marginRight: 15 }}>
                    <Image source={require('../../assets/bizzner-white-icon.png')} style={{ width: 30, height: 33 }} />
                </View>
            ),
            headerTintColor: COLORS.headerText,
            headerTitleStyle: {
                fontSize: 14,
                marginLeft: 0,
                paddingLeft: 0
            }
        }
    }
});
export default createAppContainer(Navigation);
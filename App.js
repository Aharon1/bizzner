/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

import { createAppContainer } from 'react-navigation';

import Navigation from './components/Navigation/Navigation'
import PushNotification from 'react-native-push-notification';
const AppContainer = createAppContainer(Navigation);
class BizznerApp extends Component {
  componentWillMount(){
      PushNotification.configure({
        onNotification: function(notification) {
            console.log('NOTIFICATION:', notification );
            //notification.finish(PushNotificationIOS.FetchResult.NoData);
            PushNotification.setApplicationIconBadgeNumber(parseInt(notification.badge));
        },
        senderID: "71450108131",
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },
        popInitialNotification: true,
        requestPermissions: true,
    });
    //PushNotification.setApplicationIconBadgeNumber(4);
  }
  render() {
    return <AppContainer />;
  }
}
export default BizznerApp;
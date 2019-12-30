import React, { Component } from 'react';
import { View, Image, Linking, Platform, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { checkAuthentication } from '../Actions';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../Constants';
import Axios from 'axios';
class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false }
        this.backButtonListener = null;
        this.currentRouteName = 'Splash';
        this.lastBackButtonPress = null;
    }
    componentDidMount() { // B
        Linking.getInitialURL().then(url => {
            this.checkToken(url)
        });
        return true;
        if (Platform.OS == 'android') {
            this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', (event) => {
            });
            Linking.getInitialURL().then(url => {
                this.checkToken(url)
            });
        }
        else {
            var linkingListner = Linking.addListener('url', this.handleOpenURL);
            console.log(linkingListner);
            if (!linkingListner.context) {
                this.authenticateSession()
            }
        }
    }
    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL = (event) => {
        this.checkToken(event.url);
    }
    checkToken = (url) => {
        if (url) {
            var fullUrl = url.split('/');
            var tokenString = fullUrl[fullUrl.length - 2];
            if (tokenString == 'token') {
                var token = fullUrl[fullUrl.length - 1];
                Axios.get(`${SERVER_URL}?action=check-token&token=${token}`)
                    .then( async res => {
                        let {code,message,body} = res.data;
                        if (code == 200) {
                            await AsyncStorage.multiSet([["isUserLoggedin","true"],["userID",`${body.ID}`]])
                            .then(res=>{
                                this.props.checkAuth({ authorized: true, userID: body.ID });
                                Toast.show(message, Toast.SHORT);
                                setTimeout(()=>{
                                    this.props.navigation.navigate('ConfirmScreen');
                                },100);
                            })
                        }
                        else {
                            Toast.show(message, Toast.SHORT);
                            this.authenticateSession();
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            else if (tokenString == 'event') {
                var eventId = fullUrl[fullUrl.length - 1];
                Axios.get(`${SERVER_URL}?action=event_details&event_id=${eventId}`)
                    .then(res => {
                        let {code,message,body} = res.data;
                        if (code == 200) {
                            const location = [+body.group_lng, +body.group_lat];
                            this.props.navigation.navigate('EventDetail', { event_id: eventId, location });
                        }
                        else if (code == 404) {
                            Toast.show(message, Toast.SHORT);
                            this.props.navigation.navigate('Current Events');
                        }
                    });

            }
            else {
                this.authenticateSession();
            }
        }
        else {
            this.authenticateSession();
        }
    }
    authenticateSession = async () => {
        const { navigation } = this.props;
        await AsyncStorage.multiGet(['isUserLoggedIn', 'userID']).then(async (res) => {
            if (res[0][1] == "true") {
                if (res[1][1] != "") {
                    let uD = JSON.parse(res[1][1]);
                    this.props.checkAuth({ authorized: true, userData: uD });
                    setTimeout(() => {
                        navigation.navigate('Home');
                    }, 100);
                    return true;
                }
            }
            navigation.navigate('Auth');
        });
        
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/bizzner-logo.png')} style={{ height: 72 }} />
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    checkAuth: (dataSet) => dispatch(checkAuthentication(dataSet)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
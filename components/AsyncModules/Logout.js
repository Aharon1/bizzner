import React, { Component } from 'react';
import { View, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER_URL } from '../../Constants';
import { loadingChange, LogoutAction } from '../../Actions';
import { connect } from 'react-redux';
import Toast from "react-native-simple-toast";
import Axios from 'axios';
class Logout extends Component {
    constructor(props) {
        super(props);
    }
    async saveDetails(key, value) {
        await AsyncStorage.setItem(key, value);
    }
    getToken = (onToken) => {
        this.logoutFromServer();
    }
    authenticateSession() {
        this.getToken();
    }
    logoutFromServer(token) {
        Axios(`${SERVER_URL}?action=logout&user_id=${this.props.reducer.userID}&device_token=`)
            .then(res => {
                setTimeout(async () => {
                    await AsyncStorage.multiSet([['isUserLoggedIn', ""], ['userData', ""]]).then(async () => {
                        this.props.loadingChangeAction(false);
                        this.props.LogoutUser();
                        this.props.navigation.navigate('Auth');
                    });
                }, 1000);
            }).catch(err => {
                Toast.show(err.message,Toast.SHORT);
                this.props.loadingChangeAction(false);
            });
    }
    async componentDidMount() {
        this.props.loadingChangeAction(true);
        this.authenticateSession();
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/bizzner-logo.png')} style={{ height: 72 }} />
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet)),
    LogoutUser: () => dispatch(LogoutAction()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Logout);
import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity, Image, ScrollView,
    TextInput, KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL, COLORS,btnShadow } from '../../Constants';
import { actionUserSignIn,loadingChange } from '../../Actions';
import Axios from 'axios';
import firebase from 'react-native-firebase';
import HardText from '../../HardText';
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            emailAddress: '',
            password: '',
        }
        this.signIn = this._signIn.bind(this);
    }
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            Alert.alert('Please give permission for notifications');
            this.props.loadingChangeAction(false);
        }
    }
    async saveDetails(key, value) {
        await AsyncStorage.setItem(key, value);
    }
    async getToken(){
        await firebase.messaging().getToken().then(async fcmToken => {
            if (fcmToken) {
                this.sendDataToServer(fcmToken);
            }
            else{
                this.sendDataToServer('');
            }
        }).catch(err=>{
            this.props.loadingChangeAction(false);
        });
    }
    _signIn = () => {
        var deviceToken = '';
        if (this.state.emailAddress == '') {
            Toast.show('Email address should not be blank', Toast.SHORT)
            return false;
        }
        if (this.state.password == '') {
            Toast.show('Password should not be blank', Toast.SHORT)
            return false;
        }
        this.props.loadingChangeAction(true);
        this.getToken(this.sendDataToServer.bind(this));
    }
    async sendDataToServer(token) {
        let {emailAddress, password} = this.state;
        await Axios.get(`${SERVER_URL}?action=login_user&lg_email=${emailAddress}&lg_pass=${password}&device_token=${token}&platform=${Platform.OS}`)
            .then(async res => {
                let { code, message, body } = res.data;
                if (code == 200) {
                    try {
                        setTimeout(() => { Toast.show(message, Toast.SHORT); }, 200);
                        this.props.LoginUserAction(body.ID,token);
                        await AsyncStorage.multiSet([['isUserLoggedIn', "true"], ["userData", body.ID],["userToken",token]]).then(() => {
                            this.props.navigation.navigate('Current Events');
                            this.props.loadingChangeAction(false);
                        });
                    }
                    catch (e) {
                        setTimeout(() => { Toast.show("Asyncstorage Reducer Saving Time", Toast.LONG); }, 200);
                        this.props.loadingChangeAction(false);
                    }
                    this.saveDetails('isUserLoggedin', 'true');
                    this.saveDetails('userID', body.ID);
                    Toast.show('LoggedIn successfully', Toast.SHORT);
                    setTimeout(() => {
                        this.props.loadingChangeAction(false);
                        this.props.navigation.navigate('Current Events');
                    }, 1500)
                }
                else {
                    Toast.show(message, Toast.SHORT);
                    this.props.loadingChangeAction(false);
                }
            })
            .catch(err => {
                setTimeout(() => { Toast.show(err.message, Toast.SHORT); }, 300);
                this.props.loadingChangeAction(false);
            });
    }
    render() {
        return (
            <KeyboardAvoidingView contentContainerStyle={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ marginVertical: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{marginBottom: 30,fontFamily: 'Roboto-Light',fontSize: 21,color: '#0947b9',textAlign: 'center'}}>{HardText.s_signin_text}</Text>
                    <View style={styles.InputWrapper}>
                        <Icon name="envelope" style={{
                            color: COLORS.Secondary,
                            fontSize: 18,
                            width: 35,
                            height: 40,
                            paddingTop: 10,
                        }} />
                        <TextInput
                            style={styles.InputStyle}
                            placeholder="Email *"
                            returnKeyType={"next"}
                            ref={(input) => { this.emailAddress = input; }}
                            onSubmitEditing={() => { this.password.focus(); }}
                            blurOnSubmit={false}
                            onChangeText={(text) => this.setState({ emailAddress: text })}
                            keyboardType="email-address"
                            autoCapitalize='none'
                            placeholderTextColor="#03163a"
                            underlineColorAndroid="transparent"
                            value={this.state.emailAddress}
                        />
                    </View>
                    <View style={styles.InputWrapper}>
                        <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{ paddingTop: 10, marginRight: 10 }} />
                        <TextInput
                            style={styles.InputStyle}
                            placeholder="Password *"
                            returnKeyType={"go"}
                            secureTextEntry={true}
                            ref={(input) => { this.password = input; }}
                            blurOnSubmit={false}
                            onChangeText={(text) => this.setState({ password: text })}
                            placeholderTextColor="#03163a"
                            underlineColorAndroid="transparent"
                            value={this.state.password}
                        />
                    </View>
                    <View style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginBottom: 20
                    }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ForgotPassword') }}>
                            <Text style={{
                                fontFamily: 'Roboto-Medium',
                                fontSize: 14,
                                color: '#0947b9',
                            }}>
                                {HardText.s_forgot_pass}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={[MainStyles.btnSave,{...btnShadow}]} onPress={this.signIn}>
                            <Text style={MainStyles.btnSaveText}>
                                {HardText.s_login}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    InputWrapper: {
        borderBottomColor: '#8da6d4',
        borderBottomWidth: 1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
        marginBottom: 20,
        width: '75%'
    },
    InputStyle:{
        textAlign: 'left', 
        alignItems: 'center', 
        paddingRight: 10,
        fontSize: 18, 
        fontFamily: 'Roboto-Light',
        flex:1
    }
});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoginUserAction: (userData) => dispatch(actionUserSignIn(userData)),
    loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
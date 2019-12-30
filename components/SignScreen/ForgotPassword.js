import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity, Image,
    TextInput, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL,btnShadow } from '../../Constants';
import { loadingChange } from '../../Actions';
import { connect } from 'react-redux';
import HardText from '../../HardText';
import Axios from 'axios';
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            emailAddress: '',
            isTokenSent: false,
            fpToken: '',
            fpTokenInserted: false,
        }
        this.forgotPass = this._forgotPass.bind(this);
        this.checkToken = this._checkToken.bind(this);
        this.resetPass = this._resetPass.bind(this);
    }
    _forgotPass = () => {
        if (this.state.emailAddress == '') {
            Toast.show('Email address should not be blank', Toast.LONG)
            return false;
        }
        this.props.loadingChangeAction(true);
        Axios.get(`${SERVER_URL}?action=forgot_password&fp_email=${this.state.emailAddress}`)
            .then(res => {
                let {code,message} = res.data;
                if (code == 200) {
                    this.setState({ isTokenSent: true });
                }
                setTimeout(()=>{Toast.show(message, Toast.SHORT);},300);
                this.props.loadingChangeAction(false);
            })
            .catch(err => {
                setTimeout(()=>{Toast.show(err.message, Toast.SHORT);},300);
                this.props.loadingChangeAction(false);
            })
    }
    _checkToken = () => {
        if (this.state.fpToken == '') {
            Toast.show('Token should not be blank', Toast.SHORT);
            return false;
        }
        this.props.loadingChangeAction(true);
        Axios.get(`${SERVER_URL}?action=fptoken_check&token=${this.state.fpToken}`)
            .then(res => {
                let {code,message} = res.data;
                if (code == 200) {
                    this.setState({ fpTokenInserted: true });
                }
                this.props.loadingChangeAction(false);
                setTimeout(()=>{Toast.show(message, Toast.SHORT);},300);
            }).catch(err=>{
                this.props.loadingChangeAction(false);
                setTimeout(()=>{Toast.show(err.message, Toast.SHORT);},300);
            })
    }
    _resetPass = () => {
        if (this.state.newPass == '') {
            Toast.show('Password should not be empty', Toast.SHORT);
            return false;
        }
        if (this.state.confirmNewPass == '') {
            Toast.show('Confirm password should not be empty', Toast.SHORT);
            return false;
        }
        if (this.state.newPass != this.state.confirmNewPass) {
            Toast.show('Password & confirm password should be same', Toast.SHORT);
            return false;
        }
        this.props.loadingChangeAction(true);
        Axios.get(`${SERVER_URL}?action=reset_password&token=${this.state.fpToken}&fp_reset_password=${this.state.newPass}`)
            .then(res => {
                let {code,message} = res.data;
                this.props.loadingChangeAction(false);
                if (code == 200) {
                    this.setState({ isTokenSent: false, fpToken: '', fpTokenInserted: false });
                    this.props.navigation.navigate('SignIn');
                }
                setTimeout(()=>{Toast.show(message, Toast.SHORT);},300);
            })
            .catch(err => {
                setTimeout(()=>{Toast.show(err.message, Toast.SHORT);},300);
                this.props.loadingChangeAction(false);
            })
    }
    render() {
        let behavior = Platform.OS == 'ios'?'padding':'';
        return (
            <View style={{ backgroundColor: '#FFF', flex: 1 }}>
                <KeyboardAvoidingView contentContainerStyle={{flex: 1}} behavior={behavior}>
                    <ScrollView contentContainerStyle={{justifyContent: 'center',alignItems: 'center',marginVertical:20}} keyboardShouldPersistTaps="always" keyboardDismissMode="interactive">
                        {
                            this.state.isTokenSent == true && this.state.fpTokenInserted == false &&
                            <View style={{ width: '75%' }}>
                                <Text style={{
                                    marginBottom: 30,
                                    fontFamily: 'Roboto-Light',
                                    fontSize: 21,
                                    color: '#0947b9',
                                    textAlign: 'center'
                                }}>Token</Text>
                                <View style={{
                                    borderBottomColor: '#8da6d4',
                                    borderBottomWidth: 1,
                                    overflow: 'visible',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignContent: 'flex-start',
                                    marginBottom: 30,
                                    paddingBottom: 5,
                                }}>
                                    <Icon name="tag" style={{
                                        color: '#6789c6',
                                        fontSize: 18,
                                        width: 35,
                                        height: 40,
                                        paddingTop: 10,
                                    }} />
                                    <TextInput
                                        style={{ flex: 1, textAlign: 'left', alignItems: 'center', paddingRight: 10, height: 40, fontSize: 18, fontFamily: 'Roboto-Light' }}
                                        placeholder="Token *"
                                        onChangeText={(text) => this.setState({ fpToken: text })}
                                        autoCapitalize='none'
                                        keyboardType='number-pad'
                                        placeholderTextColor="#03163a"
                                        underlineColorAndroid="transparent"
                                        value={this.state.fpToken}
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity style={MainStyles.btnSave} onPress={this.checkToken}>
                                        <Text style={MainStyles.btnSaveText}>
                                            VERIFY TOKEN
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {
                            this.state.isTokenSent == true && this.state.fpTokenInserted == true
                            &&
                            <View style={{ width: '75%' }}>
                                <Text style={{
                                    marginBottom: 30,
                                    fontFamily: 'Roboto-Light',
                                    fontSize: 21,
                                    color: '#0947b9',
                                    textAlign: 'center'
                                }}>Reset Password</Text>
                                <View style={{
                                    borderBottomColor: '#8da6d4',
                                    borderBottomWidth: 1,
                                    overflow: 'visible',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignContent: 'flex-start',
                                    marginBottom: 30,
                                    paddingBottom: 5,
                                }}>
                                    <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{ paddingTop: 10, marginRight: 10 }} />
                                    <TextInput
                                        style={{ flex: 1, textAlign: 'left', alignItems: 'center', paddingRight: 10, height: 40, fontSize: 18, fontFamily: 'Roboto-Light' }}
                                        placeholder="New Password *"
                                        returnKeyType={"next"}
                                        ref={(input) => { this.newPass = input; }}
                                        onSubmitEditing={() => { this.confirmNewPass.focus(); }}
                                        blurOnSubmit={false}
                                        onChangeText={(text) => this.setState({ newPass: text })}
                                        secureTextEntry={true}
                                        autoCapitalize='none'
                                        placeholderTextColor="#03163a"
                                        underlineColorAndroid="transparent"
                                        value={this.state.newPass}
                                    />
                                </View>
                                <View style={{
                                    borderBottomColor: '#8da6d4',
                                    borderBottomWidth: 1,
                                    overflow: 'visible',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignContent: 'flex-start',
                                    marginBottom: 30,
                                    paddingBottom: 5,
                                }}>
                                    <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{ paddingTop: 10, marginRight: 10 }} />
                                    <TextInput
                                        style={{ flex: 1, textAlign: 'left', alignItems: 'center', paddingRight: 10, height: 40, fontSize: 18, fontFamily: 'Roboto-Light' }}
                                        placeholder="Confirm New Password *"
                                        returnKeyType={"next"}
                                        ref={(input) => { this.confirmNewPass = input; }}
                                        onChangeText={(text) => this.setState({ confirmNewPass: text })}
                                        secureTextEntry={true}
                                        autoCapitalize='none'
                                        placeholderTextColor="#03163a"
                                        underlineColorAndroid="transparent"
                                        value={this.state.confirmNewPass}
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity style={MainStyles.btnSave} onPress={this.resetPass}>
                                        <Text style={MainStyles.btnSaveText}>
                                            CHANGE PASSWORD
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {
                            this.state.isTokenSent == false && this.state.fpToken == '' && this.state.fpTokenInserted == false &&
                            <View style={{ width: '75%' }}>
                                <Text style={{
                                    marginBottom: 30,
                                    fontFamily: 'Roboto-Light',
                                    fontSize: 21,
                                    color: '#0947b9',
                                    textAlign: 'center'
                                }}>Forgot Passwrod?</Text>
                                <View style={{
                                    borderBottomColor: '#8da6d4',
                                    borderBottomWidth: 1,
                                    overflow: 'visible',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignContent: 'flex-start',
                                    marginBottom: 30,
                                    paddingBottom: 5,
                                }}>
                                    <Icon name="envelope" style={{
                                        color: '#6789c6',
                                        fontSize: 18,
                                        width: 35,
                                        height: 40,
                                        paddingTop: 10,
                                    }} />
                                    <TextInput
                                        style={{ flex: 1, textAlign: 'left', alignItems: 'center', paddingRight: 10, height: 40, fontSize: 18, fontFamily: 'Roboto-Light' }}
                                        placeholder="Email *"
                                        returnKeyType={"next"}
                                        ref={(input) => { this.emailAddress = input; }}
                                        onSubmitEditing={() => { this.country.focus(); }}
                                        blurOnSubmit={false}
                                        onChangeText={(text) => this.setState({ emailAddress: text })}
                                        keyboardType="email-address"
                                        autoCapitalize='none'
                                        placeholderTextColor="#03163a"
                                        underlineColorAndroid="transparent"
                                        value={this.state.emailAddress}
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity style={[MainStyles.btnSave,{...btnShadow}]} onPress={this.forgotPass}>
                                        <Text style={MainStyles.btnSaveText}>
                                            RESET PASSWORD
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
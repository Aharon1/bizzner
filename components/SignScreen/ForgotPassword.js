import React, {Component} from 'react';
import {Text, View, TouchableOpacity,Image,
    TextInput,KeyboardAvoidingView,Platform,
    AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
class ForgotPassword extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            emailAddress:'',
            isTokenSent:false,
            fpToken:'',
            fpTokenInserted:false,
        }
        this.forgotPass = this._forgotPass.bind(this);
        this.checkToken = this._checkToken.bind(this);
        this.resetPass = this._resetPass.bind(this);
    }
    _forgotPass = () => {
        if(this.state.emailAddress == ''){
            Toast.show('Email address should not be blank',Toast.LONG)
            return false;
        }
        this.setState({loading:true});
        fetch(SERVER_URL+'?action=forgot_password&fp_email='+this.state.emailAddress)
        .then(res=>res.json())
        .then(response=>{
            if(response.code == 200){
                this.setState({isTokenSent:true});
            }
            Toast.show(response.message,Toast.LONG);
            this.setState({loading:false})
        })
        .catch(err=>{
            console.log(err)
        })
    }
    _checkToken = () =>{
        if(this.state.fpToken == ''){
            Toast.show('Token should not be blank',Toast.SHORT);
            return false;
        }
        this.setState({loading:true});
        fetch(SERVER_URL+'?action=fptoken_check&token='+this.state.fpToken)
        .then(res=>res.json())
        .then(response=>{
            if(response.code==200){
                this.setState({fpTokenInserted:true});
            }
            this.setState({loading:false});
            Toast.show(response.message,Toast.SHORT);
        })
    }
    _resetPass = ()=>{
        if(this.state.newPass == ''){
            Toast.show('Password should not be empty',Toast.SHORT);
            return false;
        }
        if(this.state.confirmNewPass == ''){
            Toast.show('Confirm password should not be empty',Toast.SHORT);
            return false;
        }
        if(this.state.newPass != this.state.confirmNewPass){
            Toast.show('Password & confirm password should be same',Toast.SHORT);
            return false;
        }
        this.setState({loading:true});
        fetch(SERVER_URL+'?action=reset_password&token='+this.state.fpToken+'&fp_reset_password='+this.state.newPass)
        .then(res=>res.json())
        .then(response=>{
            this.setState({loading:false});
            if(response.code == 200){
                this.setState({isTokenSent:false,fpToken:'',fpTokenInserted:false});
                this.props.navigation.navigate('SignIn');
            }
            Toast.show(response.message,Toast.SHORT);
        })
        .catch(err=>{

        })
    }
    render(){
        return(
            <View style={{backgroundColor:'#FFF',flex:1}}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => this.props.navigation.goBack() }>
                        <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }} />
                    </TouchableOpacity>
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:20}}>FORGOT PASSWORD</Text>
                </View>
                <KeyboardAvoidingView style={{
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    {
                        this.state.isTokenSent && !this.state.fpTokenInserted &&
                        <View style={{width:'75%'}}>
                            <Text style={{
                            marginBottom:30,
                            fontFamily:'Roboto-Light',
                            fontSize:21,
                            color:'#0947b9',
                            textAlign:'center'
                            }}>Token</Text>
                            <View style={{
                            borderBottomColor:'#8da6d4',
                            borderBottomWidth: 1,
                            overflow:'visible',
                            flexDirection:'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            alignContent:'flex-start',
                            marginBottom:30,
                            paddingBottom:5,
                            }}>
                                <Icon name="tag" style={{
                                    color:'#6789c6',
                                    fontSize:18,
                                    width:35,
                                    height:40,
                                    paddingTop: 10,
                                }}/>
                                <TextInput 
                                    style={{flex:1,textAlign:'left',alignItems:'center',paddingRight: 10,height:40,fontSize:18,fontFamily:'Roboto-Light'}} 
                                    placeholder="Token *" 
                                    onChangeText={(text)=>this.setState({fpToken:text})} 
                                    autoCapitalize='none' 
                                    keyboardType='number-pad'
                                    placeholderTextColor="#03163a" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.fpToken}
                                />
                            </View>
                            <View style={{
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems:'center'
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
                        this.state.isTokenSent  && this.state.fpTokenInserted
                        &&
                        <View style={{width:'75%'}}>
                            <Text style={{
                                marginBottom:30,
                                fontFamily:'Roboto-Light',
                                fontSize:21,
                                color:'#0947b9',
                                textAlign:'center'
                            }}>Reset Password</Text>
                            <View style={{
                                borderBottomColor:'#8da6d4',
                                borderBottomWidth: 1,
                                overflow:'visible',
                                flexDirection:'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                alignContent:'flex-start',
                                marginBottom:30,
                                paddingBottom:5,
                            }}>
                                <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{paddingTop: 10,marginRight:10}}/>
                                <TextInput 
                                    style={{flex:1,textAlign:'left',alignItems:'center',paddingRight: 10,height:40,fontSize:18,fontFamily:'Roboto-Light'}} 
                                    placeholder="New Password *" 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.newPass = input; }} 
                                    onSubmitEditing={() => { this.confirmNewPass.focus(); }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({newPass:text})} 
                                    secureTextEntry={true}
                                    autoCapitalize='none' 
                                    placeholderTextColor="#03163a" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.newPass}
                                />
                            </View>
                            <View style={{
                                borderBottomColor:'#8da6d4',
                                borderBottomWidth: 1,
                                overflow:'visible',
                                flexDirection:'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                alignContent:'flex-start',
                                marginBottom:30,
                                paddingBottom:5,
                            }}>
                                <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{paddingTop: 10,marginRight:10}}/>
                                <TextInput 
                                    style={{flex:1,textAlign:'left',alignItems:'center',paddingRight: 10,height:40,fontSize:18,fontFamily:'Roboto-Light'}} 
                                    placeholder="Confirm New Password *" 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.confirmNewPass = input; }} 
                                    onChangeText={(text)=>this.setState({confirmNewPass:text})} 
                                    secureTextEntry={true}
                                    autoCapitalize='none' 
                                    placeholderTextColor="#03163a" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.confirmNewPass}
                                />
                            </View>
                            <View style={{
                                flexDirection:'column',
                                justifyContent:'center',
                                alignItems:'center'
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
                        !this.state.isTokenSent && this.state.fpToken =='' && !this.state.fpTokenInserted &&
                        <View style={{width:'75%'}}>
                            <Text style={{
                                marginBottom:30,
                                fontFamily:'Roboto-Light',
                                fontSize:21,
                                color:'#0947b9',
                                textAlign:'center'
                            }}>Forgot Passwrod?</Text>
                            <View style={{
                                borderBottomColor:'#8da6d4',
                                borderBottomWidth: 1,
                                overflow:'visible',
                                flexDirection:'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                alignContent:'flex-start',
                                marginBottom:30,
                                paddingBottom:5,
                            }}>
                                <Icon name="envelope" style={{
                                    color:'#6789c6',
                                    fontSize:18,
                                    width:35,
                                    height:40,
                                    paddingTop: 10,
                                }}/>
                                <TextInput 
                                    style={{flex:1,textAlign:'left',alignItems:'center',paddingRight: 10,height:40,fontSize:18,fontFamily:'Roboto-Light'}} 
                                    placeholder="Email *" 
                                    returnKeyType={"next"} 
                                    ref={(input) => { this.emailAddress = input; }} 
                                    onSubmitEditing={() => { this.country.focus(); }} 
                                    blurOnSubmit={false}
                                    onChangeText={(text)=>this.setState({emailAddress:text})} 
                                    keyboardType="email-address" 
                                    autoCapitalize='none' 
                                    placeholderTextColor="#03163a" 
                                    underlineColorAndroid="transparent" 
                                    value={this.state.emailAddress}
                                />
                            </View>
                            <View style={{
                                flexDirection:'column',
                                justifyContent:'center',
                                alignItems:'center'
                            }}>
                                <TouchableOpacity style={MainStyles.btnSave} onPress={this.forgotPass}>
                                    <Text style={MainStyles.btnSaveText}>
                                        RESET PASSWORD
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    
                </KeyboardAvoidingView>
            </View>
        );
    }
}
export default ForgotPassword
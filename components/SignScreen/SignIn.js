import React, {Component} from 'react';
import {Text, View, TouchableOpacity,Image,ScrollView,PushNotificationIOS,
    TextInput,KeyboardAvoidingView,Platform,Alert,SafeAreaView,
    AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import PushNotification from 'react-native-push-notification';
class SignIn extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            emailAddress:'',
            password:'',
        }
        this.signIn = this._signIn.bind(this);
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
      }
    getToken = (onToken)=>{
        if(Platform.OS == 'ios'){
            console.log(PushNotificationIOS);
            this.sendDataToServer({token:''});
            PushNotificationIOS.addEventListener('register',(token)=>{
                console.log(token);
            })
        }
        else{
            PushNotification.configure({
                onRegister: onToken,
                onNotification: function(notification) {
                    console.log('NOTIFICATION:', notification );
                    //notification.finish(PushNotificationIOS.FetchResult.NoData);
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
        }
    }
    _signIn = ()=>{
        var deviceToken = '';
        if(this.state.emailAddress == ''){
            Toast.show('Email address should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.password == ''){
            Toast.show('Password should not be blank',Toast.SHORT)
            return false;
        }
        this.setState({loading:true});
        this.getToken(this.sendDataToServer.bind(this));
    }
    sendDataToServer(token){
        console.log(token);
        fetch(SERVER_URL+'?action=login_user&lg_email='+this.state.emailAddress+'&lg_pass='+this.state.password+'&device_token='+token.token+'&platform='+Platform.OS)
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            if(response.code == 200){
                this.saveDetails('isUserLoggedin','true');
                this.saveDetails('userID',response.body.ID);
                Toast.show('LoggedIn successfully', Toast.SHORT);
                setTimeout(()=>{
                    this.setState({loading:false});
                    this.props.navigation.navigate('Current Events');
                },1500)
            }
            else{
                Toast.show(response.message, Toast.SHORT);
                this.setState({loading:false});
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
    render(){
        return(
            <SafeAreaView style={{backgroundColor:'#FFF',flex:1}}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={{ paddingLeft: 12,flexDirection:'row' }} onPress={() => this.props.navigation.goBack() }>
                        <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }} />
                        <Text style={{fontSize:16,color:'#8da6d5',marginLeft:20}}>SIGN IN</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView style={{
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <ScrollView keyboardShouldPersistTaps={'handled'} style={{width:'75%',flex:1,marginTop:15}}>
                        <Text style={{
                            marginBottom:30,
                            fontFamily:'Roboto-Light',
                            fontSize:21,
                            color:'#0947b9',
                            textAlign:'center'
                        }}>Sign in</Text>
                        <View style={{
                            borderBottomColor:'#8da6d4',
                            borderBottomWidth: 1,
                            overflow:'visible',
                            flexDirection:'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            alignContent:'flex-start',
                            marginBottom:20,
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
                                onSubmitEditing={() => { this.password.focus(); }} 
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
                            borderBottomColor:'#8da6d4',
                            borderBottomWidth: 1,
                            overflow:'visible',
                            flexDirection:'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            alignContent:'flex-start',
                            marginBottom:20,
                            paddingBottom:5,
                        }}>
                            <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{paddingTop: 10,marginRight:10}}/>
                            <TextInput 
                                style={{flex:1,textAlign:'left',alignItems:'center',paddingRight: 10,height:40,fontSize:18,fontFamily:'Roboto-Light'}} 
                                placeholder="Password *" 
                                returnKeyType={"go"} 
                                secureTextEntry={true} 
                                ref={(input) => { this.password = input; }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({password:text})} 
                                placeholderTextColor="#03163a" 
                                underlineColorAndroid="transparent" 
                                value={this.state.password}
                            />
                        </View>
                        <View style={{
                            justifyContent:'flex-end',
                            alignItems:'flex-end',
                            marginBottom:20
                        }}>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ForgotPassword')}}>
                                <Text style={{
                                    fontFamily:'Roboto-Medium',
                                    fontSize:14,
                                    color:'#0947b9',
                                }}>
                                    Forgot password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <TouchableOpacity style={MainStyles.btnSave} onPress={this.signIn}>
                                <Text style={MainStyles.btnSaveText}>
                                    LOGIN
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
export default SignIn
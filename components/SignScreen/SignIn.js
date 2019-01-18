import React, {Component} from 'react';
import {Text, View, TouchableOpacity,Image,
    TextInput,KeyboardAvoidingView,Platform,Alert,ScrollView,
    AsyncStorage,SafeAreaView,Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import NotifService from '../AsyncModules/NotifService';
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
    _signIn = ()=>{
        if(this.state.emailAddress == ''){
            Toast.show('Email address should not be blank',Toast.SHORT)
            return false;
        }
        if(this.state.password == ''){
            Toast.show('Password should not be blank',Toast.SHORT)
            return false;
        }
        this.setState({loading:true});
        fetch(SERVER_URL+'?action=login_user&lg_email='+this.state.emailAddress+'&lg_pass='+this.state.password)
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            this.setState({loading:false});
            if(response.code == 200){
                this.saveDetails('isUserLoggedin','true');
                this.saveDetails('userID',response.body.ID);
                setTimeout(()=>{
                    Toast.show('LoggedIn successfully', Toast.SHORT);
                    this.props.navigation.navigate('Home');
                  },200)
            }
            else{
                Toast.show(response.message, Toast.LONG);
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        return(
            <SafeAreaView style={{backgroundColor:'#FFF',flex:1}}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => this.props.navigation.goBack() }>
                        <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }} />
                    </TouchableOpacity>
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:20}}>SIGN IN</Text>
                </View>
                <KeyboardAvoidingView style={{
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <ScrollView style={{width:'75%',flex:1}} contentContainerStyle={{marginTop:30}} keyboardShouldPersistTaps='handled'>
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
                                blurOnSubmit={true}
                                onChangeText={(text)=>this.setState({password:text})} 
                                onSubmitEditing={() => { Keyboard.dismiss(); }} 
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
                            <TouchableOpacity style={MainStyles.btnSave} ref={(button)=>{this.submit=button}} onPress={this.signIn}>
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
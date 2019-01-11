import React, {Component} from 'react';
import {Text, View, TouchableOpacity,Image,
    TextInput,KeyboardAvoidingView,Platform,
    AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
class SignIn extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            emailAddress:'',
            password:'',
        }
    }
    render(){
        return(
            <View style={{backgroundColor:'#FFF',flex:1}}>
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
                    <View style={{width:'75%'}}>
                        <Text style={{
                            marginBottom:30,
                            fontFamily:'Roboto-Light',
                            fontSize:21,
                            color:'#0947b9',
                            textAlign:'center'
                        }}>Sign in</Text>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <Icon name="envelope" style={[MainStyles.iFWIIcon,{color:'#6789c6'}]}/>
                            <TextInput 
                                style={MainStyles.ifWITI} 
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
                        <View style={MainStyles.inputFieldWithIcon}>
                            <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{paddingTop: 13,marginRight:10}}/>
                            <TextInput 
                                style={MainStyles.ifWITI} 
                                placeholder="Password *" 
                                returnKeyType={"next"} 
                                secureTextEntry={true} 
                                ref={(input) => { this.password = input; }} 
                                onSubmitEditing={() => { this.confirmPassword.focus(); }} 
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
                            <TouchableOpacity>
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
                            <TouchableOpacity style={MainStyles.btnSave}>
                                <Text style={MainStyles.btnSaveText}>
                                    LOGIN
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
export default SignIn
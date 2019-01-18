import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView, 
    TextInput,KeyboardAvoidingView,Animated,Platform, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
class SignUp extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            animation: new Animated.Value(30),
            firstName:'',
            lastName:'',
            emailAddress:'',
            country:'',
            job:'',
            password:'',
            confirmPassword:'',
        }
    }
    togglePicOption = () => {  
        this.setState((prevState) => {
          Animated.spring(this.state.animation, {
            toValue: prevState.isModalVisible ? 0 : 1,
          }).start()
          return {
            isModalVisible: !prevState.isModalVisible
          }
        })
    }
    
    registerUser = ()=>{
        var firstName = this.state.firstName;
        var lastName = this.state.lastName;
        var emailAddress = this.state.emailAddress;
        var country = this.state.country;
        var job = this.state.job;
        var password = this.state.password;
        var confirmPassword = this.state.confirmPassword;
        if(firstName == ''){
            Toast.show('First name could not be empty', Toast.SHORT);
            return false;
        }
        if(lastName == ''){
            Toast.show('Last name could not be empty', Toast.SHORT);
            return false;
        }
        if(emailAddress == ''){
            Toast.show('Email could not be empty', Toast.SHORT);
            return false;
        }
        if(country == ''){
            Toast.show('Country could not be empty', Toast.SHORT);
            return false;
        }
        if(job == ''){
            Toast.show('Job could not be empty', Toast.SHORT);
            return false;
        }
        if(password == ''){
            Toast.show('Password could not be empty', Toast.SHORT);
            return false;
        }
        if(confirmPassword == ''){
            Toast.show('Confirm password could not be empty', Toast.SHORT);
            return false;
        }
        if(confirmPassword != password){
            Toast.show('passwords not match', Toast.SHORT);
            return false;
        }
        this.setState({loading:true});
        var params = '&rg_fname='+firstName;
        params += '&rg_lname='+lastName;
        params += '&rg_email='+emailAddress;
        params += '&rg_pass='+password;
        params += '&rg_country='+country;
        params += '&rg_job='+job;
        params += '&rg_device='+Platform.OS;
        params += '&rg_from=normal';

        fetch(SERVER_URL+'?action=register_user'+params)
        .then(res=>res.json())
        .then(response=>{
            this.setState({loading:false});
            if(response.code==200){
                Toast.show(response.message, Toast.SHORT);
                this.props.navigation.navigate('Auth');
            }
            else if (response.code==404){
                Toast.show(response.message, Toast.SHORT);
            }
            
            console.log(response);
        })
        .catch(err=>{
            console.error(err);
        })
    }
    render(){
        return(
            <SafeAreaView style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                {/*Header Section*/}
                <View style={MainStyles.profileHeader}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack() } style={{position:'absolute',top:15,left:15}}>
                        <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }}/>
                    </TouchableOpacity>
                    {/*Header Profile Picture Section*/}
                    <View style={MainStyles.pHeadPicWrapper}>
                        <View style={MainStyles.pHeadPic}>
                            <View>
                                <Icon name="image" size={40} style={{color:'#FFF'}}/>
                            </View>
                        </View>
                        <View style={MainStyles.pHeadPicEditBtnWrapper}>
                            <TouchableOpacity  style={MainStyles.pHeadPicEditBtn} onPress={this.togglePicOption}>
                            <Icon name="pencil" style={MainStyles.pHeadPicEditBtnI}/>
                            </TouchableOpacity>
                            <Animated.View style={[MainStyles.pHeadPicOptions,{
                            zIndex:500,
                                top: this.state.animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [600, 35]
                                })
                            }]}>
                            <TouchableOpacity style={MainStyles.pHPOBtn} onPress={this.picPhoto}>
                                <Text>Take a Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={MainStyles.pHPOBtn} onPress={()=>{alert('This');}}>
                                <Text>Pick Photo</Text>
                            </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </View>
                {/*Body Section*/}
                <ScrollView style={[MainStyles.profileBody,{marginBottom: 0}]} keyboardShouldPersistTaps={'handled'}>
                    <KeyboardAvoidingView  style={{flex:1}}>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <Icon name="user" style={[MainStyles.iFWIIcon,{color:'#6789c6'}]}/>
                            <TextInput 
                                style={MainStyles.ifWITI} 
                                placeholder="First name *" 
                                returnKeyType={"next"} 
                                onSubmitEditing={() => { this.lastName.focus(); }} 
                                blurOnSubmit={false} 
                                onChangeText={(text)=>this.setState({firstName:text})} 
                                placeholderTextColor="#03163a" 
                                underlineColorAndroid="transparent" 
                                value={this.state.firstName} 
                            />
                        </View>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <Icon name="user" style={[MainStyles.iFWIIcon,{color:'#6789c6'}]}/>
                            <TextInput 
                                style={MainStyles.ifWITI} 
                                placeholder="Last name *" 
                                returnKeyType={"next"} 
                                ref={(input) => { this.lastName = input; }} 
                                onSubmitEditing={() => { this.emailAddress.focus(); }} 
                                blurOnSubmit={false} 
                                onChangeText={(text)=>this.setState({lastName:text})} 
                                placeholderTextColor="#03163a" 
                                underlineColorAndroid="transparent" 
                                value={this.state.lastName}
                            />
                        </View>
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
                            <Icon name="map-marker" style={[MainStyles.iFWIIcon,{color:'#6789c6'}]}/>
                            <TextInput 
                                style={MainStyles.ifWITI} 
                                placeholder="Country *" 
                                returnKeyType={"next"} 
                                ref={(input) => { this.country = input; }} 
                                onSubmitEditing={() => { this.job.focus(); }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({country:text})} 
                                placeholderTextColor="#03163a" 
                                underlineColorAndroid="transparent" 
                                value={this.state.country}
                            />
                        </View>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <Icon name="briefcase" style={[MainStyles.iFWIIcon,{color:'#6789c6'}]}/>
                            <TextInput 
                                style={MainStyles.ifWITI} 
                                placeholder="Job" 
                                returnKeyType={"next"} 
                                ref={(input) => { this.job = input; }} 
                                onSubmitEditing={() => { this.password.focus(); }} 
                                blurOnSubmit={false}
                                onChangeText={(text)=>this.setState({job:text})} 
                                placeholderTextColor="#03163a" 
                                underlineColorAndroid="transparent" 
                                value={this.state.job}
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
                        <View style={MainStyles.inputFieldWithIcon}>
                            <Image source={require('../../assets/key-icon.png')} width={6} height={7} style={{paddingTop: 13,marginRight:10}}/>
                            <TextInput 
                                style={MainStyles.ifWITI} 
                                placeholder="Confirm password *" 
                                returnKeyType={'done'} 
                                ref={(input) => { this.confirmPassword = input; }} 
                                secureTextEntry={true} 
                                onChangeText={(text)=>this.setState({confirmPassword:text})} 
                                placeholderTextColor="#03163a" 
                                underlineColorAndroid="transparent" 
                                value={this.state.confirmPassword}
                            />
                        </View>
                    </KeyboardAvoidingView>
                    <View style={[MainStyles.btnWrapper,{flex:1,justifyContent:'flex-end',flexDirection: 'row'}]}>
                        <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.registerUser();}}>
                            <Text style={MainStyles.btnSaveText}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default SignUp
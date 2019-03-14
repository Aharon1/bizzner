import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView,Picker,ActionSheetIOS,
    TextInput,KeyboardAvoidingView,Animated,Platform,AlertIOS,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../StyleSheet';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import countryList from 'react-select-country-list';
import ImagePicker from 'react-native-image-picker';
class SignUp extends Component{
    constructor(props){
        super(props);
        var cOptionsList = countryList().getLabels();
        cOptionsList.unshift('Cancel');
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
            CountryList:countryList().getLabels(),
            cOptions:cOptionsList,
            profilePicture:''
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
    pickerIos = ()=>{
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.state.cOptions,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if(buttonIndex != 0){
              this.setState({country: this.state.cOptions[buttonIndex]})
            }
          });
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
        fetch(SERVER_URL+'/media-upload-register.php', {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({
              file:this.state.imageData,
              rg_fname:firstName,
              rg_lname:emailAddress,
              rg_pass:password,
              rg_country:country,
              rg_job:job,
              rg_device:Platform.OS,
              rg_from:'normal',
              
            })
        }).then((res) => res.json())
        .then(response=>{
        console.log(response);
        Toast.show(response.message,Toast.SHORT);
        this.setState({loading:false});
        this.props.navigation.navigate('Current Events');
        })
        .catch(err=>{
        console.log(err)
        });
        fetch(SERVER_URL+'?action=register_user'+params)
        .then(res=>res.json())
        .then(response=>{
            this.setState({loading:false});
            if(response.code==200){
                this.props.navigation.navigate('Auth');
            }
            if(Platform.OS == 'ios'){
                AlertIOS.alert(
                    response.title,
                    response.message
                   );
            }
            else{
                Toast.show(response.message, Toast.SHORT);
            }
            console.log(response);
            
        })
        .catch(err=>{
            console.error(err);
        })
    }
    takePicture = async function() {
        var options = {
          maxWidth:1024,
          maxHeight:1024,
          mediaType:'photo',
          quality:1,
          allowsEditing:true,
          noData:false,
          storageOptions:{
            skipBackup:true,
            cameraRoll:false,
          }
        }
        ImagePicker.launchCamera(options, (response) => {
          console.log(response);
          // Same code as in above section!
          if(!response.didCancel){
            this.setState({ imageData:{
              name:response.fileName,
              type:response.type,
              uri:response.uri,
              base64:response.data,
              size:response.fileSize
            },profilePicture:response.uri  });
          }
        this.togglePicOption();
        });
    };
    picPhoto = ()=>{
        //if(RequestPermssions.Camera()){
        var options = {
            maxWidth:1024,
            maxHeight:1024,
            mediaType:'photo',
            quality:1,
            allowsEditing:true,
            noData:false,
            storageOptions:{
                skipBackup:true,
                cameraRoll:false,
            }
        }
        ImagePicker.launchImageLibrary(options, (response) => {
        // Same code as in above section!
        if(!response.didCancel){
            this.setState({ imageData:{
            name:response.fileName,
            type:response.type,
            uri:response.path,
            base64:response.data,
            size:response.fileSize
            },profilePicture:response.uri  });
        }
        this.togglePicOption();
        });
    };
    render(){
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return(
            <SafeAreaView style={MainStyles.normalContainer}>
                {/* <Loader loading={this.state.loading} /> */}
                {/*Header Section*/}
                <View style={MainStyles.profileHeader}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack() } style={{position:'absolute',top:15,left:15}}>
                        <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }}/>
                    </TouchableOpacity>
                    {/*Header Profile Picture Section*/}
                    <View style={MainStyles.pHeadPicWrapper}>
                        <View style={MainStyles.pHeadPic}>
                            {
                                this.state.profilePicture == ''
                                && 
                                <Image source={require('../../assets/dummy.jpg')} style={{width:130,height:130}}/>
                            }
                            {
                                this.state.profilePicture != ''
                                && 
                                <Image source={{uri:this.state.profilePicture}} style={{width:130,height:130}}/>
                            }
                        </View>
                        <View style={MainStyles.pHeadPicEditBtnWrapper}>
                            <TouchableOpacity  style={MainStyles.pHeadPicEditBtn} onPress={this.togglePicOption}>
                            <Icon name="pencil" style={MainStyles.pHeadPicEditBtnI}/>
                            </TouchableOpacity>
                            <Animated.View style={[MainStyles.pHeadPicOptions,{
                            zIndex:500,
                                top: this.state.animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [600, 0]
                                })
                            }]}>
                            <TouchableOpacity style={MainStyles.pHPOBtn} onPress={()=>{this.takePicture()}}>
                                <Text>Take a Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={MainStyles.pHPOBtn} onPress={()=>{this.picPhoto()}}>
                                <Text>Pick Photo</Text>
                            </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </View>
                {/*Body Section*/}
                <KeyboardAvoidingView  style={{flex:1}} enabled behavior={behavior}>
                    <ScrollView style={[MainStyles.profileBody,{marginBottom: 0}]} keyboardShouldPersistTaps={'handled'}>
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
                            {
                                Platform.OS == 'android' && 
                                <Picker
                                returnKeyType={"next"} 
                                ref={(input) => { this.country = input; }} 
                                onSubmitEditing={() => { this.job.focus(); }} 
                                blurOnSubmit={false}
                                selectedValue={this.state.country}
                                style={MainStyles.cEFWIPF}
                                textStyle={{fontSize: 17,fontFamily:'Roboto-Light'}}
                                itemTextStyle= {{
                                    fontSize: 17,fontFamily:'Roboto-Light',
                                }}
                                itemStyle={[MainStyles.cEFWIPF,{fontSize: 17,fontFamily:'Roboto-Light'}]}
                                onValueChange={(itemValue, itemIndex) => this.setState({country: itemValue})}>
                                    <Picker.Item label="Select Country" value="" />
                                    {
                                    this.state.CountryList.map(item=>{
                                        return (
                                        <Picker.Item key={'key-'+item} label={item} value={item} />
                                        )
                                    })
                                    }
                                </Picker>
                            }
                            {
                                Platform.OS == 'ios' && 
                                <TouchableOpacity style={[MainStyles.cEFWITF,{alignItems:'center'}]} onPress={()=>{this.pickerIos()}}>
                                    {
                                        this.state.country != '' && 
                                        <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>{this.state.country}</Text>
                                    }
                                    {
                                        this.state.country == '' && 
                                        <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:18}}>Select Country</Text>
                                    }
                                </TouchableOpacity>
                                
                            }
                            {/* <TextInput 
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
                            /> */}
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
                        <View style={[MainStyles.btnWrapper,{flex:1,justifyContent:'flex-end',flexDirection: 'row'}]}>
                            <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.registerUser();}}>
                                {this.state.loading && <ActivityIndicator size="large" color="#FFFFFF" />}
                                {!this.state.loading && <Text style={MainStyles.btnSaveText}>SIGN UP</Text>}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

export default SignUp
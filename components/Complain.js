import React,{Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View,SafeAreaView,TouchableOpacity, TextInput,KeyboardAvoidingView,
    AsyncStorage,
    Platform,ScrollView } from 'react-native';
import { DrawerActions,withNavigation } from 'react-navigation';
import { SERVER_URL } from '../Constants';
import { HeaderButton } from './Navigation/HeaderButton';
import MainStyles from './StyleSheet';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import HardText from '../HardText';
class ComplainPageScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            Name:'',
            subject:'',
            message:'',
        }
    }
    

    get_usersDetails = async ()=>{
        var UserID = await AsyncStorage.getItem('userID');
        this.setState({UserID});
        setTimeout(()=>{
          fetch(SERVER_URL+'?action=get_user_data&user_id='+UserID)
          .then(res=>res.json())
          .then(response=>{
            if(response.code == 200){
              var body = response.body;
              console.log(body);
              this.setState({
                loading:false,
                emailAddress : body.user_email
             });
            }
          })
        },200)
      }







    componentDidMount(){
        this.get_usersDetails();
    }
    sendComplain(){
        this.setState({loading:true});
        fetch(SERVER_URL+'?action=send_complain&name='+this.state.name+'&subject='+this.state.subject+'&message='+this.state.message + '&useremail='+this.state.emailAddress)
        .then(res=>{console.log(res);return res.json()})
        .then(response=>{
            console.log(response);
            Toast.show(response.message,Toast.SHORT);
            this.setState({loading:false,name:'',subject:'',message:''});
        })
        .catch(err=>{
            console.error(err);
        });
    }
    render(){
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return (
            <SafeAreaView style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                {/*Header Section*/}
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={{ alignItems:'center',paddingLeft: 12,flexDirection:'row' }} onPress={() => this.props.navigation.goBack() }>
                        <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }} />
                        <Text style={{fontSize:14,color:'#8da6d5',marginLeft:20}}>{HardText.complain}</Text>
                    </TouchableOpacity>
                </View>
                {/*Body Section*/}
                <KeyboardAvoidingView  style={{flex:1}} enabled behavior={behavior}>
                    <ScrollView style={[MainStyles.profileBody,{marginTop:20}]}>
                    
                        <View style={MainStyles.inputFieldWithIcon}>
                            <TextInput style={MainStyles.ifWITI} placeholder="Name" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.name} onChangeText={(text)=>{this.setState({name:text})}}/>
                        </View>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <TextInput style={MainStyles.ifWITI} placeholder="Subject" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.subject} onChangeText={(text)=>{this.setState({subject:text})}}/>
                        </View>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <TextInput style={MainStyles.ifWITI} placeholder="Message" multiline={true} placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.message} numberOfLines = {6} onChangeText={(text)=>{this.setState({message:text})}}/>
                        </View>
                        
                        <View style={[MainStyles.btnWrapper,{flex:1,justifyContent:'flex-end',flexDirection: 'row'}]}>
                            <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.sendComplain();}}>
                                <Text style={MainStyles.btnSaveText}>{HardText.send_btn}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
export default withNavigation(ComplainPageScreen)
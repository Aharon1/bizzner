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
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount(){
        this.setUserId();
    }
    sendComplain(){
        this.setState({loading:true});
        fetch(SERVER_URL+'?action=send_complain&name='+this.state.name+'&subject='+this.state.subject+'&message='+this.state.message)
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
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:18}}>COMPLAIN</Text>
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
                            <TextInput style={{
                                flex: 2,paddingRight: 10,
                                textAlign:'left',
                                paddingLeft: 0,
                                fontSize:18,
                                fontFamily:'Roboto-Light'
                            }} placeholder="Message" multiline={true} placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.message} numberOfLines = {6} onChangeText={(text)=>{this.setState({message:text})}}/>
                        </View>
                        <View style={[MainStyles.btnWrapper,{flex:1,justifyContent:'flex-end',flexDirection: 'row'}]}>
                            <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.sendComplain();}}>
                                <Text style={MainStyles.btnSaveText}>SEND</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
export default withNavigation(ComplainPageScreen)
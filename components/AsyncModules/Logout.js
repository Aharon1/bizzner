import React, {Component} from 'react';
import {View,AsyncStorage,Image} from 'react-native';
import Loader from '../Loader';
import { SERVER_URL } from '../../Constants';
import PushNotification from 'react-native-push-notification';
class Logout extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
        }
        //this.authenticateSession = this._authenticateSession.bind(this);
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    getToken = (onToken)=>{
            PushNotification.configure({
                onRegister: onToken,
                onNotification: function(notification) {
                    console.log('NOTIFICATION:', notification );
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
    authenticateSession(){
        this.getToken(this.logoutFromServer.bind(this));
    }
    logoutFromServer(token){
        fetch(SERVER_URL+'?action=logout&user_id='+this.state.userID+'&deviceToken='+token)
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            this.saveDetails('isUserLoggedin','false');
            setTimeout(()=>{
                this.setState({loading:false});
                this.props.navigation.navigate('Auth');
            },1000);
        });
    }
    
    componentDidMount(){
        this.setUserId();
        this.authenticateSession();
    }
    render(){
        return(
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <Image source={require('../../assets/bizzner-logo.png')} style={{height:72}}/>
            </View>
        );
    }
}
export default Logout;
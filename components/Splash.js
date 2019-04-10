import React,{Component} from 'react';
import {View,AsyncStorage,Image,Linking,Platform,BackHandler } from 'react-native';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../Constants';
class SplashScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
        this.backButtonListener = null;
        this.currentRouteName = 'Splash';
        this.lastBackButtonPress = null;
        //this.authenticateSession();
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    componentDidMount() { // B
        Linking.getInitialURL().then(url => {
            this.checkToken(url)
          });
          return true;
        /*this.backHandler = BackAndroid.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp(); // works best when the goBack is async
            return true;
          });*/
        if (Platform.OS == 'android') {
            this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', (event) => {
                /*if (this.currentRouteName !== 'Splash') {
                    return false;
                }
                BackHandler.exitApp();
                return true;*/
            });
          Linking.getInitialURL().then(url => {
            this.checkToken(url)
          });
        } 
        else {
            var linkingListner=Linking.addListener('url', this.handleOpenURL);
            console.log(linkingListner);
            if(!linkingListner.context){
                this.authenticateSession()
            }
        }
    }
    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL = (event) => { // D
        console.log(event);
        this.checkToken(event.url);
    }
    checkToken = (url)=>{
        console.log(url);
        if(url){
            var fullUrl = url.split('/');
            var tokenString = fullUrl[fullUrl.length - 2];
            if(tokenString == 'token'){
                var token = fullUrl[fullUrl.length - 1];
                fetch(SERVER_URL+'?action=check-token&token='+token)
                .then(res=>res.json())
                .then(response=>{
                    if(response.code == 200){
                        this.saveDetails('isUserLoggedin','true');
                        this.saveDetails('userID',response.body.ID);
                        Toast.show(response.message, Toast.SHORT);
                        this.props.navigation.navigate('ConfirmScreen');
                    }
                    else{
                        Toast.show(response.message, Toast.SHORT);
                        this.authenticateSession()
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            else if(tokenString == 'event'){
                var eventId = fullUrl[fullUrl.length - 1];
                fetch(
                    SERVER_URL +
                      "?action=event_details&event_id=" + eventId
                  )
                    .then(response => response.json())
                    .then(res => {
                        if(res.code == 200){
                            const location = [+res.body.group_lng, +res.body.group_lat];
                            this.props.navigation.navigate('EventDetail',{event_id:eventId,location});
                        }
                        else if(res.code == 404){
                            Toast.show(res.message, Toast.SHORT);
                            this.props.navigation.navigate('Current Events');
                        }
                    });
                
            }
            else{
                this.authenticateSession()   
            }
        }
        else{
            this.authenticateSession()
        }
    }
    authenticateSession = async()=> {
        const { navigation } = this.props;
        let isUserLoggedIn = await AsyncStorage.getItem('isUserLoggedin');
        if(isUserLoggedIn == 'true'){
          navigation.navigate('Home');
        }
        else{
            navigation.navigate('Auth');
        }
    }
    render(){
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <Image source={require('../assets/bizzner-logo.png')} style={{height:72}}/>
            </View>
        );
    }
}
export default SplashScreen;
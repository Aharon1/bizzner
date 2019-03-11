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
        /*this.backHandler = BackAndroid.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp(); // works best when the goBack is async
            return true;
          });*/
        if (Platform.OS == 'android') {
            this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', (event) => {
                console.log(event);
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
            if(!linkingListner.context){
                this.authenticateSession()
            }
            console.log(linkingListner);
        }
    }
    componentWillUnmount() { // C
        /*if (Platform.OS == 'android') {
            //this.backButtonListener.remove();
            BackHandler.removeEventListener('hardwareBackPress', ()=>{
                console.log(this.currentRouteName);
                if (this.currentRouteName !== 'Splash') {
                    return false;
                }
                BackHandler.exitApp();
                return true;
            });
        }*/
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL = (event) => { // D
        this.checkToken(event.url);
    }
    checkToken = (url)=>{
        if(url){
            console.log(url);
            var fullUrl = url.split('/');
            var tokenString = fullUrl[fullUrl.length - 2];
            console.log(tokenString);
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
                this.props.navigation.navigate('EventDetail',{event_id:eventId,});
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
          /*this.setState({
            loading: true
          });
          navigator.geolocation.getCurrentPosition(positions=>{
            let Latitude = positions.coords.latitude;
            let Longitude = positions.coords.longitude;
            var fetchData = 'http://bizzner.com/app?action=search_location_db&latitude='+Latitude+'&longitude='+Longitude;
            fetch(fetchData,{
                method:'POST',
                body:JSON.stringify({
                    action:'search_location_db',
                    latitude:Latitude,//22.7150822,
                    longitude:Longitude//75.8707448
                })
            })
            .then(response=>{
                var bodyText = JSON.parse(response._bodyText);
                var results = bodyText.results
                const placesArray = [];
                for (const bodyKey in results){
                    placesArray.push({
                        name:results[bodyKey].group_name,
                        address:results[bodyKey].group_address,
                        isStarted:results[bodyKey].group_status,
                        photoUrl:results[bodyKey].photoUrl,
                        key:results[bodyKey].place_id,
                        event_date:results[bodyKey].event_date,
                        event_time:results[bodyKey].event_time,
                        event_subject:results[bodyKey].event_subject,
                        event_note:results[bodyKey].event_note,
                        latitude:results[bodyKey].latitude,
                        longitude:results[bodyKey].longitude,
                        place_id:results[bodyKey].place_id,
                        group_id:results[bodyKey].group_id
                    });
                }
                this.setState({loading:false});
                navigation.navigate('Home',{locationList:placesArray,nextPageToken:bodyText.next_page_token});
            }).catch(err => {
                console.log('Error What is this',err);
            })
            
          },error=>{
            console.log('Error',error);
          })*/
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
import React,{Component} from 'react';
import {View,AsyncStorage,Image} from 'react-native';
import MainStyles from './StyleSheet';
import Loader from './Loader';
class SplashScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
        this.authenticateSession();
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
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
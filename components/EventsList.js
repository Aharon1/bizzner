import React, { Component } from 'react';
import { View,Text,FlatList,ScrollView,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
class EventsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[
                //{name: 'Cafe “Arcafe”', key: 'item1',address:'5 Shalom Aleichem St., Tel Aviv',isStarted:true},
            ]
        }
    }
    fecthDetails = ()=>{
        let Latitude = this.props.coords.latitude;
        let Longitude = this.props.coords.longitude;
        //let urlToFetch = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+Latitude+','+Longitude+'&radius=1500&key=AIzaSyBSXKgQnJWjgEJDru0DFiG188-Nc_ry6w8&types=restaurant,cafe';
        var fetchData = 'http://dissdemo.biz/bizzler?action=search_location_db&latitude=22.7150822&longitude=75.8707448';
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
            const placesArray = [];
            for (const bodyKey in bodyText){
                placesArray.push({
                    name:bodyText[bodyKey].group_name,
                    address:bodyText[bodyKey].group_address,
                    isStarted:bodyText[bodyKey].group_status,
                    key:bodyKey
                });
            }
            this.setState({data:placesArray});
            console.log('Response',placesArray);
        }).catch(err => {
            console.log('Error What is this',err);
        })
    }
    
    render(){
        this.fecthDetails();
        return (
            <ScrollView>
                <FlatList data={this.state.data}
                    renderItem={({item}) => (
                        <TouchableOpacity style={[
                                (item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                                MainStyles.EventItem,
                            ]}>
                            <View style={MainStyles.EventItemImageWrapper}>
                                <Image source={require('../assets/profile-pic.png')} />
                            </View>
                            <View style={MainStyles.EventItemTextWrapper}>
                                <Text style={MainStyles.EITWName}>{item.name}</Text>
                                <Text style={MainStyles.EITWAddress}>{item.address}</Text>
                                {
                                    item.isStarted === true?
                                        <View style={MainStyles.EITWAction}>
                                        <Icon name="users" size={16} style={[MainStyles.EITWActionIcon,MainStyles.EITWAIOnline]} />
                                        <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOnline]}>(15)  UX for mobile apps</Text>
                                        </View>
                                    :
                                    <View style={MainStyles.EITWAction}>
                                        <Icon name="calendar-plus-o" size={16} style={[MainStyles.EITWActionIcon,MainStyles.EITWAIOffline]} />
                                        <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOffline]}>Create new event</Text>
                                    </View>
                                }
                                
                            </View>
                        </TouchableOpacity>
                      )}
                />
            </ScrollView>
        );
    }
}
export default EventsList;
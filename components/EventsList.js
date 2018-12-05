import React, { Component } from 'react';
import { View,Text,FlatList,ScrollView,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
class EventsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[
                {name: 'Cafe “Arcafe”', key: 'item1',address:'5 Shalom Aleichem St., Tel Aviv',isStarted:true},
                {name: 'Cafe “Arcafe”', key: 'item2',address:'5 Shalom Aleichem St., Tel Aviv',isStarted:true},
                {name: 'Cafe “Arcafe”', key: 'item3',address:'5 Shalom Aleichem St., Tel Aviv',isStarted:false},
                {name: 'Cafe “Arcafe”', key: 'item4',address:'5 Shalom Aleichem St., Tel Aviv',isStarted:false},
                {name: 'Cafe “Arcafe”', key: 'item5',address:'5 Shalom Aleichem St., Tel Aviv',isStarted:false},
                {name: 'Cafe “Arcafe”', key: 'item6',address:'5 Shalom Aleichem St., Tel Aviv',isStarted:false}
            ]
        }
    }
    fecthDetails = ()=>{
        let Latitude = this.props.latitude;
        let Longitude = this.props.longitude;
        let urlToFetch = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+Latitude+','+Longitude+'&radius=1500&key=AIzaSyBmJ9czcD75arR-hezXnEq2pvoMzFNATSc&types=restaurant,cafe';
        fetch(urlToFetch, response=>{
            console.log('Response',response);
        },error => {
            console.log(error);
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
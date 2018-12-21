import React, { Component } from 'react';
import { View,Text,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import ProgressiveImage from './ImageComponent';
export default class ListItem extends Component{
    checkEvent = async ()=>{
        var curItem = await this.props.item;
        if(curItem.isStarted === false){
            var locItem = {
                name:curItem.name,
                geometry:{
                    location:{
                        latitude:curItem.latitude,
                        longitude:curItem.longitude
                    }
                },
                vicinity:curItem.address,
                photos:curItem.photoUrl,
                place_id:curItem.place_id
            }
            await this.props.fetchDetails(locItem);
        }
        else{
            this.props.navigate('EventDetail',{place_id:curItem.place_id});
        }
    }
    render(){
        var d1 = new Date ();
        var d2 = new Date ( d1 );
        d2.setHours ( d1.getHours() + 24 );
        const Item = this.props.item;
        var date = Item.event_date+' '+Item.event_time;
        var eventDate = new Date(date);
        return (
        <TouchableOpacity style={[
                (Item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                MainStyles.EventItem,
                (eventDate.getTime() < d2.getTime() && eventDate.getTime() > d1.getTime())?{backgroundColor:'#dff9ec'}:''
            ]} onPress={this.checkEvent}>
            <View style={MainStyles.EventItemImageWrapper}>
                <ProgressiveImage source={{uri:Item.photoUrl}} style={{ width: 70, height: 70 }}
          resizeMode="cover"/>
            </View>
            <View style={MainStyles.EventItemTextWrapper}>
                <Text style={MainStyles.EITWName}>{Item.name}</Text>
                <Text style={MainStyles.EITWAddress}>{Item.address}</Text>
                <Text style={MainStyles.EITWAddress}>{Item.event_date} {Item.event_time}</Text>
                {
                    Item.isStarted === true?
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
        )
    }
}
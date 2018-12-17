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
            alert('Is Started');
        }
    }
    render(){
        const Item = this.props.item
        return (
        <TouchableOpacity style={[
                (Item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                MainStyles.EventItem,
            ]} onPress={this.checkEvent}>
            {/* require('../assets/profile-pic.png') "http://dissdemo.biz/bizzler/assets/images/default.jpg"*/}
            <View style={MainStyles.EventItemImageWrapper}>
                <ProgressiveImage source={{uri:Item.photoUrl}} style={{ width: 70, height: 70 }}
          resizeMode="cover"/>
                {/* <Image source={{uri:Item.photoUrl}} style={{width:70,height:70}}/> */}
            </View>
            <View style={MainStyles.EventItemTextWrapper}>
                <Text style={MainStyles.EITWName}>{Item.name}</Text>
                <Text style={MainStyles.EITWAddress}>{Item.address}</Text>
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
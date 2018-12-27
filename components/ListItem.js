import React, { Component } from 'react';
import { View,Text,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import ProgressiveImage from './AsyncModules/ImageComponent';
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
            this.props.navigate('EventDetail',{event_id:curItem.group_id});
        }
    }
    setUserEventStatus =  async (statusValue)=>{
        var curItem = await this.props.item;
        console.log(statusValue,curItem);
    }
    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
    render(){
        var d1 = new Date ();
        var d2 = new Date ( d1 );
        d2.setHours ( d1.getHours() + 24 );
        const Item = this.props.item;
        var date = Item.event_date+' '+Item.event_time;
        var eventDate = new Date(date);
        var N = 5;
        var Address = Item.address.split(" ").splice(0,N).join(" ");
        var eventTime = this.formatAMPM(eventDate);
        return (
            <View style={{borderBottomColor:'#8da6d4',borderBottomWidth:1,}}>
                <TouchableOpacity style={[
                    (Item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                    MainStyles.EventItem,
                    (eventDate.getTime() < d2.getTime() && eventDate.getTime() > d1.getTime())?{backgroundColor:'#dff9ec'}:''
                ]} onPress={this.checkEvent}>
                    <View style={MainStyles.EventItemImageWrapper}>
                        <ProgressiveImage source={{uri:Item.photoUrl}} style={{ width: 70, height: 70 }} resizeMode="cover"/>
                    </View>
                    <View style={MainStyles.EventItemTextWrapper}>
                        <Text style={[MainStyles.EITWName,
                            (Item.isStarted === true)?{color:'#39b549'}:''
                        ]}>{Item.event_subject}</Text>
                        <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Medium'}]}>{Item.name}</Text>
                        <Text style={MainStyles.EITWAddress}>{Address}</Text>
                        {
                            Item.isStarted === true?
                                <View style={MainStyles.EITWAction}>
                                <Image source={require('../assets/u-icon.png')} style={{marginRight:5,width:20,height:15}}/>
                                <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOnline]}>({Item.usersCount})  Details</Text>
                                </View>
                            :
                            <View style={MainStyles.EITWAction}>
                                <Icon name="calendar-plus-o" size={16} style={[MainStyles.EITWActionIcon,MainStyles.EITWAIOffline]} />
                                <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOffline]}>Create new event</Text>
                            </View>
                        }
                    </View>
                    <View style={{
                        justifyContent:'center',
                        alignItems:'flex-start'
                    }}>
                        <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Medium'}]}>{eventDate.getDate()+' '+eventDate.getMonth()+' '+eventDate.getFullYear()}</Text>
                        <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>{eventTime}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{
                    flex:1,
                    flexDirection:'row',
                    justifyContent:'space-evenly'
                }}>
                    <TouchableOpacity style={[
                     MainStyles.EIAButtons       
                    ]}
                    onPress={()=>this.setUserEventStatus(2)}
                    >
                        <Icon name="check" size={18} style={{color:'#FFF',marginRight:7,}}/>
                        <Text style={{
                            color:'#FFF',
                            fontFamily:'Roboto-Medium',
                            fontSize:15
                        }}>JOIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                            flex:1,
                            flexDirection:'row',
                            paddingHorizontal:15,
                            paddingVertical:10,
                            backgroundColor:'#c9d5eb',
                            justifyContent:'center'
                        }}
                        onPress={()=>this.setUserEventStatus(1)}
                    >
                        <Icon name="star" size={18} style={{color:'#FFF',marginRight:7,}}/>
                        <Text style={{
                            color:'#FFF',
                            fontFamily:'Roboto-Medium',
                            fontSize:15
                        }}>INTERESTED</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                            flex:1,
                            flexDirection:'row',
                            paddingHorizontal:15,
                            paddingVertical:10,
                            backgroundColor:'#c9d5eb',
                            justifyContent:'center'
                        }}
                        onPress={()=>this.setUserEventStatus(0)}
                        >
                        <Icon name="ban" size={18} style={{color:'#FFF',marginRight:7,}}/>
                        <Text style={{
                            color:'#FFF',
                            fontFamily:'Roboto-Medium',
                            fontSize:15
                        }}>IGNORE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
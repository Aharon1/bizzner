import React, { Component } from 'react';
import { View,Text,Image,TouchableOpacity,ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import ProgressiveImage from './AsyncModules/ImageComponent';
import { SERVER_URL } from '../Constants';
let userStatus = '';
export default class ListItem extends Component{
    constructor(props){
        super(props);
        this.state={
            userStatus:''
        }
    }
    checkEvent = async ()=>{
        var curItem = await this.props.item;
        this.props.navigate('EventDetail',{event_id:curItem.group_id});
    }
    setUserEventStatus =  async (statusValue)=>{
        var curItem = await this.props.item;
        var user_id = 29;
        fetch(SERVER_URL+'?action=changeUserEventStatus&user_id='+user_id+'&event_id='+curItem.group_id+'&status='+statusValue)
        .then(response=>{
            userStatus = statusValue;
            this.setState({userStatus:statusValue});
            if(statusValue == 1){
                ToastAndroid.showWithGravity('You are interested to this event',ToastAndroid.SHORT,ToastAndroid.CENTER);
            }
            else if(statusValue == 2){
                ToastAndroid.showWithGravity('You are joined to this event',ToastAndroid.SHORT,ToastAndroid.BOTTOM);
            }
            else if(statusValue ==3){
                ToastAndroid.showWithGravity('You have ignored this event',ToastAndroid.SHORT,ToastAndroid.CENTER);
            }
        })
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
    componentWillMount(){
        for(const uid in this.props.item.userIds){
            if(this.props.item.userIds[uid].user_id == "29"){
                userStatus=this.props.item.userIds[uid].status;
                this.setState({userStatus:this.props.item.userIds[uid].status});
            }
        }
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
            <View
            style={[
                (this.state.userStatus == 3)?{opacity:0.5}:'',
                {borderBottomColor:'#8da6d4',borderBottomWidth:1},
                (Item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                (eventDate.getTime() < d2.getTime() && eventDate.getTime() > d1.getTime())?{backgroundColor:'#dff9ec'}:'']}>
                <TouchableOpacity style={[
                    MainStyles.EventItem,
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
                                <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOnline]}>({Item.usersCount}) </Text>
                                <Text style={{paddingHorizontal:15,paddingVertical:3,backgroundColor:'#8da6d4',fontFamily:'Roboto-Medium',color:'#FFF',borderRadius:15,marginLeft:8}}>Info</Text>
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
                { 
                    this.state.userStatus != 3 && 
                    <View style={MainStyles.EIAButtonsWrapper}>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons,
                        (this.state.userStatus == 2)?{backgroundColor:'#87d292'}:''
                        ]}
                        onPress={()=>this.setUserEventStatus(2)}
                        >
                            <Icon name="check" size={15} style={{color:'#FFF',marginRight:5,}}/>
                            <Text style={{
                                color:'#FFF',
                                fontFamily:'Roboto-Medium',
                                fontSize:14
                            }}>JOIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons,{marginHorizontal:5},
                        (this.state.userStatus == 1)?{backgroundColor:'#8da6d5'}:''
                        ]}
                            onPress={()=>this.setUserEventStatus(1)}
                        >
                            <Icon name="star" size={15} style={{color:'#FFF',marginRight:5,}}/>
                            <Text style={{
                                color:'#FFF',
                                fontFamily:'Roboto-Medium',
                                fontSize:14
                            }}>INTERESTED</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons       
                        ]}
                            onPress={()=>this.setUserEventStatus(3)}
                            >
                            <Icon name="ban" size={15} style={{color:'#FFF',marginRight:5,}}/>
                            <Text style={{
                                color:'#FFF',
                                fontFamily:'Roboto-Medium',
                                fontSize:14
                            }}>IGNORE</Text>
                        </TouchableOpacity>
                    </View>
                }
                
            </View>
        )
    }
}
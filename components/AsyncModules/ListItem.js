import React, { Component } from 'react';
import { View,Text,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from '../StyleSheet';
import ProgressiveImage from './ImageComponent';
import { withNavigation } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
let userStatus = '';
 class ListItem extends Component{
    constructor(props){
        super(props);
        this.state={
            userStatus:'',
            eventId:'',
            userID:this.props.userID
        }
    }
    checkEvent = ()=>{
        this.props.navigation.navigate('EventDetail',{event_id:this.state.eventId});
    }
    setUserEventStatus =  async (statusValue)=>{
        var curItem = await this.props.item;
        var user_id = this.props.userID;
        if(this.state.userStatus == statusValue){
            statusValue = 0;
        }
        fetch(SERVER_URL+'?action=changeUserEventStatus&user_id='+user_id+'&event_id='+curItem.group_id+'&status='+statusValue)
        .then(response=>{
            userStatus = statusValue;
            this.setState({userStatus:statusValue});
            if(statusValue == 1){
                Toast.show('You are interested to this event',Toast.SHORT);
            }
            else if(statusValue == 2){
                Toast.show('You are joined to this event',Toast.SHORT);
            }
            else if(statusValue ==3){
                Toast.show('You have ignored this event',Toast.SHORT);
            }
            this.props.refresh();
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
    formatDate(date){
        var dateStr = '';
        dateStr += (date.getDate() < 10)?'0'+date.getDate()+' ':date.getDate()+' ';
        var monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var month = monthArray[date.getMonth()];
        dateStr += month+' ';
        dateStr += date.getFullYear();
        return dateStr;
    }
    componentDidMount(){
        for(const uid in this.props.item.userIds){
            if(this.props.item.userIds[uid].user_id == this.props.userID){
                userStatus=this.props.item.userIds[uid].status;
                this.setState({userStatus:this.props.item.userIds[uid].status});
            }
        }
        this.setState({eventId:this.props.item.group_id});
    }
    render(){
        var d1 = new Date ();
        var d2 = new Date ( d1 );
        d2.setHours ( d1.getHours() + 24 );
        const Item = this.props.item;
        var date = Item.event_date+' '+Item.event_time;
        var eventDate = new Date(date);
        var N = 7;
        var Address = Item.address;//.split(" ").splice(0,N).join(" ");
        var eventTime = this.formatAMPM(eventDate);
        return (
            <View
            style={[
                (this.state.userStatus == 3)?{opacity:0.5}:'',
                {borderBottomColor:'#8da6d4',borderBottomWidth:1},
                (Item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                (eventDate.getTime() < d2.getTime() && eventDate.getTime() > d1.getTime())?{backgroundColor:'#FFFFFF'}:'']}>
                <TouchableOpacity style={[
                    MainStyles.EventItem,
                ]} onPress={this.checkEvent}>
                    <View style={MainStyles.EventItemImageWrapper}>
                        <ProgressiveImage source={{uri:Item.photoUrl}} style={{ width: 70, height: 70 }} resizeMode="cover"/>
                    </View>
                    <View style={MainStyles.EventItemTextWrapper}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name="thumb-tack" style={{color:'#8da6d4',marginRight:5}} size={13} />
                            <Text style={[MainStyles.EITWName,
                                (Item.isStarted === true)?{color:'#39b549'}:''
                            ]}>{Item.event_subject}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name="map-marker" style={{color:'#8da6d4',marginRight:5}} size={13} />
                            <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>{Item.name}</Text>
                        </View>
                        <Text style={[MainStyles.EITWAddress,{marginLeft:14}]}>{Address}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name="clock-o" style={{color:'#8da6d4',marginRight:5}} size={13} />
                            <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>{this.formatDate(eventDate)}, {eventTime}</Text>
                        </View>
                        <View style={MainStyles.EITWAction}>
                            <Image source={require('../../assets/u-icon.png')} style={{marginRight:5,width:20,height:15}}/>
                            <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOnline]}>({Item.usersCount}) </Text>
                            <Text style={{paddingHorizontal:15,paddingVertical:3,backgroundColor:'#8da6d4',fontFamily:'Roboto-Medium',color:'#FFF',borderRadius:15,marginLeft:8}}>Info</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                { 
                    this.state.userStatus != 3 && 
                    Item.usersCount < Item.usersPlace
                    && 
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
                            }}>Join</Text>
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
                            }}>Interested</Text>
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
                            }}>Ignore</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    Item.usersCount == Item.usersPlace
                    && 
                    <View style={[{paddingVertical:5,backgroundColor:'#8da6d4',justifyContent:'center',alignItems:'center'}]}>
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:15}}>No more places available</Text>
                    </View>
                }
            </View>
        )
    }
}
export default withNavigation(ListItem)
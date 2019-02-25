import React, { Component } from 'react';
import { View,Text,Image,Alert,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from '../StyleSheet';
import ProgressiveImage from './ImageComponent';
import { withNavigation } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import { SERVER_URL } from '../../Constants';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
let userStatus = '';
 class ListItem extends Component{
    constructor(props){
        super(props);
        this.state={
            userStatus:'',
            eventId:'',
            userID:this.props.userID,
            curItem:this.props.item
        }
    }
    checkEvent = ()=>{
        const {longitude, latitude } = this.state.curItem;
        const location = [+longitude, +latitude];
        
        this.props.navigation.navigate('EventDetail',{event_id:this.state.eventId, location});
    }
    utcDateToString = (momentInUTC) => {
        let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        // console.warn(s);
        return s;
    };
    setUserEventStatus =  async (statusValue)=>{
        
        
        if(this.state.userStatus == statusValue){
            statusValue = 0;
        }
        if(this.state.userStatus != statusValue){
            Alert.alert(
                'Add to Calendar?',
                'It will remind you',
                [
                    {
                        text: 'No',
                        onPress: () => {
                            this.setEventStatusOnServer(statusValue);
                        },
                        style: 'cancel',
                    },
                    {text: 'Yes', onPress: () => {
                    var m = moment(new Date(curItem.unix_event));
                    var mUTC = m.utc();
                    const eventConfig = {
                        title:curItem.event_subject,
                        startDate: this.utcDateToString(mUTC),
                        endDate: this.utcDateToString(moment.utc(mUTC).add(1, 'hours')),
                        notes: 'tasty!',
                        navigationBarIOS: {
                        tintColor: '#416bb9',
                        backgroundColor: '#8da6d5',
                        titleColor: '#2e4d85',
                        },
                    };
                    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
                    .then((eventInfo) => {this.setEventStatusOnServer(statusValue)})
                    .catch((error) => {console.warn(error);});
                }}],
                {cancelable: true},
            );
        }
    }
    setEventStatusOnServer = async (statusValue) => {
        var curItem = await this.props.item;
        var user_id = this.props.userID;
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
    componentWillReceiveProps(){
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
                        <ProgressiveImage source={{uri:this.state.curItem.photoUrl}} style={{ width: 70, height: 70 }} resizeMode="cover"/>
                    </View>
                    <View style={MainStyles.EventItemTextWrapper}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name="thumb-tack" style={{color:'#8da6d4',marginRight:5}} size={13} />
                            <Text style={[MainStyles.EITWName,
                                (Item.isStarted === true)?{color:'#39b549'}:''
                            ]}>{this.state.curItem.event_subject}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name="map-marker" style={{color:'#8da6d4',marginRight:5}} size={13} />
                            <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>{this.state.curItem.name}</Text>
                        </View>
                        <Text style={[MainStyles.EITWAddress,{marginLeft:14}]}>{Address}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name="clock-o" style={{color:'#8da6d4',marginRight:5}} size={13} />
                            <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>Local Time : {this.state.curItem.event_date_formated}</Text>
                        </View>
                        <View style={MainStyles.EITWAction}>
                            <Image source={require('../../assets/u-icon.png')} style={{marginRight:5,width:20,height:15}}/>
                            <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOnline]}>({this.state.curItem.usersCount}) </Text>
                            <Text style={{paddingHorizontal:15,paddingVertical:3,backgroundColor:'#8da6d4',fontFamily:'Roboto-Medium',color:'#FFF',marginLeft:8}}>Info</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* (this.state.userStatus == 2) */}
                { 
                    this.state.userStatus != 3 && 
                    this.state.curItem.usersCount < this.state.curItem.usersPlace
                    && 

                    <View style={MainStyles.EIAButtonsWrapper}>
                        <TouchableOpacity style={[MainStyles.EIAButtons,{borderRadius:0},
                        (this.state.userStatus == 2)?{backgroundColor:'#87d292'}:'']}
                        onPress={()=>this.setUserEventStatus(2)}>
                            {
                                this.state.userStatus == 2 && 
                                <Icon name="check" size={15} style={{color:'#FFF',marginRight:5}}/>
                            }
                            {
                                this.state.userStatus != 2 && 
                                <Text style={{
                                    color:'#FFF',
                                    fontFamily:'Roboto-Medium',
                                    fontSize:14
                                }}>Join</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons,{marginHorizontal:5,borderRadius:0},
                        (this.state.userStatus == 1)?{backgroundColor:'#8da6d5'}:''
                        
                        ]}
                            onPress={()=>this.setUserEventStatus(1)}
                        >
                            {
                                this.state.userStatus == 1 && 
                                <Icon name="star" size={15} style={{color:'#FFF',marginRight:5}}/>
                            }
                            {
                                this.state.userStatus != 1 && 
                                <Text style={{
                                    color:'#FFF',
                                    fontFamily:'Roboto-Medium',
                                    fontSize:14
                                }}>Interested</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons,{borderRadius:0}   
                        ]}
                            onPress={()=>this.setUserEventStatus(3)}
                            >
                            <Icon name="ban" size={15} style={{color:'#FFF',marginRight:5}}/>
                            <Text style={{
                                color:'#FFF',
                                fontFamily:'Roboto-Medium',
                                fontSize:14
                            }}>Ignore</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    this.state.curItem.usersCount == this.state.curItem.usersPlace
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
import React, { Component } from 'react';
import { View,Text,Image,Alert,TouchableOpacity,ImageBackground} from 'react-native';
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
            curItem:this.props.item,
            currentUsersCount:this.props.item.usersCount
        }
    }
    checkEvent = ()=>{
        const {longitude, latitude } = this.state.curItem;
        const location = [+longitude, +latitude];
        if (this.state.curItem.usersCount < this.state.curItem.usersPlace)
            this.props.navigation.push('EventDetail',{event_id:this.state.eventId, location});
    }
    utcDateToString = (momentInUTC) => {
        let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        // console.warn(s);
        return s;
    };
    setUserEventStatus =  async (statusValue)=>{
        var curItem = await this.props.item;
        if(this.state.userStatus != statusValue){
            if(statusValue != 3){
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
                    var m = moment(new Date(curItem.event_date_formated));
                    var mUTC = m.utc();
                    const eventConfig = {
                        title:curItem.event_subject,
                        startDate: this.utcDateToString(mUTC),
                        endDate: this.utcDateToString(moment.utc(mUTC).add(2, 'hours')),
                        notes: curItem.event_note,//'tasty!',
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
        else
        {
            if(this.state.userStatus == statusValue)
            {
                statusValue = 0;
            }
                this.setEventStatusOnServer(statusValue);
         }
        } 
    }
    setEventStatusOnServer = async (statusValue) => {
        var curItem = await this.props.item;
        var user_id = this.props.userID;
        fetch(SERVER_URL+'?action=changeUserEventStatus&user_id='+user_id+'&event_id='+curItem.group_id+'&status='+statusValue)
        .then(response=>{
            userStatus = statusValue;
            
            if(this.state.userStatus != 2 && this.state.userStatus != 1){
                this.setState({currentUsersCount:(this.state.currentUsersCount+1),userStatus});
            }
            this.setState({userStatus});
            if(statusValue == 1){
                Toast.show('You are interested to this event',Toast.SHORT);
            }
            else if(statusValue == 2){
                Toast.show('You are joined to this event',Toast.SHORT);
            }
            else if(statusValue ==3){
                Toast.show('You have ignored this event',Toast.SHORT);
            }
            else{
                this.setState({currentUsersCount:(this.state.currentUsersCount-1)});
            }
            
            //this.props.refresh();
        });
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
        /*for(const uid in this.props.item.userIds){
            if(this.props.item.userIds[uid].user_id == this.props.userID){
                userStatus=this.props.item.userIds[uid].status;
                this.setState({userStatus:this.props.item.userIds[uid].status});
            }
        }
        this.setState({eventId:this.props.item.group_id});*/
    }
    render(){
        var d1 = new Date ();
        var d2 = new Date ( d1 );
        d2.setHours ( d1.getHours() + 24 );
        let Item = this.props.item;
        var date = Item.event_date+' '+Item.event_time;
        var eventDate = new Date(date);
        var N = 7;
        var Address = Item.address;//.split(" ").splice(0,N).join(" ");
        var eventTime = this.formatAMPM(eventDate);
        return (
            <View
            style={[
                {marginBottom:10,flex:1},
                (this.state.userStatus == 3)?{opacity:0.5}:'',
                //(Item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                (eventDate.getTime() < d2.getTime() && eventDate.getTime() > d1.getTime())?{backgroundColor:'#FFFFFF'}:'']}>
                <TouchableOpacity style={[
                    MainStyles.EventItem,
                ]} onPress={this.checkEvent}>
                    <View style={MainStyles.EventItemImageWrapper}>
                        <ProgressiveImage source={{uri:this.state.curItem.photoUrl}} style={{ width: '100%', height: 170 }} resizeMode="cover"/>
                        <ImageBackground source={require('../../assets/box-shadow.png')} style={{
                            position:'absolute',
                            height:'100%',
                            width:'100%',
                        }}>
                            <View style={{
                                flex:1,
                                paddingBottom: 30,
                                paddingHorizontal:20,
                                justifyContent:'flex-end',
                            }}>
                                <Text style={{fontFamily:'Roboto-Regular',fontSize:18,color:'#FFFFFF'}}>{this.state.curItem.name}</Text>
                                <Text style={{fontFamily:'Roboto-Light',fontSize:14,color:'#FFFFFF'}}>{Address}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={MainStyles.EventItemTextWrapper}>
                        <View>
                            <View style={{flexDirection:'row', alignItems:'center',justifyContent:'flex-start'}}>
                                <Icon name="thumb-tack" style={{color:'#8da6d4',marginRight:5}} size={17} />
                                <Text style={[MainStyles.EITWName,
                                ]}>{this.state.curItem.event_subject}</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Icon name="clock-o" style={{color:'#8da6d4',marginRight:5}} size={13} />
                                <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>{this.state.curItem.event_date_formated}</Text>
                            </View>
                        </View>
                        <View style={[MainStyles.EITWAction]}>
                            <Image source={require('../../assets/u-icon.png')} style={{marginRight:5,width:20,height:15}}/>
                            <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOnline]}>({this.state.currentUsersCount}) </Text>
                            <TouchableOpacity onPress={()=>{
                                this.props.navigation.navigate("Event Chat", {
                                    event_id: this.state.eventId,
                                    note: this.state.curItem.event_note,
                                    subject: this.state.curItem.event_subject
                                  })
                            }} style={{paddingHorizontal:15,paddingVertical:3,backgroundColor:'#8da6d4',marginLeft:8,borderRadius:15}}>
                                <Text style={{fontFamily:'Roboto-Medium',color:'#FFF'}}>Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* (this.state.userStatus == 2) */}
                { 
                    this.state.userStatus != 3 && 
                    this.state.curItem.usersCount < this.state.curItem.usersPlace
                    && 

                    <View style={[MainStyles.EIAButtonsWrapper,{
                        shadowRadius:3,
                    shadowOpacity:0.8,
                    shadowOffset:{width:3,height:3},
                    elevation:3,
                    shadowColor:'#CCCCCC',
                    flex:1
                    }]}>
                        <TouchableOpacity style={[MainStyles.EIAButtons,{backgroundColor:'#FFFFFF',borderRadius:0,paddingVertical:10}]}
                        onPress={()=>this.setUserEventStatus(2)}>
                            <Icon name="check" size={15} style={{color:'#87d292',marginRight:5}}/>
                            {
                                this.state.userStatus != 2 && 
                                <Text style={{
                                    color:'#87d292',
                                    fontFamily:'Roboto-Medium',
                                    fontSize:15
                                }}>Join</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons,{marginHorizontal:5,borderRadius:0,backgroundColor:'#FFFFFF',paddingVertical:10}
                        ]}
                            onPress={()=>this.setUserEventStatus(1)}
                        >
                            <Icon name="star" size={15} style={{color:'#8da6d5',marginRight:5}}/>
                            {
                                this.state.userStatus != 1 && 
                                <Text style={{
                                    color:'#8da6d5',
                                    fontFamily:'Roboto-Medium',
                                    fontSize:15
                                }}>Interested</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons,{borderRadius:0,backgroundColor:'#FFFFFF',paddingVertical:10}   
                        ]}
                            onPress={()=>this.setUserEventStatus(3)}
                            >
                            <Icon name="ban" size={15} style={{color:'#8da6d5',marginRight:5}}/>
                            <Text style={{
                                color:'#8da6d5',
                                fontFamily:'Roboto-Medium',
                                fontSize:15
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
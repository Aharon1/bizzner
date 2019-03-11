import React, { Component } from 'react';
import { View,Text,TouchableOpacity, Image,
    Platform,FlatList,ActivityIndicator,AsyncStorage,
    RefreshControl,SafeAreaView
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import { HeaderButton } from './Navigation/HeaderButton';
import {SERVER_URL} from '../Constants';
import Loader from './Loader';
import ProgressiveImage from './AsyncModules/ImageComponent';
import _ from 'lodash';
class HistoryPageScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            locationList:{},
            isLocationSet:false,
            isLoading:false,
            enableScrollViewScroll: true,
            isRefreshing:false,
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.refreshList = this._refreshList.bind(this);
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount(){
        this.setUserId();
        setTimeout(()=>{
            this.refreshList();
        },200);
    }
    _refreshList(){
        var dateNow = new Date();
        var curMonth = ((dateNow.getMonth()+1) >= 10)?(dateNow.getMonth()+1):'0'+(dateNow.getMonth()+1);
        var curDate = (dateNow.getDate() >= 10)?dateNow.getDate():'0'+dateNow.getDate();
        var curDate = dateNow.getFullYear()+'-'+curMonth+'-'+curDate;
        var curMinute = (dateNow.getMinutes() >= 10)?dateNow.getMinutes():'0'+dateNow.getMinutes();
        var curSeconds = (dateNow.getSeconds() >= 10)?dateNow.getSeconds():'0'+dateNow.getSeconds();
        var curHours = (dateNow.getHours() >= 10)?dateNow.getHours():'0'+dateNow.getHours();
        var curTime = curHours+':'+curMinute+':'+curSeconds;
        this._fetchLists('user_id='+this.state.userID+'&curDate='+curDate+'&curTime='+curTime);
    }
    _fetchLists(params){
        var fetchData = SERVER_URL+'?action=events_history&'+params;
        fetch(fetchData,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Cache-Control': 'no-cache'
            }
        })
        .then(res=>res.json())
        .then(response=>{
            var results = response.results
            const placesArray = [];
            for (const bodyKey in results){
                placesArray.push({
                    name:results[bodyKey].group_name,
                    address:results[bodyKey].group_address,
                    isStarted:results[bodyKey].group_status,
                    photoUrl:results[bodyKey].photoUrl,
                    key:results[bodyKey].key,
                    event_date:results[bodyKey].event_date,
                    event_time:results[bodyKey].event_time,
                    event_subject:results[bodyKey].event_subject,
                    event_note:results[bodyKey].event_note,
                    latitude:results[bodyKey].latitude,
                    longitude:results[bodyKey].longitude,
                    place_id:results[bodyKey].place_id,
                    group_id:results[bodyKey].group_id,
                    usersPlace:results[bodyKey].usersPlace,
                    usersCount:results[bodyKey].usersCount,
                    userIds:results[bodyKey].usersIds,
                });
            }
            this.setState({loading:false,locationList:placesArray,isRefreshing:false});
        }).catch(err => {
            this.setState({loading:false,locationList:{},isRefreshing:false});
            console.log('Error What is this',err);
        }).done()
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
    render(){
        return (
            <SafeAreaView style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:18}}>EVENTS HISTORY</Text>
                </View>
                {
                    this.state.locationList && 
                    this.state.locationList.length > 0 &&  
                    <FlatList data={this.state.locationList}
                        renderItem={({item}) => { 
                            var d1 = new Date ();
                            var d2 = new Date ( d1 );
                            d2.setHours ( d1.getHours() + 24 );
                            var date = item.event_date+' '+item.event_time;
                            var eventDate = new Date(date);
                            var N = 7;
                            var Address = item.address;//.split(" ").splice(0,N).join(" ");
                            var eventTime = this.formatAMPM(eventDate);
                            return (
                            <View
                                style={[
                                    (this.state.userStatus == 3)?{opacity:0.5}:'',
                                    {borderBottomColor:'#8da6d4',borderBottomWidth:1},
                                    (item.isStarted === true)?MainStyles.EIOnline:MainStyles.EIOffline,
                                    (eventDate.getTime() < d2.getTime() && eventDate.getTime() > d1.getTime())?{backgroundColor:'#FFFFFF'}:'']}>
                                    <TouchableOpacity style={[
                                        MainStyles.EventItem,
                                    ]} onPress={() =>
                                        this.props.navigation.navigate("Event Chat", {
                                          event_id: item.event_id,
                                          note: item.event_note
                                        })
                                      }>
                                        <View style={MainStyles.EventItemImageWrapper}>
                                            <ProgressiveImage source={{uri:item.photoUrl}} style={{ width: 70, height: 70 }} resizeMode="cover"/>
                                        </View>
                                        <View style={MainStyles.EventItemTextWrapper}>
                                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                                <Icon name="thumb-tack" style={{color:'#8da6d4',marginRight:5}} size={13} />
                                                <Text style={[MainStyles.EITWName,
                                                    (item.isStarted === true)?{color:'#39b549'}:''
                                                ]}>{item.event_subject}</Text>
                                            </View>
                                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                                <Icon name="map-marker" style={{color:'#8da6d4',marginRight:5}} size={13} />
                                                <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>{item.name}</Text>
                                            </View>
                                            <Text style={[MainStyles.EITWAddress,{marginLeft:14}]}>{Address}</Text>
                                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                                <Icon name="clock-o" style={{color:'#8da6d4',marginRight:5}} size={13} />
                                                <Text style={[MainStyles.EITWAddress,{fontFamily:'Roboto-Light'}]}>{this.formatDate(eventDate)}, {eventTime}</Text>
                                            </View>
                                            <View style={MainStyles.EITWAction}>
                                                <Image source={require('../assets/u-icon.png')} style={{marginRight:5,width:20,height:15}}/>
                                                <Text style={[MainStyles.EITWActionText,MainStyles.EITWATOnline]}>({item.usersCount}) </Text>
                                                <Text style={{paddingHorizontal:15,paddingVertical:3,backgroundColor:'#8da6d4',fontFamily:'Roboto-Medium',color:'#FFF',borderRadius:15,marginLeft:8}}>Info</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                            }
                        }
                        keyExtractor={(item) => item.key}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={()=>{this.setState({isRefreshing:true}),this.refreshList()}}
                                title="Pull to refresh"
                                colors={["#2e4d85","red", "green", "blue"]}
                            />
                        }
                        viewabilityConfig={this.viewabilityConfig}
                    />
                }
                {
                    this.state.locationList.length == 0 && 
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'Roboto-Medium',color:'#2e4d85',fontSize:18}}>No events!</Text>
                        <TouchableOpacity 
                        onPress={this.refreshList}
                        style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#2e4d85',paddingHorizontal:15,marginTop:10,paddingVertical:5,borderRadius:50}}
                        >
                            <Icon name="repeat" style={{marginRight:10,color:'#FFF'}} size={16}/>
                            <Text style={{fontFamily:'Roboto-Regular',color:'#FFF',fontSize:16}}>Retry</Text>
                        </TouchableOpacity>
                    </View> 
                }
            </SafeAreaView>
        )
    }
}
export default HistoryPageScreen
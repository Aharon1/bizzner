import React, { Component } from 'react';
import { View,Text,TouchableOpacity, TextInput,ImageBackground, 
    Platform,FlatList,ActivityIndicator,AsyncStorage,
    RefreshControl,Picker,ScrollView,SafeAreaView
} from 'react-native';
import { DrawerActions,NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { SlideAnimation } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker';
import { HeaderButton } from './Navigation/HeaderButton';
import {SERVER_URL,MAPKEY} from '../Constants';
import Loader from './Loader';
import ListItem from './AsyncModules/ListItem';
import LocationItem from './AsyncModules/LocationItem';
import _ from 'lodash';
import Permissions from 'react-native-permissions'
class HistoryPageScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            locationList:{},
            MyEvents:{},
            isLocationSet:false,
            curLocation:{},
            SLValue:false,
            isLoading:false,
            SLItems:{},
            SCItems:{},
            enableScrollViewScroll: true,
            isFocusedSL:false,
            isFocusedSC:false,
            isSelectedCity:'',
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
        var fetchData = SERVER_URL+'?action=search_location_db&'+params;
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
    render(){
        return (
            <SafeAreaView style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:18}}>EVENTS</Text>
                </View>
                {
                    this.state.noFilterData==true && this.state.isFiltering==true &&
                    <Text>No Data</Text>
                }
                {
                    this.state.locationList && 
                    this.state.locationList.length > 0 &&  
                    this.state.noFilterData==false && 
                    <FlatList data={(this.state.renderedListData && this.state.renderedListData.length > 0)?this.state.renderedListData:this.state.locationList}
                        renderItem={({item}) => (
                            <ListItem item={item} userID={this.state.userID} refresh={this.refreshList}/>
                            )}
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
                    this.state.MyEvents.length == 0 &&
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
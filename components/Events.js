import React, { Component } from 'react';
import { View,Text,TouchableOpacity, TextInput,ImageBackground, Platform,FlatList,ActivityIndicator,ToastAndroid,Picker,ScrollView} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { SlideAnimation } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker';
import { HeaderButton } from './Navigation/HeaderButton';
import {SERVER_URL,MAPKEY} from '../Constants';
import Loader from './Loader';
import ListItem from './ListItem';
import LocationItem from './AsyncModules/LocationItem';
import _ from 'lodash';
import TabContainer from './TabContainer';
class EventsScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            TabComponent : '',
            CreateEventVisible:false,
            NES:'',
            NEN:'',
            NED:new Date(),
            NET:new Date(),
            locationList:{},
            MyEvents:{},
            isLocationSet:false,
            curLocation:{},
            textingValue:false,
            isLoading:false,
            locationItems:{},
            enableScrollViewScroll: true,
            isFocusedSL:false,
            isCurrentTab:'all-events'
        }
        this.getLocationList();
        this.hTC = this.handleTextChange.bind(this);
        this.onChangeTextDelayed = _.debounce(this.hTC, 600);
    }
    changeTab(Screen){
        this.setState({TabComponent:Screen});
    }
    fetchDetails = (curItem)=>{
        
        var curPic = 'http://bizzner.com/app/assets/images/default.jpg';
        if(typeof(curItem.photos) !== 'undefined'){
            if(typeof(curItem.photos[0].photo_reference) !== 'undefined'){
                curPic = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference='+curItem.photos[0].photo_reference+'&key=AIzaSyCJRgtLQrTsiDSPvz0hzKlEXisjf2UsBbM'
            }
            else{
                curPic = curItem.photos;
            }
        }
        let locItem = {
            name:curItem.name,
            latitude:curItem.geometry.location.latitude,
            longitude:curItem.geometry.location.longitude,
            address:curItem.formatted_address,
            picUrl:curPic,
            place_id:curItem.place_id
        };
        this.setState({isLocationSet:true,curLocation:locItem,CreateEventVisible:true,textingValue:false});
    }
    createNewEvent = () => {
        this.setState({loading:true});
        var postUrl = SERVER_URL+'?action=create_event';
        var NES  = this.state.NES ;
        var NEN  = this.state.NEN ;
        var NED  = this.state.NED ;
        var NET  = this.state.NET ;
        var NEUsersCount  = this.state.NEUsersCount ;
        var cL = this.state.curLocation;
        var params = '&newEventSubject='+encodeURIComponent(NES)+
        '&newEventNote='+encodeURIComponent(NEN)+
        '&newEventDate='+encodeURIComponent(NED)+
        '&newEventTime='+encodeURIComponent(NET)+
        '&newEventUsersCount='+encodeURIComponent(NEUsersCount)+
        '&name='+encodeURIComponent(cL.name)+
        '&address='+encodeURIComponent(cL.address)+
        '&place_id='+encodeURIComponent(cL.place_id)+
        '&latitude='+encodeURIComponent(cL.latitude)+
        '&longitude='+encodeURIComponent(cL.longitude)+
        '&picUrl='+encodeURIComponent(cL.picUrl)+
        '&device='+encodeURIComponent(Platform.OS)+
        '&userId=29';
        var postUrlParam = postUrl+params;
        fetch(postUrlParam,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(response=>response.json())
        .then(response=>{
            var locList = this.state.locationList;
            //locList.splice(locList.findIndex(v => v.key === response.body.key),1);
            locList = locList.filter(function( obj ) {
                return obj.key !== response.body.key;
            });
            var rBody = response.body;
            var eventAdded = {
                name:rBody.group_name,
                address:rBody.group_address,
                isStarted:rBody.group_status,
                photoUrl:rBody.group_pic,
                key:rBody.place_id,
                event_date:rBody.event_date,
                event_time:rBody.event_time,
                event_subject:rBody.event_subject,
                event_note:rBody.event_note,
                latitude:rBody.latitude,
                longitude:rBody.longitude,
                place_id:rBody.place_id
            }
            locList.unshift(eventAdded);
            console.log(response.body);
            this.setState({
                locationList:locList,
                loading:false,
                CreateEventVisible:false,
                NES:'',
                NEN:'',
                NED:new Date(),
                NET:new Date(),
            });
        })
    }
    getLocationList(){
        navigator.geolocation.getCurrentPosition(positions=>{
            let Latitude = positions.coords.latitude;
            let Longitude = positions.coords.longitude;
            var fetchData = 'http://bizzner.com/app?action=search_location_db&latitude='+Latitude+'&longitude='+Longitude;
            fetch(fetchData,{
                method:'POST',
                body:JSON.stringify({
                    action:'search_location_db',
                    latitude:Latitude,//22.7150822,
                    longitude:Longitude//75.8707448
                })
            })
            .then(response=>{
                var bodyText = JSON.parse(response._bodyText);
                var results = bodyText.results
                const placesArray = [];
                for (const bodyKey in results){
                    placesArray.push({
                        name:results[bodyKey].group_name,
                        address:results[bodyKey].group_address,
                        isStarted:results[bodyKey].group_status,
                        photoUrl:results[bodyKey].photoUrl,
                        key:results[bodyKey].place_id,
                        event_date:results[bodyKey].event_date,
                        event_time:results[bodyKey].event_time,
                        event_subject:results[bodyKey].event_subject,
                        event_note:results[bodyKey].event_note,
                        latitude:results[bodyKey].latitude,
                        longitude:results[bodyKey].longitude,
                        place_id:results[bodyKey].place_id,
                        group_id:results[bodyKey].group_id,
                        usersCount:results[bodyKey].usersCount,
                        userIds:results[bodyKey].usersIds,
                    });
                }
                var MyEvents = placesArray.filter((item)=>{
                    console.log(item);
                    for(const uid in item.userIds){
                        if(item.userIds[uid].user_id = "29"){
                            return true;
                        }
                    }
                })
                this.setState({loading:false,locationList:placesArray,MyEvents:MyEvents});
            }).catch(err => {
                console.log('Error What is this',err);
            })
        },error=>{
            console.log('Error',error);
        })
    }
    handleTextChange(text){
        if(text.length > 9){
            this.setState({isLoading:true,textingValue:true,locationItems:{}});
            var fetchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+text+"&fields=photos,formatted_address,name,rating,place_id,geometry&key="+MAPKEY
            fetch(fetchUrl)
            .then(response=>response.json())
            .then(res=>{
                console.log(res);
                if(res.status == 'ZERO_RESULTS'){
                    this.setState({locationItems:{}})
                }
                else{
                    this.setState({locationItems:res.results})
                }
                this.setState({isLoading:false})
            })
        }
        else{
            this.setState({textingValue:false})
        }
    }
    switchEventTabs(tab){
        this.setState({isCurrentTab:tab});
    }
    gotEventsList(){
        this.setState({TabComponent:''});
        this.props.navigation.navigate('Home');
    }
    render(){
        return (
            <View style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>EVENTS</Text>
                </View>
                
                <View style={[MainStyles.tabContainer,{justifyContent:'space-between',alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,(this.state.TabComponent == '') ? MainStyles.tabItemActive : null]} onPress={()=>this.gotEventsList()}>
                        <Icon name="ellipsis-v" style={[MainStyles.tabItemIcon,(this.state.TabComponent == '') ? MainStyles.tabItemActiveIcon : null]}/>
                        <Text style={[MainStyles.tabItemIcon,(this.state.TabComponent == '') ? MainStyles.tabItemActiveText : null]}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                        ]} onPress={()=>this.changeTab('map')}>
                        <Icon name="globe" style={[MainStyles.tabItemIcon,(this.state.TabComponent == 'map') ? MainStyles.tabItemActiveIcon : null]}/>
                        <Text style={[MainStyles.tabItemIcon,(this.state.TabComponent == 'map') ? MainStyles.tabItemActiveText : null]}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.tabItem} onPress={()=>this.setState({CreateEventVisible:true})}>
                        <Icon name="calendar-o" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemIcon}>Create Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.tabItem}>
                        <Icon name="search" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemText}>Search</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.TabComponent != '' &&
                    <TabContainer showContainer={{
                    TabComponent:this.state.TabComponent,
                    }} 
                    navigation={this.props.navigation}
                    />
                }
                <View style={MainStyles.EventScreenTabWrapper}>
                    <TouchableOpacity style={MainStyles.ESTWItem} onPress={()=>this.switchEventTabs('all-events')}>
                        <Text style={[MainStyles.ESTWIText,(this.state.isCurrentTab == 'all-events')?{color:'#FFF'}:{color:'#8da6d5'}]}>ALL EVENTS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.ESTWItem} onPress={()=>this.switchEventTabs('my-events')}>
                        <Text style={[MainStyles.ESTWIText,(this.state.isCurrentTab == 'my-events')?{color:'#FFF'}:{color:'#8da6d5'}]}>MY EVENTS</Text>
                    </TouchableOpacity>
                </View>
                { 
                    this.state.isCurrentTab == 'all-events' && 
                    this.state.locationList.length > 0 && 
                    <FlatList data={this.state.locationList}
                        renderItem={({item}) => (
                            <ListItem item={item} fetchDetails={this.fetchDetails} navigate={this.props.navigation.navigate}/>
                            )}
                        keyExtractor={(item) => item.key}
                    />
                }
                {
                    this.state.isCurrentTab == 'my-events' && 
                    this.state.MyEvents.length > 0 && 
                    <FlatList data={this.state.MyEvents}
                        renderItem={({item}) => (
                            <ListItem item={item} fetchDetails={this.fetchDetails} navigate={this.props.navigation.navigate}/>
                            )}
                        keyExtractor={(item) => item.key}
                    />
                }
                <Dialog
                    visible={this.state.CreateEventVisible}
                    dialogStyle={[MainStyles.confirmPopup,{width:'95%',padding:0,maxHeight:'95%'}]}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{zIndex: 10,flex:1,justifyContent: 'space-between',}}
                    rounded={false}
                    >
                    <View style={[MainStyles.confirmPopupHeader,{alignItems:'center',justifyContent:'flex-start',flexDirection:'row',backgroundColor:'#416bb9'}]}>
                        <TouchableOpacity onPress={()=>{this.setState({CreateEventVisible:false,isLocationSet:false,curLocation:{}})}}>
                            <Icon name="times" style={{fontSize:20,color:'#FFF'}}/>
                        </TouchableOpacity>
                        <Text style={{color:'#FFF',fontFamily: 'RobotoMedium',fontSize:17,marginLeft:20}}>CREATE NEW EVENT</Text>
                    </View>
                    {
                        this.state.isLocationSet == true &&
                        (<View style={{width:'100%',marginTop:0,marginBottom:0, height:200,}}>
                            <ImageBackground source={{uri:this.state.curLocation.picUrl}} style={{width: '100%', height: 200,flex:1,resizeMode:'center'}} resizeMode="cover">   
                                <TouchableOpacity style={{position:'absolute',right:10,top:10}} onPress={()=>{this.setState({isLocationSet:false,curLocation:{}})}}>
                                    <Icon name="pencil" size={20} color="#FFF" />
                                </TouchableOpacity>
                                <View style={{
                                        color: 'white',
                                        position: 'absolute', // child
                                        bottom: 0, // position where you want
                                        left: 0,
                                        paddingLeft:20,
                                        paddingRight:40,
                                        paddingBottom:20
                                    }}>
                                    <Text style={{textAlign:'left', color:'#FFF',fontFamily:'Roboto-Regular',fontSize:18}}>{this.state.curLocation.name}</Text>
                                    <Text style={{textAlign:'left',color:'#FFF',fontFamily:'Roboto-Light',fontSize:16}}>{this.state.curLocation.address}</Text>
                                </View>
                            </ImageBackground>
                        </View>)
                    }
                    <View style={{padding:0,borderWidth: 0,backgroundColor:'#FFF',overflow:'visible'}} 
                    onStartShouldSetResponderCapture={() => {
                        this.setState({ enableScrollViewScroll: true });
                    }}
                    >
                        <ScrollView 
                        contentContainerStyle={{
                            paddingHorizontal:15,
                        }}
                        scrollEnabled={this.state.enableScrollViewScroll} 
                        ref={myScroll => (this._myScroll = myScroll)}
                        >
                            {
                                this.state.isLocationSet == false && 
                                <View style={{zIndex:40}}>
                                    <View style={[
                                        MainStyles.createEventFWI,
                                        {
                                            marginTop:10,
                                            
                                        },
                                        (this.state.isFocusedSL == true)?{borderWidth:1,borderColor:'#8da6d4',paddingHorizontal:10}:''
                                        ]}>
                                        <Icon name="search" style={MainStyles.cEFWIIcon}/>
                                        <TextInput style={MainStyles.cEFWITF} 
                                            placeholder="Places Near Me" 
                                            placeholderTextColor="#03163a" 
                                            underlineColorAndroid="transparent"
                                            onChangeText={this.onChangeTextDelayed}
                                            onFocus={()=>this.setState({isFocusedSL:true})}
                                            onBlur={()=>this.setState({isFocusedSL:false})}
                                        />
                                    </View>
                                </View>
                            }
                            {
                                this.state.textingValue &&  
                                <View style={MainStyles.locationItemWrapper} onStartShouldSetResponderCapture={() => {
                                    this.setState({ enableScrollViewScroll: false });
                                    if (this._myScroll.contentOffset === 0
                                        && this.state.enableScrollViewScroll === false) {
                                        this.setState({ enableScrollViewScroll: true });
                                    }
                                    }}>
                                    {this.state.isLoading && <ActivityIndicator size="large" color="#416bb9"/>}
                                    {
                                        this.state.locationItems.length > 0 && 
                                        <FlatList data={this.state.locationItems}
                                            renderItem={({item}) => (
                                                <LocationItem
                                                    {...item}
                                                    fecthDetails={this.fetchDetails}
                                                />
                                            )}
                                            keyExtractor={(item) => item.place_id}
                                        />
                                    }
                                </View> 
                            }
                            <View style={[MainStyles.createEventFWI]}>
                                <Icon name="thumb-tack" style={MainStyles.cEFWIIcon}/>
                                <TextInput style={MainStyles.cEFWITF} placeholder="Subject" onChangeText={(text)=>{this.setState({NES:text})}} placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                            </View>
                            <View style={MainStyles.createEventFWI}>
                                <Icon name="bell" style={MainStyles.cEFWIIcon}/>
                                <TextInput style={MainStyles.cEFWITF} placeholder="Note" onChangeText={(text)=>{this.setState({NEN:text})}} placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                            </View>
                            <View style={MainStyles.createEventFWI}>
                                <Icon name="users" style={MainStyles.cEFWIIcon}/>
                                <Picker
                                    selectedValue={this.state.userCount}
                                    style={MainStyles.cEFWIPF}
                                    onValueChange={(itemValue, itemIndex) => this.setState({userCount: itemValue})}>
                                    <Picker.Item label="5-10" value="10" />
                                    <Picker.Item label="10-15" value="15" />
                                    <Picker.Item label="15-20" value="20" />
                                </Picker>
                            </View>
                            <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',marginBottom:30}}>
                                <View style={MainStyles.createEventFWI}>
                                    <Icon name="calendar" style={MainStyles.cEFWIIcon}/>
                                    <DatePicker
                                        style={{width: '75%'}}
                                        date={this.state.NED}
                                        mode="date"
                                        placeholder="Select Date"
                                        format="DD/MM/YYYY"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false} 
                                        onDateChange={(date) => {this.setState({NED: date})}}
                                        customStyles={{
                                            dateInput:MainStyles.cEFWIDF
                                        }}
                                    />
                                </View>
                                <View style={[MainStyles.createEventFWI]}>
                                    <Icon name="clock-o" style={MainStyles.cEFWIIcon}/>
                                    <DatePicker
                                        style={{width: '75%'}}
                                        date={this.state.NET}
                                        mode="time"
                                        placeholder="Select Time"
                                        format="hh:mm"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false} 
                                        onDateChange={(time) => {this.setState({NET: time})}}
                                        customStyles={{
                                            dateInput:MainStyles.cEFWIDF
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[MainStyles.btnWrapper,{justifyContent:'center',flex:1,alignItems:'center',marginBottom:10}]}>
                                <TouchableOpacity style={[MainStyles.btnSave,{marginBottom:0,flex:1}]} onPress={this.createNewEvent}>
                                    <Text style={MainStyles.btnSaveText}>Create Event</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Dialog>
            </View>
        )
    }
}
export default EventsScreen
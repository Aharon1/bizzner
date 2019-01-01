import React, { Component } from 'react';
import { View,Text,TouchableOpacity, TextInput,ImageBackground, Platform,FlatList,ActivityIndicator,ToastAndroid,Picker,ScrollView,PermissionsAndroid} from 'react-native';
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
import Permissions from 'react-native-permissions'
class EventsScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
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
            SLValue:false,
            isLoading:false,
            SLItems:{},
            SCItems:{},
            enableScrollViewScroll: true,
            isFocusedSL:false,
            isFocusedSC:false,
            isSelectedCity:'',
            isCurrentTab:'all-events'
        }
        //this.getLocationList();
        this.hSL = this.handleSL.bind(this);
        this.hSC = this.handleSC.bind(this);
        this.onChangeSLDelayed = _.debounce(this.hSL, 200);
        this.onChangeSCDelayed = _.debounce(this.hSC, 200);
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
            latitude:curItem.geometry.location.lat,
            longitude:curItem.geometry.location.lng,
            address:curItem.formatted_address,
            picUrl:curPic,
            place_id:curItem.place_id
        };
        this.setState({isLocationSet:true,curLocation:locItem,CreateEventVisible:true,SLValue:false,enableScrollViewScroll:true});
    }
    createNewEvent = () => {
        if(this.state.NES == ''){
            ToastAndroid.showWithGravity('Event Subject cannot be blank',ToastAndroid.BOTTOM);
            return false;
        }
        if(this.state.NEN == ''){
            ToastAndroid.showWithGravity('Event Not cannot be blank',ToastAndroid.BOTTOM);
            return false;
        }
        if(this.state.NEUsersCount == ''){
            ToastAndroid.showWithGravity('Please choose number of attendee',ToastAndroid.BOTTOM);
            return false;
        }
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
            console.log(response);
            if(response.code == 300){
                var locList = this.state.locationList;
                var rBody = response.body;
                var eventAdded = {
                    name:rBody.group_name,
                    address:rBody.group_address,
                    isStarted:rBody.group_status,
                    photoUrl:rBody.group_pic,
                    key:rBody.key,
                    event_date:rBody.event_date,
                    event_time:rBody.event_time,
                    event_subject:rBody.event_subject,
                    event_note:rBody.event_note,
                    latitude:rBody.latitude,
                    longitude:rBody.longitude,
                    place_id:rBody.place_id,
                    group_id:rBody.group_id,
                    usersCount:rBody.usersCount,
                    userIds:rBody.usersIds,
                }
                locList.unshift(eventAdded);
                console.log(response);
                this.setState({
                    locationList:locList,
                    loading:false,
                    CreateEventVisible:false,
                    NES:'',
                    NEN:'',
                    NED:new Date(),
                    NET:new Date(),
                });
                ToastAndroid.showWithGravity('Event created successfully',ToastAndroid.SHORT,ToastAndroid.BOTTOM,
                25,
                50,);
            }
            else{
                console.log(response.code);
                ToastAndroid.showWithGravity('Event not created',ToastAndroid.SHORT,ToastAndroid.BOTTOM,
                25,
                50,);
                this.setState({
                    loading:false,
                    CreateEventVisible:false,
                    NES:'',
                    NEN:'',
                    NED:new Date(),
                    NET:new Date(),
                });
            }
        })
    }
    componentDidMount(){
        var dateNow = new Date();
        var curMonth = ((dateNow.getMonth()+1) >= 10)?(dateNow.getMonth()+1):'0'+(dateNow.getMonth()+1);
        var curDate = (dateNow.getDate() >= 10)?dateNow.getDate():'0'+dateNow.getDate();
        var curDate = dateNow.getFullYear()+'-'+curMonth+'-'+curDate;
        Permissions.check('location', { type: 'always' }).then(response => {
            if(response == "undetermined"){
                Permissions.request('location', { type: 'always' }).then(response => {
                    console.log(response)
                    if(response == "denied"){
                        this._fetchLists('user_id=29&curDate='+curDate);
                    }
                    else{
                        var Geolocation = navigator.geolocation;
                        Geolocation.getCurrentPosition(positions=>{
                            console.log(positions);
                            let Latitude = positions.coords.latitude;
                            let Longitude = positions.coords.longitude;
                            
                            //var fetchData = 'http://bizzner.com/app?action=search_location_db&latitude='+Latitude+'&longitude='+Longitude+'&curDate='+curDate;
                            this._fetchLists('latitude='+Latitude+'&longitude='+Longitude+'&curDate='+curDate);
                        },error=>{
                            console.log('Error',error);
                            this._fetchLists('user_id=29&curDate='+curDate);
                        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
                    }
                })
            }
            else if(response == "denied"){
                this._fetchLists('user_id=29&curDate='+curDate);
            }
            console.log(response);
        })
    }
    _fetchLists(params){
        var fetchData = 'http://bizzner.com/app?action=search_location_db&'+params;
        fetch(fetchData,{
            method:'POST',
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
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
                    usersCount:results[bodyKey].usersCount,
                    userIds:results[bodyKey].usersIds,
                });
            }
            var MyEvents = placesArray.filter((item)=>{
                for(const uid in item.userIds){
                    if(item.userIds[uid].user_id = "29"){
                        return true;
                    }
                }
            })
            this.setState({loading:false,locationList:placesArray,MyEvents:MyEvents});
        }).catch(err => {
            this.setState({loading:false,locationList:{},MyEvents:{}});
            console.log('Error What is this',err);
        })
    }
    handleSL(text){
        if(text.length > 2){
            this.setState({isLoading:true,SLValue:true,SLItems:{}});
            var fetchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+text+' '+this.state.isSelectedCity+"&fields=photos,formatted_address,name,rating,place_id,geometry&key="+MAPKEY
            fetch(fetchUrl)
            .then(response=>response.json())
            .then(res=>{
                if(res.status == 'OK'){
                    this.setState({SLItems:res.results})
                    
                }
                else{
                    this.setState({SLItems:{}})
                }
                this.setState({isLoading:false})
            })
        }
        else{
            this.setState({SLValue:false})
        }
    }
    handleSC(text){
        if(text.length > 2){
            this.setState({isLoadingSC:true,SCValue:true,SCItems:{}});
            var fetchUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+text+"&types=(cities)&key="+MAPKEY;
            fetch(fetchUrl)
            .then(response=>response.json())
            .then(res=>{
                if(res.status == 'OK'){
                    this.setState({SCItems:res.predictions})
                }
                else{
                    this.setState({SCItems:{}})
                }
                this.setState({isLoadingSC:false})
            })
        }
        else{
            this.setState({SCValue:false})
        }
    }
    citySet(description){
        this.setState({isSelectedCity:description,SCValue:false})
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
                    this.state.locationList && 
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
                    this.state.MyEvents &&
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
                    <View style={{padding:0,borderWidth: 0,backgroundColor:'#FFF',overflow:'visible'}} 
                    onStartShouldSetResponderCapture={() => {
                        this.setState({ enableScrollViewScroll: true });
                    }}
                    >
                        <ScrollView 
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{
                            paddingHorizontal:0,
                        }}
                        scrollEnabled={this.state.enableScrollViewScroll} 
                        ref={myScroll => (this._myScroll = myScroll)}
                        >
                            {
                                this.state.isLocationSet == true &&
                                <View style={{width:'100%',marginTop:0,marginBottom:0, height:150,}}>
                                    <ImageBackground source={{uri:this.state.curLocation.picUrl}} style={{width: '100%', height: 150,flex:1,resizeMode:'center'}} resizeMode="cover">   
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
                                </View>
                            }
                            {
                                this.state.isLocationSet == false && 
                                <View style={{zIndex:40,paddingHorizontal:15}}>
                                    <View style={[
                                        MainStyles.createEventFWI,{marginTop:10},
                                        (this.state.isFocusedSC == true)?{borderWidth:1,borderColor:'#8da6d4',paddingHorizontal:10}:''
                                        ]}>
                                        <Icon name="search" style={MainStyles.cEFWIIcon}/>
                                        <TextInput style={MainStyles.cEFWITF} 
                                            placeholder="City" 
                                            placeholderTextColor="#03163a" 
                                            underlineColorAndroid="transparent"
                                            onChangeText={(text)=>{this.setState({isSelectedCity:text}),this.onChangeSCDelayed(text)}}
                                            value={this.state.isSelectedCity}
                                            onFocus={()=>this.setState({isFocusedSC:true})}
                                            onBlur={()=>this.setState({isFocusedSC:false})}
                                        />
                                    </View>
                                    <View style={[
                                        MainStyles.createEventFWI,
                                        {
                                            marginTop:10,
                                            
                                        },
                                        (this.state.isFocusedSL == true)?{borderWidth:1,borderColor:'#8da6d4',paddingHorizontal:10}:''
                                        ]}>
                                        <Icon name="map-marker" style={MainStyles.cEFWIIcon}/>
                                        <TextInput style={MainStyles.cEFWITF} 
                                            placeholder="Places Near Me" 
                                            placeholderTextColor="#03163a" 
                                            underlineColorAndroid="transparent"
                                            onChangeText={this.onChangeSLDelayed}
                                            onFocus={()=>this.setState({isFocusedSL:true})}
                                            onBlur={()=>this.setState({isFocusedSL:false})}
                                        />
                                    </View>
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginTop:10,}}>
                                        <Text style={{color:'#0947b9',fontFamily:'Roboto-Medium'}}>Add location</Text>
                                    </View>
                                </View>
                            }
                            {
                                this.state.SCValue &&  
                                <View style={[MainStyles.locationItemWrapper,{top:61}]} onStartShouldSetResponderCapture={() => {
                                    this.setState({ enableScrollViewScroll: false });
                                    if (this._myScroll.contentOffset === 0
                                        && this.state.enableScrollViewScroll === false) {
                                        this.setState({ enableScrollViewScroll: true });
                                    }
                                    }}>
                                    {this.state.isLoadingSC && <ActivityIndicator size="large" color="#416bb9"/>}
                                    {
                                        this.state.SCItems.length > 0 && 
                                        <FlatList data={this.state.SCItems}
                                            keyboardShouldPersistTaps={'handled'}
                                            renderItem={({item}) => (
                                                <TouchableOpacity onPress={()=>this.citySet(item.description)} style={[MainStyles.locationItemBtn]}>
                                                    <View style={{flexWrap: 'wrap',paddingLeft:5,justifyContent:'center', alignItems:'flex-start'}}>
                                                        <Text style={{writingDirection:'ltr',textAlign:'left',fontFamily:'Roboto-Medium'}}>{item.description}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item) => item.place_id}
                                        />
                                    }
                                </View> 
                            }
                            {
                                this.state.SLValue &&  
                                <View style={[MainStyles.locationItemWrapper]} onStartShouldSetResponderCapture={() => {
                                    this.setState({ enableScrollViewScroll: false });
                                    if (this._myScroll.contentOffset === 0
                                        && this.state.enableScrollViewScroll === false) {
                                        this.setState({ enableScrollViewScroll: true });
                                    }
                                    }}>
                                    {this.state.isLoading && <ActivityIndicator size="large" color="#416bb9"/>}
                                    {
                                        this.state.SLItems.length > 0 && 
                                        <FlatList data={this.state.SLItems}
                                            keyboardShouldPersistTaps={'handled'}
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
                            <View style={{paddingHorizontal:15,marginBottom:15}}>
                                <View style={[MainStyles.createEventFWI]}>
                                    <Icon name="thumb-tack" style={MainStyles.cEFWIIcon}/>
                                    <TextInput style={MainStyles.cEFWITF} placeholder="Subject" onChangeText={(text)=>{this.setState({NES:text})}} returnKeyType="next" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                                </View>
                                <View style={MainStyles.createEventFWI}>
                                    <Icon name="bell" style={MainStyles.cEFWIIcon}/>
                                    <TextInput style={MainStyles.cEFWITF} placeholder="Note" onChangeText={(text)=>{this.setState({NEN:text})}} returnKeyType="next" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                                </View>
                                <View style={MainStyles.createEventFWI}>
                                    <Icon name="users" style={MainStyles.cEFWIIcon}/>
                                    <Picker
                                        selectedValue={this.state.NEUsersCount}
                                        returnKeyType="next"
                                        style={MainStyles.cEFWIPF}
                                        onValueChange={(itemValue, itemIndex) => this.setState({NEUsersCount: itemValue})}>
                                        <Picker.Item label="Number of Attendees" value="" />
                                        <Picker.Item label="5-10" value="10" />
                                        <Picker.Item label="10-15" value="15" />
                                        <Picker.Item label="15-20" value="20" />
                                    </Picker>
                                </View>
                                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',marginBottom:20}}>
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
                                <View style={[MainStyles.btnWrapper,{marginBottom:20}]}>
                                    <TouchableOpacity style={[MainStyles.btnSave]} onPress={this.createNewEvent}>
                                        <Text style={MainStyles.btnSaveText}>Create Event</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </ScrollView>
                    </View>
                </Dialog>
            </View>
        )
    }
}
export default EventsScreen
import React, { Component } from 'react';
import { View,Text,TouchableOpacity, TextInput,KeyboardAvoidingView,ImageBackground, Platform,FlatList,ActivityIndicator,ToastAndroid} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { DialogContent,SlideAnimation } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker';
import PlacesAutocomplete from './AsyncModules/PlacesAutocomplete';
<<<<<<< HEAD
=======
import { HeaderButton } from './Navigation/HeaderButton';
import {SERVER_URL} from '../Constants';
import Loader from './Loader';
import ListItem from './ListItem';
>>>>>>> MustafaCode
class EventsScreen extends Component{
    constructor(props){
        super(props);
        this.fetchMore = this._fetchMore.bind(this);
        this.state = {
            loading:false,
            TabComponent : 'EL',
            CreateEventVisible:false,
            NES:'',
            NEN:'',
            NED:new Date(),
            NET:new Date(),
            locationList:this.props.navigation.getParam('locationList'),
            isLocationSet:false,
            curLocation:{},
            isLoadingMore: false,
            npt:'',
            resultsLost:false
        }
    }
    changeTab(Screen){
        this.setState({TabComponent:Screen});
    }
    getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
    };
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
            address:curItem.vicinity,
            picUrl:curPic,
            place_id:curItem.place_id
        };
        this.setState({isLocationSet:true,curLocation:locItem,CreateEventVisible:true});
    }
    createNewEvent = () => {
        this.setState({loading:true});
        var postUrl = SERVER_URL+'?action=create_event';
        var NES  = this.state.NES ;
        var NEN  = this.state.NEN ;
        var NED  = this.state.NED ;
        var NET  = this.state.NET ;
        var data =JSON.stringify({
            //cL:this.state.curLocation,
            newEventSubject:NES,
            newEventNote:NEN,
            newEventDate:NED,
            newEventTime:NET,
            userId:29
        });
        var cL = this.state.curLocation;
        
        var params = '&newEventSubject='+encodeURIComponent(NES)+
        '&newEventNote='+encodeURIComponent(NEN)+
        '&newEventDate='+encodeURIComponent(NED)+
        '&newEventTime='+encodeURIComponent(NET)+
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
            },
            body:JSON.stringify({
                //cL:this.state.curLocation,
            })
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
    _fetchMore() {
        if(this.state.isLoadingMore == false){
            if(this.state.resultsLost==false){
                let npt = (this.state.npt == '' && this.state.resultsLost==false)?this.props.navigation.getParam('nextPageToken'):this.state.npt;
                if(npt != ''){
                    this.setState({ isLoadingMore: true });
                    var fetchData = 'http://bizzner.com/app?action=loadMoreLocations&npt='+npt;
                    fetch(fetchData,{
                        method:'POST',
                    })
                    .then(response=>{
                        var count = this.state.locationList.length
                        var bodyText = JSON.parse(response._bodyText);
                        var results = bodyText.results
                        const placesArray = [];
                        console.log(bodyText);
                        for (const bodyKey in results){
                            var currentR = results[bodyKey];
                            placesArray.push({
                                name:currentR.group_name,
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
                            });
                        }
                        if(bodyText.next_page_token == ''){
                            this.setState({resultsLost:true});
                        }
                        this.setState({ isLoadingMore: false,npt:bodyText.next_page_token,locationList:this.state.locationList.concat(placesArray) });
                    }).catch(err => {
                        console.log('Error What is this',err);
                    })
                }
            }
            else{
                ToastAndroid.show('No More Data', ToastAndroid.SHORT)
            }
        }
        
    }
    render(){
        return (
            <View style={MainStyles.normalContainer}>
                {this.props.navigation.getParam('nextPageToken') == '' && ToastAndroid.show('Over Query Limit', ToastAndroid.SHORT)}
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    {/* <TouchableOpacity style={{paddingLeft:12}}>
                        <Icon name="bars" style={{fontSize:24,color:'#8da6d5'}}/>
                    </TouchableOpacity> */}
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>Events near me</Text>
                </View>
                <View style={[MainStyles.tabContainer,{justifyContent:'space-between',alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,MainStyles.tabItemActive]} onPress={()=>this.props.navigation.navigate('Home')}>
                        <Icon name="ellipsis-v" style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveIcon]}/>
                        <Text style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveText]}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                        ]} onPress={()=>this.changeTab('map')}>
                        <Icon name="globe" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemIcon}>Map</Text>
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
<<<<<<< HEAD
                <TabContainer showContainer={{
                    TabComponent:this.state.TabComponent,
                    locationList:this.props.navigation.getParam('locationList'),
                    fetchDetails:this.fetchDetails,
                    npt:this.props.navigation.getParam('nextPageToken')
                    }} />
=======
                {/* <TabContainer showContainer={{
                    TabComponent:this.state.TabComponent,
                    locationList:this.state.locationList,
                    fetchDetails:this.fetchDetails,
                    npt:this.props.navigation.getParam('nextPageToken')
                    }} /> */}
                <FlatList data={this.state.locationList}
                    renderItem={({item}) => (
                        <ListItem item={item} fetchDetails={this.fetchDetails} navigate={this.props.navigation.navigate}/>
                        )}
                    onEndReached={()=>{this.fetchMore()}
                    }
                    keyExtractor={(item) => item.key}
                    ListFooterComponent={() => {
                        return (
                        this.state.isLoadingMore &&
                        <View style={{ flex: 1, padding: 10 }}>
                            <ActivityIndicator size="large" color="#416bb9"/>
                        </View>
                        );
                    }}
                />
>>>>>>> MustafaCode
                <Dialog
                    visible={this.state.CreateEventVisible}
                    dialogStyle={[MainStyles.confirmPopup,{width:'95%',padding:0,maxHeight:'95%'}]}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{zIndex: 10}}
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
                        (<View style={{width:'100%',marginTop:0,marginBottom:1, height:200,}}>
                            <ImageBackground source={{uri:this.state.curLocation.picUrl}} style={{width: '100%', height: 200}} resizeMode="cover"
                                style={{flex:1,resizeMode:'center'}}
                            >   
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
                    <DialogContent style={{padding:0,borderWidth: 0,backgroundColor:'#FFF'}}>
                        
                            <KeyboardAvoidingView style={{padding:5,marginTop:0}}>
                                {
                                    this.state.isLocationSet == false && 
                                    <PlacesAutocomplete style={{overflow: 'visible',zIndex:40}} fetchDetails={this.fetchDetails}/>
                                }
                                <View style={[MainStyles.createEventFWI]}>
                                    <Icon name="thumb-tack" style={MainStyles.cEFWIIcon}/>
                                    <TextInput style={MainStyles.cEFWITF} placeholder="Subject" onChangeText={(text)=>{this.setState({NES:text})}} placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                                </View>
                                <View style={MainStyles.createEventFWI}>
                                    <Icon name="bell" style={MainStyles.cEFWIIcon}/>
                                    <TextInput style={MainStyles.cEFWITF} placeholder="Note" onChangeText={(text)=>{this.setState({NEN:text})}} placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
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
                                                dateInput:{
                                                    borderWidth: 0,
                                                    paddingTop:0,
                                                    paddingBottom: 0,
                                                    paddingRight: 0,
                                                    paddingLeft: 0,
                                                    marginLeft:0,
                                                    height:'auto',
                                                    flex:1,
                                                    flexDirection:'row',
                                                    justifyContent:'flex-start'
                                                }
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
                                                dateInput:{
                                                    borderWidth: 0,
                                                    paddingTop:0,
                                                    paddingBottom: 0,
                                                    paddingRight: 0,
                                                    paddingLeft: 0,
                                                    marginLeft:0,
                                                    height:'auto',
                                                    flex:1,
                                                    flexDirection:'row',
                                                    justifyContent:'flex-start',
                                                    color:'#03163a'
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={[MainStyles.btnWrapper,{justifyContent:'center',flexDirection: 'row',marginTop:80}]}>
                                    <TouchableOpacity style={[MainStyles.btnSave,{marginBottom:0}]} onPress={this.createNewEvent}>
                                        <Text style={MainStyles.btnSaveText}>Create Event</Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                    </DialogContent>
                </Dialog>
            </View>
        )
    }
}
export default EventsScreen
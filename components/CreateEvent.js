import React, { Component } from 'react';
import { View,Text,TouchableOpacity,ActionSheetIOS,PickerIOS,SafeAreaView,
    Platform,ScrollView,TextInput,Picker,FlatList,ActivityIndicator,AsyncStorage,AlertIOS,
    KeyboardAvoidingView,ImageBackground,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import HardText from '../HardText';
import DatePicker from 'react-native-datepicker';
import {SERVER_URL,MAPKEY} from '../Constants';
import LocationItem from './AsyncModules/LocationItem';
import Loader from './Loader';
import _ from 'lodash';
import Permissions from 'react-native-permissions'
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
const { height, width } = Dimensions.get('window');
class CreateEvent extends Component{
    constructor(props){
        super(props);
        var curDate = new Date();
        curDate.setMinutes(curDate.getMinutes() + 30); // timestamp
        now = new Date(curDate); // Date object
        var day = (now.getDate() >=10)?now.getDate():'0'+now.getDate();
        var month = ((now.getMonth()+1) >=10)?(now.getMonth()+1):'0'+(now.getMonth()+1);
        var newDate = day+'/'+month+'/'+now.getFullYear();
        var newTime = now.getHours()+':'+now.getMinutes()+':00'
        this.state = {
            loading:true,
            NES:'',
            NEN:'',
            NED:newDate,
            NET:newTime,
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
            no_Attendees:'No. of Attendees',
            keyword:'',
            isGPSGranted:''
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.hSL = this.handleSL.bind(this);
        this.hSC = this.handleSC.bind(this);
        this.onChangeSLDelayed = _.debounce(this.hSL, 200);
        this.onChangeSCDelayed = _.debounce(this.hSC, 200);
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount(){
        this.setUserId();
        if(this.state.isGPSGranted){
            fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+this.state.curLat+","+this.state.curLng+"&rankby=distance&type=food&key="+MAPKEY)
            .then(res=>res.json())
            .then(response=>{
                var getCity = response.results[0].vicinity.split(', ');
                this.setState({isSelectedCity:getCity[getCity.length-1],loading:false});
            })
            .catch(err=>{
                console.log(err);
            });
        }
        else{
            Permissions.request('location', { type: 'always' }).then(response => {
                if(response == 'authorized'){
                    this.setState({isGPSGranted:true});
                    Geolocation.getCurrentPosition(
                        (position) => {
                            let Latitude = position.coords.latitude;
                            let Longitude = position.coords.longitude;
                            this.setState({curLat:Latitude,curLng:Longitude});
                            fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+Latitude+","+Longitude+"&rankby=distance&type=food&key="+MAPKEY)
                            .then(res=>res.json())
                            .then(response=>{
                                var getCity = response.results[0].vicinity.split(', ');
                                this.setState({isSelectedCity:getCity[getCity.length-1],loading:false});
                            })
                            .catch(err=>{
                                console.log(err);
                            });
                        },
                        (error) => {
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                }
                else{
                    this.setState({isGPSGranted:false,loading:false});
                }
            });
        }
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
        if(!this.state.isLocationSet){
            Toast.show('Please select event location',Toast.LONG);
            return false;
        }
        if(this.state.NES == ''){
            Toast.show('Event Subject cannot be blank',Toast.SHORT);
            return false;
        }
        if(this.state.NEUsersCount == ''){
            Toast.show('Please choose number of attendee',Toast.SHORT);
            return false;
        }
        if(typeof(this.state.NEUsersCount) == 'undefined'){
            this.setState({NEUsersCount:10});
        }
        var curTime = new Date();
        var choosenDate = this.state.NED.split('/');
        var tim30More = new Date((choosenDate[1]) + "/" + choosenDate[0] + "/" + choosenDate[2] + " " + this.state.NET.replace(':00','')+':00');
        var minutes = (tim30More.getTime() - curTime.getTime()) / (60 * 1000);
        if (minutes < 30) { 
                if(Platform.OS == 'ios'){
                    AlertIOS.alert(
                        "Warning",
                        "Please give at least 30 minutes notice before event starts"
                        );
                }
                else{
                    Toast.show("Please give at least 30 minutes notice before event starts", Toast.LONG)
                }
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
        '&userId='+this.state.userID;
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
            if(response.code == 300){
                Toast.show('Event created successfully',Toast.SHORT);
            }
            else{
                Toast.show('Event not created',Toast.SHORT);
                
            }
            this.setState({
                loading:false,
                CreateEventVisible:false,
                NES:'',
                NEN:'',
                isLocationSet:false,
                curLocation:{},
                SLItems:{},
                SCItems:{},
                isSelectedCity:'',
                SLValue:false
            });
            this.props.navigation.navigate('Current Events');
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
    pickerIos = ()=>{
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', '5-10','10-15','15-20'],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
                this.setState({NEUsersCount: 10,no_Attendees:'5-10'})
            }
            else if (buttonIndex === 2) {
                this.setState({NEUsersCount: 15,no_Attendees:'10-15'})
            }
            else if (buttonIndex === 3) {
                this.setState({NEUsersCount: 20,no_Attendees:'15-20'})
            }
            
          });
    }
    render(){
        
        const RemoveHiehgt = height - 50;
        var behavior = (Platform.OS == 'ios')?'padding':'';
        return (
            <SafeAreaView contentContainerStyle={{flex:1}}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.confirmPopupHeader,{alignItems:'center',justifyContent:'flex-start',flexDirection:'row',backgroundColor:'#416bb9'}]}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Current Events')}}>
                        <Icon name="times" style={{fontSize:20,color:'#FFF'}}/>
                    </TouchableOpacity>
                    <Text style={{color:'#FFF',fontFamily: 'Roboto-Medium',fontSize:17,marginLeft:20}}>{HardText.create_new_event}</Text>
                </View>
                <View style={{
                    height:RemoveHiehgt
                }} 
                onStartShouldSetResponderCapture={() => {
                    this.setState({ enableScrollViewScroll: true });
                }}
                >
                    <KeyboardAvoidingView enabled behavior={behavior} style={{flex:1}}>
                        <ScrollView 
                        style={{flex:1}}
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
                                            <Icon name="pencil" size={28} color="#FFF" />
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
                                    {
                                        this.state.isSelectedCity != '' && 
                                        <View style={[
                                            MainStyles.createEventFWI,
                                            {
                                                marginTop:10,
                                                
                                            },
                                            (this.state.isFocusedSL == true)?{borderWidth:1,borderColor:'#8da6d4',paddingHorizontal:10}:''
                                            ]}>
                                            <Icon name="map-marker" style={MainStyles.cEFWIIcon}/>
                                            <TextInput style={MainStyles.cEFWITF} 
                                                placeholder="Places " 
                                                placeholderTextColor="#03163a" 
                                                underlineColorAndroid="transparent"
                                                onChangeText={this.onChangeSLDelayed}
                                                onFocus={()=>this.setState({isFocusedSL:true})}
                                                onBlur={()=>this.setState({isFocusedSL:false})}
                                            />
                                        </View>
                                    }
                                    {/* <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginTop:10,}}>
                                        <Text style={{color:'#0947b9',fontFamily:'Roboto-Medium'}}>{HardText.add_location}</Text>
                                    </View> */}
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
                                            viewabilityConfig={this.viewabilityConfig}
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
                                            viewabilityConfig={this.viewabilityConfig}
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
                                    {
                                        Platform.OS == 'android' && 
                                        <Picker
                                        selectedValue={this.state.NEUsersCount}
                                        returnKeyType="next"
                                        style={MainStyles.cEFWIPF}
                                        textStyle={{fontSize: 17,fontFamily:'Roboto-Light'}}
                                        itemTextStyle= {{
                                            fontSize: 17,fontFamily:'Roboto-Light',
                                        }}
                                        itemStyle={[MainStyles.cEFWIPF,{fontSize: 17,fontFamily:'Roboto-Light'}]}
                                        onValueChange={(itemValue, itemIndex) => this.setState({NEUsersCount: itemValue})}>
                                            <Picker.Item label="Number of Attendees" value="" />
                                            <Picker.Item label="5-10" value="10" />
                                            <Picker.Item label="10-15" value="15" />
                                            <Picker.Item label="15-20" value="20" />
                                        </Picker>
                                    }
                                    {
                                        Platform.OS == 'ios' && 
                                        <TouchableOpacity style={[MainStyles.cEFWITF,{alignItems:'center'}]} onPress={()=>{this.pickerIos()}}>
                                            <Text style={{color:'#03163a',fontFamily:'Roboto-Light'}}>{this.state.no_Attendees}</Text>
                                        </TouchableOpacity>
                                        
                                    }
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
                                            format="HH:mm"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            showIcon={false} 
                                            onDateChange={(time) => {
                                                var curTime = new Date();
                                                var choosenDate = this.state.NED.split('/');
                                                var tim30More = new Date((choosenDate[1]) + "/" + choosenDate[0] + "/" + choosenDate[2] + " " + time+':00');
                                                var minutes = (tim30More.getTime() - curTime.getTime()) / (60 * 1000);
                                                if (minutes > 30) { 
                                                    this.setState({NET: time})
                                                }
                                                else{
                                                    setTimeout(()=>{
                                                        if(Platform.OS == 'ios'){
                                                            AlertIOS.alert(
                                                                "Warning",
                                                                "Please give at least 30 minutes notice before event starts"
                                                            );
                                                        }
                                                        else{
                                                            Toast.show("Please give at least 30 minutes notice before event starts", Toast.LONG)
                                                        }
                                                    },400)
                                                    
                                                }}}
                                            customStyles={{
                                                dateInput:MainStyles.cEFWIDF
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={[MainStyles.btnWrapper,{marginBottom:60,flex:1,flexDirection: 'row'}]}>
                                    <TouchableOpacity style={[MainStyles.btnSave]} onPress={this.createNewEvent}>
                                        <Text style={MainStyles.btnSaveText}>{HardText.create_event}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        );
    }
}
export default CreateEvent;
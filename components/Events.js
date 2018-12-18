import React, { Component } from 'react';
import { View,Text,TouchableOpacity, TextInput,KeyboardAvoidingView,ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import TabContainer from './TabContainer';
import Dialog, { DialogContent,SlideAnimation } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker';
import PlacesAutocomplete from './AsyncModules/PlacesAutocomplete';
class EventsScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            TabComponent : 'EL',
            CreateEventVisible:false,
            date:'',
            time:'',
            isLocationSet:false,
            curLocation:{}
        }
    }
    changeTab(Screen){
        this.setState({TabComponent:Screen});
    }
    fetchDetails = (curItem)=>{
        
        var curPic = 'http://bizzner.com/app/assets/images/default.jpg';
        if(typeof(curItem.photos) !== 'undefined'){
            if(typeof(curItem.photos[0].photo_reference) !== 'undefined'){
                curPic = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference='+curItem.photos[0].photo_reference+'&key=AIzaSyASrUOtfMI34ZKtw4CFKl0XzN9zNEo3yS0'
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
        console.log(locItem);
        this.setState({isLocationSet:true,curLocation:locItem,CreateEventVisible:true});
    }
    render(){
        return (
            <View style={MainStyles.normalContainer}>
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={{paddingLeft:12}}>
                        <Icon name="bars" style={{fontSize:24,color:'#8da6d5'}}/>
                    </TouchableOpacity>
                    <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>Events near me</Text>
                </View>
                <View style={[MainStyles.tabContainer,{justifyContent:'space-between',alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                         (this.state.TabComponent == 'EL') ? MainStyles.tabItemActive : null
                        ]} onPress={()=>this.changeTab('EL')}>
                        <Icon name="ellipsis-v" style={[MainStyles.tabItemIcon,
                         (this.state.TabComponent == 'EL') ? MainStyles.tabItemActiveIcon : null
                        ]}/>
                        <Text style={[MainStyles.tabItemIcon,
                         (this.state.TabComponent == 'EL') ? MainStyles.tabItemActiveText : null
                        ]}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                        ]} onPress={()=>this.changeTab('map')}>
                        <Icon name="globe" style={[MainStyles.tabItemIcon,
                         (this.state.TabComponent == 'map') ? MainStyles.tabItemActiveIcon : null
                        ]}/>
                        <Text style={[MainStyles.tabItemIcon,
                         (this.state.TabComponent == 'map') ? MainStyles.tabItemActiveText : null
                        ]}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.tabItem,
                        (this.state.TabComponent == 'CE') ? MainStyles.tabItemActive : null
                        ]} onPress={()=>this.setState({CreateEventVisible:true})}>
                        <Icon name="calendar-o" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemIcon}>Create Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.tabItem}>
                        <Icon name="search" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemText}>Search</Text>
                    </TouchableOpacity>
                </View>
                <TabContainer showContainer={{
                    TabComponent:this.state.TabComponent,
                    locationList:this.props.navigation.getParam('locationList'),
                    fetchDetails:this.fetchDetails,
                    npt:this.props.navigation.getParam('nextPageToken')
                    }} />
                <Dialog
                    visible={this.state.CreateEventVisible}
                    dialogStyle={MainStyles.confirmPopup}
                    dialogAnimation={new SlideAnimation()}
                    dialogStyle={{width:'95%',padding:0}} 
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
                        (<View style={{width:'100%',marginTop:0, height:200,marginBottom:20,}}>
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
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',fontSize:18}}>{this.state.curLocation.name}</Text>
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Light',fontSize:16}}>{this.state.curLocation.address}</Text>
                                </View>
                            </ImageBackground>
                        </View>)
                    }
                    <DialogContent style={{padding:0,borderWidth: 0,backgroundColor:'#FFF'}}>
                        
                        <View style={MainStyles.confirmPopupContent}>
                            <KeyboardAvoidingView style={{padding:5,marginTop:30}}>
                                {
                                    this.state.isLocationSet == false && 
                                    <PlacesAutocomplete style={{overflow: 'visible',zIndex:40}} fetchDetails={this.fetchDetails}/>
                                }
                                <View style={[MainStyles.createEventFWI]}>
                                    <Icon name="thumb-tack" style={MainStyles.cEFWIIcon}/>
                                    <TextInput style={MainStyles.cEFWITF} placeholder="Subject" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                                </View>
                                <View style={MainStyles.createEventFWI}>
                                    <Icon name="bell" style={MainStyles.cEFWIIcon}/>
                                    <TextInput style={MainStyles.cEFWITF} placeholder="Note" placeholderTextColor="#03163a" underlineColorAndroid="transparent"/>
                                </View>
                                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',marginBottom:30}}>
                                    <View style={MainStyles.createEventFWI}>
                                        <Icon name="calendar" style={MainStyles.cEFWIIcon}/>
                                        <DatePicker
                                            style={{width: '75%'}}
                                            date={this.state.date}
                                            mode="date"
                                            placeholder="Select Date"
                                            format="DD/MM/YYYY"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            showIcon={false} 
                                            onDateChange={(date) => {this.setState({date: date})}}
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
                                            date={this.state.time}
                                            mode="time"
                                            placeholder="Select Time"
                                            format="hh:mm"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            showIcon={false} 
                                            onDateChange={(time) => {this.setState({time: time})}}
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
                                    <TouchableOpacity style={[MainStyles.btnSave,{marginBottom:0}]}>
                                        <Text style={MainStyles.btnSaveText}>Create Event</Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </DialogContent>
                </Dialog>
            </View>
        )
    }
}
export default EventsScreen
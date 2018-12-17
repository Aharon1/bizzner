import React, { Component } from 'react';
import { View,Text,TouchableOpacity, TextInput,KeyboardAvoidingView,ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import TabContainer from './TabContainer';
import Dialog, { DialogContent,SlideAnimation } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker';
import PlacesAutocomplete from './AsyncModules/PlacesAutocomplete';
import ProgressiveImage from './ImageComponent';
import { HeaderButton } from './Navigation/HeaderButton';
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
    changeTab(Screen) {
        this.setState({ TabComponent: Screen });
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
                <View style={[MainStyles.eventsHeader, { alignItems: 'center', flexDirection: 'row' }]}>
                    <HeaderButton onPress={this.props.navigation.openDrawer} />
                    <Text style={{ fontSize: 20, color: '#8da6d5', marginLeft: 20 }}>Events near me</Text>
                </View>
                <View style={[MainStyles.tabContainer, { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'EL') ? MainStyles.tabItemActive : null
                    ]} onPress={() => this.changeTab('EL')}>
                        <Icon name="ellipsis-v" style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'EL') ? MainStyles.tabItemActiveIcon : null
                        ]} />
                        <Text style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'EL') ? MainStyles.tabItemActiveText : null
                        ]}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                    ]} onPress={() => this.changeTab('map')}>
                        <Icon name="globe" style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActiveIcon : null
                        ]} />
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
                        <Icon name="search" style={MainStyles.tabItemIcon} />
                        <Text style={MainStyles.tabItemText}>Search</Text>
                    </TouchableOpacity>
                </View>
                <TabContainer showContainer={{TabComponent:this.state.TabComponent,locationList:this.props.navigation.getParam('locationList'),fetchDetails:this.fetchDetails}} />
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
                                
                                {/*<GoogleAutoComplete apiKey="AIzaSyASrUOtfMI34ZKtw4CFKl0XzN9zNEo3yS0" debounce={500} minLength={3} queryTypes="address">
                                    {({
                                        handleTextChange,
                                        locationResults,
                                        fetchDetails,
                                        isSearching,
                                        inputValue,
                                        clearSearchs
                                    }) => (
                                        
                                        <React.Fragment>
                                            <View style={[MainStyles.createEventFWI,]}>
                                                <Icon name="search" style={MainStyles.cEFWIIcon}/>
                                                <TextInput style={MainStyles.cEFWITF} 
                                                placeholder="Search Location" 
                                                placeholderTextColor="#03163a" 
                                                underlineColorAndroid="transparent"
                                                
                                                onChangeText={handleTextChange}
                                                placeholder="Search Location"
                                                value={inputValue}
                                                />
                                            </View>
                                            isSearching && <ActivityIndicator size="large" color="#416bb9"/>
                                            {
                                                inputValue != '' && 
                                                <ScrollView style={{ 
                                                    width:'100%',
                                                    left:5,
                                                    maxHeight: 500,
                                                    position:'absolute',
                                                    backgroundColor:'#FFF',
                                                    flex:1,
                                                    flexDirection:'column',
                                                    zIndex: 20,
                                                    borderColor:'#8da6d4',
                                                    borderWidth:1,
                                                    paddingHorizontal:10,
                                                    paddingVertical:10,
                                                    top:20,
                                                    elevation:3,
                                                    borderBottomLeftRadius:10,
                                                    borderBottomRightRadius:10
                                                    }}>
                                                    {locationResults.map((el, i) => (
                                                        
                                                    <LocationItem
                                                        {...el}
                                                        fetchDetails={fetchDetails}
                                                        key={String(i)}
                                                    />
                                                    ))}
                                                </ScrollView>
                                            }
                                            
                                        </React.Fragment>
                                    )}
                                </GoogleAutoComplete>*/}
                                
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
                                <View style={[MainStyles.btnWrapper,{justifyContent:'center',flexDirection: 'row'}]}>
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
/*EventsScreen = createAppContainer(createMaterialTopTabNavigator({
    List: {
        screen:EventsList,
        navigationOptions:{
            title:'List',
            tabBarOptions:{
                labelStyle: {
                    fontSize: 16,
                    fontFamily: "Roboto-Light"
                },
                activeTintColor: "#6200EE",
                inactiveTintColor: "#858585",
                tabBarIcon: ({ tintColor }) => <Icon name="ellipsis-v" size={16} color={tintColor} />,
                //style: MainStyles.TabBar,
                tabBarPosition: "top",
                animationEnabled: true,
                swipeEnabled: true,
                showIcon:true
            }
            
        },
        
    },
    CreateEvent: {
        screen:CreateEvent,
        navigationOptions:{
            title:'Create Event',
            tabBarOptions:{
                labelStyle: {
                    fontSize: 16,
                    fontFamily: "Roboto-Light"
                },
                activeTintColor: "#6200EE",
                inactiveTintColor: "#858585",
                iconStyle:{
                    fontSize: 16
                },
                tabBarIcon: ({ tintColor }) => <Icon name="calendar" size={16} color={tintColor} />,
                //style: MainStyles.TabBar,
                tabBarPosition: "top",
                animationEnabled: true,
                swipeEnabled: true,
                showIcon:true
            },
            
        },
        
    }
},{
    
}));*/
export default EventsScreen
import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, ImageBackground,
    Platform, FlatList, ActivityIndicator, AlertIOS, KeyboardAvoidingView,
    RefreshControl, Picker, ScrollView, SafeAreaView, ActionSheetIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { SlideAnimation } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker';
import Footer from './Navigation/Footer';
import { SERVER_URL, MAPKEY } from '../Constants';
import ListItem from './AsyncModules/ListItem';
import LocationItem from './AsyncModules/LocationItem';
import _ from 'lodash';
import TabContainer from './TabContainer';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import HardText from '../HardText';
import Axios from 'axios';
import { loadingChange, ShowSearchAction } from '../Actions';
import { connect } from 'react-redux';
class EventsScreen extends Component {
    constructor(props) {
        super(props);
        var curDate = new Date();
        curDate.setMinutes(curDate.getMinutes() + 30); // timestamp
        now = new Date(curDate); // Date object
        var day = (now.getDate() >= 10) ? now.getDate() : '0' + now.getDate();
        var month = ((now.getMonth() + 1) >= 10) ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
        var newDate = day + '/' + month + '/' + now.getFullYear();
        var newTime = now.getHours() + ':' + now.getMinutes() + ':00'
        this.state = {
            TabComponent: '',
            CreateEventVisible: false,
            NES: '',
            NEN: '',
            NED: newDate,
            NET: newTime,
            locationList: {},
            MyEvents: {},
            isLocationSet: false,
            curLocation: {},
            SLValue: false,
            isLoading: false,
            SLItems: {},
            SCItems: {},
            enableScrollViewScroll: true,
            isFocusedSL: false,
            isFocusedSC: false,
            isSelectedCity: '',
            isCurrentTab: 'all-events',
            isRefreshing: true,
            isSearchOpen: false,
            noFilterData: false,
            isFiltering: false,
            no_Attendees: 'No. of Attendees',
            keyword: '',
            isGPSGranted: ''
        }
        this.currentRouteName = 'Main';
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.refreshList = this._refreshList.bind(this);
        //this.getLocationList();
        this.hSL = this.handleSL.bind(this);
        this.hSC = this.handleSC.bind(this);
        this.onChangeSLDelayed = _.debounce(this.hSL, 200);
        this.onChangeSCDelayed = _.debounce(this.hSC, 200);

    }
    changeTab(Screen) {
        this.setState({ TabComponent: Screen });
    }
    fetchDetails = (curItem) => {
        var curPic = 'http://bizzner.com/app/assets/images/default.jpg';
        if (typeof (curItem.photos) !== 'undefined') {
            if (typeof (curItem.photos[0].photo_reference) !== 'undefined') {
                curPic = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=' + curItem.photos[0].photo_reference + '&key=AIzaSyCJRgtLQrTsiDSPvz0hzKlEXisjf2UsBbM'
            }
            else {
                curPic = curItem.photos;
            }
        }
        let locItem = {
            name: curItem.name,
            latitude: curItem.geometry.location.lat,
            longitude: curItem.geometry.location.lng,
            address: curItem.formatted_address,
            picUrl: curPic,
            place_id: curItem.place_id
        };
        this.setState({ isLocationSet: true, curLocation: locItem, CreateEventVisible: true, SLValue: false, enableScrollViewScroll: true });
    }
    createNewEvent = () => {
        if (!this.state.isLocationSet) {
            Toast.show('Please select event location', Toast.LONG);
            return false;
        }
        if (this.state.NES == '') {
            Toast.show('Event Subject cannot be blank', Toast.SHORT);
            return false;
        }
        if (this.state.NEUsersCount == '') {
            Toast.show('Please choose number of attendee', Toast.SHORT);
            return false;
        }
        if (typeof (this.state.NEUsersCount) == 'undefined') {
            this.setState({ NEUsersCount: 10 });
        }
        var curTime = new Date();
        var choosenDate = this.state.NED.split('/');
        var tim30More = new Date((choosenDate[1]) + "/" + choosenDate[0] + "/" + choosenDate[2] + " " + this.state.NET.replace(':00', '') + ':00');
        var minutes = (tim30More.getTime() - curTime.getTime()) / (60 * 1000);
        if (minutes < 30) {
            if (Platform.OS == 'ios') {
                AlertIOS.alert(
                    "Warning",
                    "Please give at least 30 minutes notice before event starts"
                );
            }
            else {
                Toast.show("Please give at least 30 minutes notice before event starts", Toast.LONG)
            }
            return false;
        }
        this.props.loadingChangeAction(true);
        var postUrl = SERVER_URL + '?action=create_event';
        var NES = this.state.NES;
        var NEN = this.state.NEN;
        var NED = this.state.NED;
        var NET = this.state.NET;
        var NEUsersCount = this.state.NEUsersCount;
        var cL = this.state.curLocation;
        var params = '&newEventSubject=' + encodeURIComponent(NES) +
            '&newEventNote=' + encodeURIComponent(NEN) +
            '&newEventDate=' + encodeURIComponent(NED) +
            '&newEventTime=' + encodeURIComponent(NET) +
            '&newEventUsersCount=' + encodeURIComponent(NEUsersCount) +
            '&name=' + encodeURIComponent(cL.name) +
            '&address=' + encodeURIComponent(cL.address) +
            '&place_id=' + encodeURIComponent(cL.place_id) +
            '&latitude=' + encodeURIComponent(cL.latitude) +
            '&longitude=' + encodeURIComponent(cL.longitude) +
            '&picUrl=' + encodeURIComponent(cL.picUrl) +
            '&device=' + encodeURIComponent(Platform.OS) +
            '&userId=' + this.state.userID;
        var postUrlParam = postUrl + params;
        Axios.post(postUrlParam, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                let { code, message } = res.data;
                if (code == 300) {
                    Toast.show('Event created successfully', Toast.SHORT);
                }
                else {
                    Toast.show('Event not created', Toast.SHORT);
                }
                this.setState({
                    CreateEventVisible: false,
                    NES: '',
                    NEN: '',
                    isLocationSet: false,
                    curLocation: {},
                    SLItems: {},
                    SCItems: {},
                    isSelectedCity: '',
                    SLValue: false
                }, () => {
                    this.props.loadingChangeAction(false);
                    this._refreshList();
                });
            }).catch(err => {
                this.props.loadingChangeAction(false);
                setTimeout(() => { Toast.show(err.message, Toast.SHORT); }, 200);
            })
    }
    componentDidMount() {
        check(Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }))
            .then(result => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log(
                            'This feature is not available (on this device / in this context)',
                        );
                        break;
                    case RESULTS.DENIED:
                        this.requestLocationPermission();
                        console.log(
                            'The permission has not been requested / is denied but requestable',
                        );
                        break;
                    case RESULTS.GRANTED:
                        this.setState({ isGPSGranted: true });
                        this.refreshList();
                        break;
                    case RESULTS.BLOCKED:
                        this.requestLocationPermission();
                        console.log('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch(error => {
                // …
            });
    }
    requestLocationPermission() {
        request(Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        })).then(result => {
            if (result == 'granted') {
                this.setState({ isGPSGranted: true });
            }
            else {
                this.setState({ isGPSGranted: false });
            }
            this.refreshList();
        });
    }
    _refreshList() {
        let { userData } = this.props.reducer;
        this.setState({ locationList: [], isRefreshing: true });
        this.props.loadingChangeAction(true);
        var dateNow = new Date();
        var curMonth = ((dateNow.getMonth() + 1) >= 10) ? (dateNow.getMonth() + 1) : '0' + (dateNow.getMonth() + 1);
        var curDate = (dateNow.getDate() >= 10) ? dateNow.getDate() : '0' + dateNow.getDate();
        var curDate = dateNow.getFullYear() + '-' + curMonth + '-' + curDate;
        var curMinute = (dateNow.getMinutes() >= 10) ? dateNow.getMinutes() : '0' + dateNow.getMinutes();
        var curSeconds = (dateNow.getSeconds() >= 10) ? dateNow.getSeconds() : '0' + dateNow.getSeconds();
        var curHours = (dateNow.getHours() >= 10) ? dateNow.getHours() : '0' + dateNow.getHours();
        var curTime = curHours + ':' + curMinute + ':' + curSeconds;

        if (this.state.isGPSGranted) {
            Geolocation.getCurrentPosition(
                (position) => {
                    let { latitude, longitude } = position.coords;
                    this.setState({ curLat: latitude, curLng: longitude });
                    Axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&type=food&key=${MAPKEY}`)
                        .then(res => {
                            let { results, status } = res.data;
                            if(status != 'OVER_QUERY_LIMIT'){
                                let getCity = results[0].vicinity.split(', ');
                                this.setState({ isSelectedCity: getCity[getCity.length - 1] });
                            }
                        })
                        .catch(err => {
                            console.log('JSON API ERROR', err);
                        });
                    this._fetchLists(`getFromCountry=0&user_id=${userData}&latitude=${latitude}&longitude=${longitude}&curDate=${curDate}&curTime=${curTime}`);
                },
                (error) => {
                    this._fetchLists(`getFromCountry=1&user_id=${userData}&curDate=${curDate}&curTime=${curTime}`);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
        else if (!this.state.isGPSGranted) {
            this._fetchLists(`getFromCountry=1&user_id=${userData}&curDate=${curDate}&curTime=${curTime}`);
        }
    }
    _fetchLists(params) {
        var fetchData = `http://bizzner.com/app?action=search_location_db&${params}`;
        Axios.get(fetchData)
            .then(res => {
                let { results, myEvents } = res.data;
                let myEvResults = myEvents;
                const placesArray = [];
                const myPlacesArray = [];
                for (const bodyKey in results) {
                    placesArray.push({
                        name: results[bodyKey].group_name,
                        address: results[bodyKey].group_address,
                        isStarted: results[bodyKey].group_status,
                        photoUrl: results[bodyKey].photoUrl,
                        key: results[bodyKey].key,
                        event_date: results[bodyKey].event_date,
                        event_time: results[bodyKey].event_time,
                        event_subject: results[bodyKey].event_subject,
                        event_note: results[bodyKey].event_note,
                        latitude: results[bodyKey].latitude,
                        longitude: results[bodyKey].longitude,
                        place_id: results[bodyKey].place_id,
                        group_id: results[bodyKey].group_id,
                        usersPlace: results[bodyKey].usersPlace,
                        usersCount: results[bodyKey].usersCount,
                        userIds: results[bodyKey].usersIds,
                        timestamp: results[bodyKey].timestamp,
                        unix_event: results[bodyKey].unix_event,
                        event_date_formated: results[bodyKey].event_date_formated
                    });
                }
                for (const myBodyKey in myEvResults) {
                    myPlacesArray.push({
                        name: myEvResults[myBodyKey].group_name,
                        address: myEvResults[myBodyKey].group_address,
                        isStarted: myEvResults[myBodyKey].group_status,
                        photoUrl: myEvResults[myBodyKey].photoUrl,
                        key: myEvResults[myBodyKey].key,
                        event_date: myEvResults[myBodyKey].event_date,
                        event_time: myEvResults[myBodyKey].event_time,
                        event_subject: myEvResults[myBodyKey].event_subject,
                        event_note: myEvResults[myBodyKey].event_note,
                        latitude: myEvResults[myBodyKey].latitude,
                        longitude: myEvResults[myBodyKey].longitude,
                        place_id: myEvResults[myBodyKey].place_id,
                        group_id: myEvResults[myBodyKey].group_id,
                        usersPlace: myEvResults[myBodyKey].usersPlace,
                        usersCount: myEvResults[myBodyKey].usersCount,
                        userIds: myEvResults[myBodyKey].usersIds,
                        timestamp: myEvResults[myBodyKey].timestamp,
                        unix_event: myEvResults[myBodyKey].unix_event,
                        event_date_formated: myEvResults[myBodyKey].event_date_formated
                    });
                }
                this.setState({ locationList: placesArray, MyEvents: myPlacesArray, isRefreshing: false, isFiltering: false }, () => {
                    this.props.loadingChangeAction(false);
                });
            }).catch(err => {
                this.setState({ locationList: {}, MyEvents: {}, isRefreshing: false, isFiltering: false }, () => {
                    this.props.loadingChangeAction(false);
                });
                setTimeout(() => {
                    Toast.show(err.message, Toast.SHORT);
                }, 200)
            })
    }
    handleSL(text) {
        if (text.length > 2) {
            this.setState({ isLoading: true, SLValue: true, SLItems: {} });
            var fetchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${text} ${this.state.isSelectedCity}&fields=photos,formatted_address,name,rating,place_id,geometry&key=${MAPKEY}`;
            Axios.get(fetchUrl)
                .then(res => {
                    let { status, results } = res.data;
                    if (status == 'OK') {
                        this.setState({ SLItems: results })

                    }
                    else {
                        this.setState({ SLItems: {} })
                    }
                    this.setState({ isLoading: false })
                }).catch(err => {
                    Toast.show(err.message, Toast.SHORT);
                    this.setState({ isLoading: false });
                })
        }
        else {
            this.setState({ SLValue: false })
        }
    }
    handleSC(text) {
        if (text.length > 2) {
            this.setState({ isLoadingSC: true, SCValue: true, SCItems: {} });
            var fetchUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&key=${MAPKEY}`;
            Axios.get(fetchUrl)
                .then(res => {
                    let { status, predictions } = res.data
                    if (status == 'OK') {
                        this.setState({ SCItems: predictions })
                    }
                    else {
                        this.setState({ SCItems: {} })
                    }
                    this.setState({ isLoadingSC: false });
                }).catch(err => {
                    Toast.show(err.message, Toast.SHORT);
                    this.setState({ isLoadingSC: false });
                });
        }
        else {
            this.setState({ SCValue: false });
        }
    }
    citySet(description) {
        this.setState({ isSelectedCity: description, SCValue: false })
    }
    switchEventTabs(tab) {
        this.setState({ isCurrentTab: tab });
    }
    gotEventsList() {
        this.setState({ TabComponent: '' });
        this.props.navigation.navigate('Home');
    }
    searchText = (keyword) => {
        if (keyword.length > 2) {
            this.setState({ isFiltering: true, keyword });
            var dateNow = new Date();
            var curMonth = ((dateNow.getMonth() + 1) >= 10) ? (dateNow.getMonth() + 1) : '0' + (dateNow.getMonth() + 1);
            var curDate = (dateNow.getDate() >= 10) ? dateNow.getDate() : '0' + dateNow.getDate();
            var curDate = dateNow.getFullYear() + '-' + curMonth + '-' + curDate;
            var curMinute = (dateNow.getMinutes() >= 10) ? dateNow.getMinutes() : '0' + dateNow.getMinutes();
            var curSeconds = (dateNow.getSeconds() >= 10) ? dateNow.getSeconds() : '0' + dateNow.getSeconds();
            var curHours = (dateNow.getHours() >= 10) ? dateNow.getHours() : '0' + dateNow.getHours();
            var curTime = curHours + ':' + curMinute + ':' + curSeconds;
            this._fetchLists('user_id=' + this.state.userID + '&curDate=' + curDate + '&curTime=' + curTime + '&keyword=' + keyword);
        }
        else {
            this.setState({ isFiltering: false });
        }
    }
    pickerIos = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', '5-10', '10-15', '15-20'],
            cancelButtonIndex: 0,
        },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    this.setState({ NEUsersCount: 10, no_Attendees: '5-10' })
                }
                else if (buttonIndex === 2) {
                    this.setState({ NEUsersCount: 15, no_Attendees: '10-15' })
                }
                else if (buttonIndex === 3) {
                    this.setState({ NEUsersCount: 20, no_Attendees: '15-20' })
                }

            });
    }
    render() {
        var behavior = (Platform.OS == 'ios') ? 'padding' : '';
        return (
            <View style={[MainStyles.normalContainer]}>
                <View style={[MainStyles.tabContainer, { justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }]}>
                    <TouchableOpacity style={[{ width: '48%' }, MainStyles.tabItem, (this.state.TabComponent == '') ? MainStyles.tabItemActive : null]} onPress={() => this.gotEventsList()}>
                        <Icon name="ellipsis-v" style={[MainStyles.tabItemIcon, (this.state.TabComponent == '') ? MainStyles.tabItemActiveIcon : null]} />
                        <Text style={[MainStyles.tabItemIcon, (this.state.TabComponent == '') ? MainStyles.tabItemActiveText : null]}>{HardText.list}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{ width: '48%' },
                    MainStyles.tabItem,
                    (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                    ]} onPress={() => this.changeTab('map')}>
                        <Icon name="globe" style={[MainStyles.tabItemIcon, (this.state.TabComponent == 'map') ? MainStyles.tabItemActiveIcon : null]} />
                        <Text style={[MainStyles.tabItemIcon, (this.state.TabComponent == 'map') ? MainStyles.tabItemActiveText : null]}>{HardText.map}</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.props.reducer.isSearchOpen == true && this.state.TabComponent == '' &&
                    <KeyboardAvoidingView>
                        <ScrollView behavior='padding'>
                            <View style={{
                                height: 50,
                                width: '100%',
                                backgroundColor: '#FFF',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderColor: '#8da6d4',
                                borderTopWidth: 2,
                                borderBottomWidth: 2,
                            }}>
                                <View style={{
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#8da6d4',
                                    paddingHorizontal: 8
                                }}>
                                    <Icon name="search" size={17} style={{ color: '#FFF' }} />
                                </View>
                                <TextInput
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        color: '#8da6d4',
                                        fontSize: 15,
                                        flex: 1,
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        height: 40,
                                        paddingHorizontal: 5,
                                        borderRadius: 50
                                    }}
                                    autofocus={true}
                                    placeholder={HardText.event_search}
                                    placeholderTextColor="#8da6d4"
                                    keyboardType="web-search"
                                    ref={input => this.searchInput = input}
                                    onChangeText={text => { this.searchText(text) }}
                                />
                                <TouchableOpacity onPress={() => { this.props.ShowSearch(false); this.setState({ isFiltering: false, noFilterData: false, renderedListData: [] }, () => { this.refreshList(); }); }}
                                    style={{
                                        height: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#8da6d4',
                                        paddingHorizontal: 8
                                    }}
                                >
                                    <Icon name="times" size={20} style={{ color: '#FFF' }} />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                }
                {
                    this.state.TabComponent != '' &&
                    <TabContainer showContainer={{
                        TabComponent: this.state.TabComponent,
                    }}
                        navigation={this.props.navigation}
                    />
                }
                <View style={[MainStyles.EventScreenTabWrapper, { paddingVertical: 10 }]}>
                    <TouchableOpacity style={MainStyles.ESTWItem} onPress={() => { this.switchEventTabs('all-events'); this.refreshList() }}>
                        <Text style={[MainStyles.ESTWIText, (this.state.isCurrentTab == 'all-events') ? { color: '#2f4d85' } : { color: '#8da6d5' }]}>{HardText.near_events}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.ESTWItem} onPress={() => this.switchEventTabs('my-events')}>
                        <Text style={[MainStyles.ESTWIText, (this.state.isCurrentTab == 'my-events') ? { color: '#2f4d85' } : { color: '#8da6d5' }]}>{HardText.my_events}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.ESTWItem, { borderColor: '#39b54a' }]} onPress={() => {
                        this.props.navigation.navigate('CreateEvent');
                    }}>
                        <Text style={[MainStyles.ESTWIText, { color: '#39b54a' }]}>{HardText.create_event}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>

                    {
                        this.state.noFilterData == true && this.state.isFiltering == true &&
                        <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{
                                fontFamily: 'Roboto-Medium',
                                fontSize: 18,
                                color: '#FFFFFF',
                                backgroundColor: '#0846b8',
                                paddingVertical: 10,
                                paddingHorizontal: 15,
                                borderRadius: 50,
                                elevation: 0
                            }}>{HardText.no_data}</Text>
                        </View>
                    }
                    {
                        this.state.isCurrentTab == 'all-events' &&
                        this.state.locationList &&
                        this.state.locationList.length > 0 &&
                        this.state.noFilterData == false &&
                        <FlatList data={this.state.locationList}
                            contentContainerStyle={{
                                paddingBottom: 47
                            }}
                            renderItem={({ item }) => (
                                <ListItem item={item} fetchDetails={this.fetchDetails} userID={this.props.reducer.userData} refresh={this.refreshList} />
                            )}
                            keyExtractor={(item) => item.key}
                            //extraData={this.state.locationList}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={() => { this.setState({ isRefreshing: true }), this.refreshList() }}
                                    title="Pull to refresh"
                                    colors={["#2e4d85"]}
                                />
                            }
                            viewabilityConfig={this.viewabilityConfig}
                        />
                    }
                    {
                        this.state.isCurrentTab == 'my-events' &&
                        this.state.MyEvents &&
                        this.state.MyEvents.length > 0 &&
                        <FlatList data={this.state.MyEvents}
                            contentContainerStyle={{
                                paddingBottom: 47
                            }}
                            renderItem={({ item }) => (
                                <ListItem item={item} fetchDetails={this.fetchDetails} userID={this.state.userID} refresh={this.refreshList} />
                            )}
                            keyExtractor={(item) => item.key}
                            extraData={this.state.MyEvents}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={() => { this.setState({ isRefreshing: true }), this.refreshList() }}
                                    title="Pull to refresh"
                                    colors={["#2e4d85", "red", "green", "blue"]}
                                />
                            }
                            viewabilityConfig={this.viewabilityConfig}

                        />
                    }
                    {
                        this.state.locationList.length == 0 && !this.state.isRefreshing &&
                        this.state.isCurrentTab == 'all-events' &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Roboto-Medium', color: '#2e4d85', fontSize: 18 }}>{HardText.blank_create_event}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('CreateEvent');
                                    //this.setState({ CreateEventVisible: true });
                                }}
                                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e4d85', paddingHorizontal: 15, marginTop: 10, paddingVertical: 5, borderRadius: 50 }}
                            >
                                <Icon name="repeat" style={{ marginRight: 10, color: '#FFF' }} size={16} />
                                <Text style={{ fontFamily: 'Roboto-Regular', color: '#FFF', fontSize: 16 }}>{HardText.create_event}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <Dialog
                    visible={this.state.CreateEventVisible}
                    width={0.95}
                    dialogStyle={[MainStyles.confirmPopup, { padding: 0, maxHeight: "95%" }]}
                    dialogAnimation={new SlideAnimation()}
                    containerStyle={{ zIndex: 10, flex: 1, justifyContent: 'space-between' }}
                    rounded={false}
                >
                    <SafeAreaView style={[MainStyles.confirmPopupHeader, { alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', backgroundColor: '#416bb9' }]}>
                        <TouchableOpacity onPress={() => { this.setState({ CreateEventVisible: false, isLocationSet: false, curLocation: {} }) }}>
                            <Icon name="times" style={{ fontSize: 20, color: '#FFF' }} />
                        </TouchableOpacity>
                        <Text style={{ color: '#FFF', fontFamily: 'Roboto-Medium', fontSize: 17, marginLeft: 20 }}>{HardText.create_new_event}</Text>
                    </SafeAreaView>
                    <SafeAreaView style={{ padding: 0, borderWidth: 0, backgroundColor: '#FFF', overflow: 'visible' }}
                        onStartShouldSetResponderCapture={() => {
                            this.setState({ enableScrollViewScroll: true });
                        }}
                    >
                        <KeyboardAvoidingView enabled behavior={behavior} keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
                            <ScrollView
                                keyboardShouldPersistTaps={'handled'}
                                contentContainerStyle={{
                                    paddingHorizontal: 0,
                                }}
                                scrollEnabled={this.state.enableScrollViewScroll}
                                ref={myScroll => (this._myScroll = myScroll)}
                            >
                                {
                                    this.state.isLocationSet == true &&
                                    <View style={{ width: '100%', marginTop: 0, marginBottom: 0, height: 150, }}>
                                        <ImageBackground source={{ uri: this.state.curLocation.picUrl }} style={{ width: '100%', height: 150, flex: 1, resizeMode: 'center' }} resizeMode="cover">
                                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => { this.setState({ isLocationSet: false, curLocation: {} }) }}>
                                                <Icon name="pencil" size={28} color="#FFF" />
                                            </TouchableOpacity>
                                            <View style={{
                                                color: 'white',
                                                position: 'absolute', // child
                                                bottom: 0, // position where you want
                                                left: 0,
                                                paddingLeft: 20,
                                                paddingRight: 40,
                                                paddingBottom: 20
                                            }}>
                                                <Text style={{ textAlign: 'left', color: '#FFF', fontFamily: 'Roboto-Regular', fontSize: 18 }}>{this.state.curLocation.name}</Text>
                                                <Text style={{ textAlign: 'left', color: '#FFF', fontFamily: 'Roboto-Light', fontSize: 16 }}>{this.state.curLocation.address}</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                }
                                {
                                    this.state.isLocationSet == false &&
                                    <View style={{ zIndex: 40, paddingHorizontal: 15 }}>
                                        <View style={[
                                            MainStyles.createEventFWI, { marginTop: 10 },
                                            (this.state.isFocusedSC == true) ? { borderWidth: 1, borderColor: '#8da6d4', paddingHorizontal: 10 } : ''
                                        ]}>
                                            <Icon name="search" style={MainStyles.cEFWIIcon} />
                                            <TextInput style={MainStyles.cEFWITF}
                                                placeholder="City"
                                                placeholderTextColor="#03163a"
                                                underlineColorAndroid="transparent"
                                                onChangeText={(text) => { this.setState({ isSelectedCity: text }), this.onChangeSCDelayed(text) }}
                                                value={this.state.isSelectedCity}
                                                onFocus={() => this.setState({ isFocusedSC: true })}
                                                onBlur={() => this.setState({ isFocusedSC: false })}
                                            />
                                        </View>
                                        {
                                            this.state.isSelectedCity != '' &&
                                            <View style={[
                                                MainStyles.createEventFWI,
                                                {
                                                    marginTop: 10,

                                                },
                                                (this.state.isFocusedSL == true) ? { borderWidth: 1, borderColor: '#8da6d4', paddingHorizontal: 10 } : ''
                                            ]}>
                                                <Icon name="map-marker" style={MainStyles.cEFWIIcon} />
                                                <TextInput style={MainStyles.cEFWITF}
                                                    placeholder="Places "
                                                    placeholderTextColor="#03163a"
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={this.onChangeSLDelayed}
                                                    onFocus={() => this.setState({ isFocusedSL: true })}
                                                    onBlur={() => this.setState({ isFocusedSL: false })}
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
                                    <View style={[MainStyles.locationItemWrapper, { top: 61 }]} onStartShouldSetResponderCapture={() => {
                                        this.setState({ enableScrollViewScroll: false });
                                        if (this._myScroll.contentOffset === 0
                                            && this.state.enableScrollViewScroll === false) {
                                            this.setState({ enableScrollViewScroll: true });
                                        }
                                    }}>
                                        {this.state.isLoadingSC && <ActivityIndicator size="large" color="#416bb9" />}
                                        {
                                            this.state.SCItems.length > 0 &&
                                            <FlatList data={this.state.SCItems}
                                                keyboardShouldPersistTaps={'handled'}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity onPress={() => this.citySet(item.description)} style={[MainStyles.locationItemBtn]}>
                                                        <View style={{ flexWrap: 'wrap', paddingLeft: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                            <Text style={{ writingDirection: 'ltr', textAlign: 'left', fontFamily: 'Roboto-Medium' }}>{item.description}</Text>
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
                                        {this.state.isLoading && <ActivityIndicator size="large" color="#416bb9" />}
                                        {
                                            this.state.SLItems.length > 0 &&
                                            <FlatList data={this.state.SLItems}
                                                keyboardShouldPersistTaps={'handled'}
                                                renderItem={({ item }) => (
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
                                <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                                    <View style={[MainStyles.createEventFWI]}>
                                        <Icon name="thumb-tack" style={MainStyles.cEFWIIcon} />
                                        <TextInput style={MainStyles.cEFWITF} placeholder="Subject" onChangeText={(text) => { this.setState({ NES: text }) }} returnKeyType="next" placeholderTextColor="#03163a" underlineColorAndroid="transparent" />
                                    </View>
                                    <View style={MainStyles.createEventFWI}>
                                        <Icon name="bell" style={MainStyles.cEFWIIcon} />
                                        <TextInput style={MainStyles.cEFWITF} placeholder="Note" onChangeText={(text) => { this.setState({ NEN: text }) }} returnKeyType="next" placeholderTextColor="#03163a" underlineColorAndroid="transparent" />
                                    </View>
                                    <View style={MainStyles.createEventFWI}>
                                        <Icon name="users" style={MainStyles.cEFWIIcon} />
                                        {
                                            Platform.OS == 'android' &&
                                            <Picker
                                                selectedValue={this.state.NEUsersCount}
                                                returnKeyType="next"
                                                style={MainStyles.cEFWIPF}
                                                textStyle={{ fontSize: 17, fontFamily: 'Roboto-Light' }}
                                                itemTextStyle={{
                                                    fontSize: 17, fontFamily: 'Roboto-Light',
                                                }}
                                                itemStyle={[MainStyles.cEFWIPF, { fontSize: 17, fontFamily: 'Roboto-Light' }]}
                                                onValueChange={(itemValue, itemIndex) => this.setState({ NEUsersCount: itemValue })}>
                                                <Picker.Item label="Number of Attendees" value="" />
                                                <Picker.Item label="5-10" value="10" />
                                                <Picker.Item label="10-15" value="15" />
                                                <Picker.Item label="15-20" value="20" />
                                            </Picker>
                                        }
                                        {
                                            Platform.OS == 'ios' &&
                                            <TouchableOpacity style={[MainStyles.cEFWITF, { alignItems: 'center' }]} onPress={() => { this.pickerIos() }}>
                                                <Text style={{ color: '#03163a', fontFamily: 'Roboto-Light' }}>{this.state.no_Attendees}</Text>
                                            </TouchableOpacity>

                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                                        <View style={MainStyles.createEventFWI}>
                                            <Icon name="calendar" style={MainStyles.cEFWIIcon} />
                                            <DatePicker
                                                style={{ width: '75%' }}
                                                date={this.state.NED}
                                                mode="date"
                                                placeholder="Select Date"
                                                format="DD/MM/YYYY"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                showIcon={false}
                                                onDateChange={(date) => { this.setState({ NED: date }) }}
                                                customStyles={{
                                                    dateInput: MainStyles.cEFWIDF
                                                }}
                                            />
                                        </View>
                                        <View style={[MainStyles.createEventFWI]}>
                                            <Icon name="clock-o" style={MainStyles.cEFWIIcon} />
                                            <DatePicker
                                                style={{ width: '75%' }}
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
                                                    var tim30More = new Date((choosenDate[1]) + "/" + choosenDate[0] + "/" + choosenDate[2] + " " + time + ':00');
                                                    var minutes = (tim30More.getTime() - curTime.getTime()) / (60 * 1000);
                                                    if (minutes > 30) {
                                                        this.setState({ NET: time })
                                                    }
                                                    else {
                                                        setTimeout(() => {
                                                            if (Platform.OS == 'ios') {
                                                                AlertIOS.alert(
                                                                    "Warning",
                                                                    "Please give at least 30 minutes notice before event starts"
                                                                );
                                                            }
                                                            else {
                                                                Toast.show("Please give at least 30 minutes notice before event starts", Toast.LONG)
                                                            }
                                                        }, 400)

                                                    }
                                                }}
                                                customStyles={{
                                                    dateInput: MainStyles.cEFWIDF
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={[MainStyles.btnWrapper, { marginBottom: 20 }]}>
                                        <TouchableOpacity style={[MainStyles.btnSave]} onPress={this.createNewEvent}>
                                            <Text style={MainStyles.btnSaveText}>{HardText.create_event}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </Dialog>
                <Footer navigation={this.props.navigation} />
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet)),
    ShowSearch: (open) => dispatch(ShowSearchAction(open))
});
export default connect(mapStateToProps, mapDispatchToProps)(EventsScreen);
import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, ActionSheetIOS,
    Platform, ScrollView, TextInput, Picker, FlatList, ActivityIndicator,
    KeyboardAvoidingView, ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import MainStyles from './StyleSheet';
import HardText from '../HardText';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_URL, MAPKEY, btnShadow } from '../Constants';
import LocationItem from './AsyncModules/LocationItem';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import { loadingChange, SaveUserLocation } from '../Actions';
import Axios from 'axios';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
class CreateEvent extends Component {
    constructor(props) {
        super(props);
        var curDate = new Date();
        curDate.setMinutes(curDate.getMinutes() + 30); // timestamp
        now = new Date(curDate); // Date object
        let day = (now.getDate() >= 10) ? now.getDate() : '0' + now.getDate();
        let month = ((now.getMonth() + 1) >= 10) ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
        let minutes = (now.getMinutes() >= 10) ? now.getMinutes() : '0' + now.getMinutes();
        let hours = (now.getHours() >= 10) ? now.getHours() : '0' + now.getHours();
        let newDate = day + '/' + month + '/' + now.getFullYear();
        let newTime = hours + ':' + minutes + ':00'
        this.state = {
            loading: true,
            NES: '',
            NEN: '',
            javascriptDate: now.getFullYear() + '-' + month + '-' + day,
            TodaysDate: now.getFullYear() + '-' + month + '-' + day,
            NED: newDate,
            NET: newTime,
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
            no_Attendees: 'No. of Attendees',
            keyword: '',
            isGPSGranted: ''
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
    componentDidmount() {
        let { userLat, userLng } = this.props.reducer;
        if (userLat != '') {
            this.fetchLocationCity();
        }
        else {
            check(Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            }))
                .then(result => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            this.requestLocationPermission();
                            break;
                        case RESULTS.DENIED:
                            this.requestLocationPermission();
                            break;
                        case RESULTS.GRANTED:
                            this.getLocations();
                            break;
                        case RESULTS.BLOCKED:
                            this.requestLocationPermission();
                            break;
                    }
                })
                .catch(error => {
                    Toast.show(error.message, Toast.SHORT);
                });
        }
    }
    requestLocationPermission() {
        request(Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        })).then(result => {
            if (result == 'granted') {
                this.getLocations();
            }
            else {
                this.requestLocationPermission();
            }
        });
    }
    getLocations = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords;
                this.props.saveLocation(latitude, longitude);
                this.fetchLocationCity();
            },
            (error) => {
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    fetchLocationCity() {
        let { userLat, userLng } = this.props.reducer;
        this.props.loadingChangeAction(true);
        Axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&rankby=distance&type=food&key=${MAPKEY}`)
            .then(res => {
                let { results } = res.data;
                var getCity = results[0].vicinity.split(', ');
                this.setState({ isSelectedCity: getCity[getCity.length - 1] }, () => {
                    this.props.loadingChangeAction(false);
                });
            })
            .catch(err => {
                setTimeout(() => { Toast.show(err.message, Toast.SHORT) }, 200);
                this.props.loadingChangeAction(false);
            });
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
            Toast.show("Please give at least 30 minutes notice before event starts", Toast.LONG);
            return false;
        }
        this.props.loadingChangeAction(true);
        var postUrl = SERVER_URL + '?action=create_event';
        let { NES, NEN, NED, NET, NEUsersCount, curLocation } = this.state;
        var params = '&newEventSubject=' + NES +
            '&newEventNote=' + NEN +
            '&newEventDate=' + NED +
            '&newEventTime=' + NET +
            '&newEventUsersCount=' + NEUsersCount +
            '&name=' + curLocation.name +
            '&address=' + curLocation.address +
            '&place_id=' + curLocation.place_id +
            '&latitude=' + curLocation.latitude +
            '&longitude=' + curLocation.longitude +
            '&picUrl=' + encodeURIComponent(curLocation.picUrl) +
            '&device=' + Platform.OS +
            '&userId=' + this.props.reducer.userData;
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
                    setTimeout(() => {
                        Toast.show('Event created successfully', Toast.SHORT);
                    }, 200);
                    this.setState({
                        loading: false,
                        CreateEventVisible: false,
                        NES: '',
                        NEN: '',
                        isLocationSet: false,
                        curLocation: {},
                        SLItems: {},
                        SCItems: {},
                        isSelectedCity: '',
                        SLValue: false
                    });
                    this.props.navigation.navigate('Current Events');
                }
                else {
                    setTimeout(() => {
                        Toast.show('Event not created', Toast.SHORT);
                    }, 200);
                }
                this.props.loadingChangeAction(false);
            })
            .catch(err => {
                setTimeout(() => {
                    Toast.show(err.message, Toast.SHORT);
                }, 200);
                this.props.loadingChangeAction(false);
            })
    }
    handleSL(text) {
        if (text.length > 2) {
            this.setState({ isLoading: true, SLValue: true, SLItems: {} });
            let fetchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${text} ${this.state.isSelectedCity}&fields=photos,formatted_address,name,rating,place_id,geometry&key=${MAPKEY}`;
            Axios.get(fetchUrl)
                .then(res => {
                    let { status, results } = res.data;
                    if (status == 'OK') {
                        this.setState({ SLItems: results.slice(0, 10) })

                    }
                    else {
                        this.setState({ SLItems: {} })
                    }
                    this.setState({ isLoading: false })
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
                    let { status, predictions } = res.data;
                    if (status == 'OK') {
                        this.setState({ SCItems: predictions })
                    }
                    else {
                        this.setState({ SCItems: {} })
                    }
                    this.setState({ isLoadingSC: false })
                })
        }
        else {
            this.setState({ SCValue: false })
        }
    }
    citySet(description) {
        this.setState({ isSelectedCity: description, SCValue: false })
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
            <View contentContainerStyle={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior={behavior}>
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
                                <ImageBackground source={{ uri: this.state.curLocation.picUrl }} style={{ width: '100%', height: 150, flex: 1, resizeMode: 'cover' }} resizeMode="cover">
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
                                        viewabilityConfig={this.viewabilityConfig}
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
                                        viewabilityConfig={this.viewabilityConfig}
                                        renderItem={({ item, index }) => (
                                            <LocationItem
                                                {...item}
                                                indexing={index}
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
                                    <TouchableOpacity style={[{ width: '75%' }, MainStyles.cEFWIDF]} onPress={() => { this.setState({ showDate: true }) }}>
                                        <Text>{this.state.NED}</Text>
                                    </TouchableOpacity>
                                    {
                                        this.state.showDate == true &&
                                        <DateTimePicker
                                            value={new Date(`${this.state.javascriptDate}`)}
                                            mode="date"
                                            is24Hour={true}
                                            display="default"
                                            minimumDate={new Date(this.state.TodaysDate)}
                                            onChange={(event, time) => {
                                                if (event.type == 'set') {
                                                    let settedTime = new Date(time);
                                                    let day = (settedTime.getDate() >= 10) ? settedTime.getDate() : '0' + settedTime.getDate();
                                                    let month = ((settedTime.getMonth() + 1) >= 10) ? (settedTime.getMonth() + 1) : '0' + (settedTime.getMonth() + 1);
                                                    this.setState({ NED: day + "/" + month + "/" + settedTime.getFullYear(), javascriptDate: settedTime.getFullYear() + '-' + month + '-' + day, showDate: false })
                                                }
                                                this.setState({ showDate: false });
                                            }} />
                                    }
                                </View>
                                <View style={[MainStyles.createEventFWI]}>
                                    <Icon name="clock-o" style={MainStyles.cEFWIIcon} />
                                    <TouchableOpacity style={[{ width: '75%' }, MainStyles.cEFWIDF]} onPress={() => { this.setState({ showTime: true }) }}>
                                        <Text>{this.state.NET}</Text>
                                    </TouchableOpacity>
                                    {
                                        this.state.showTime == true &&
                                        <DateTimePicker
                                            value={new Date(`${this.state.javascriptDate}T${this.state.NET}`)}
                                            mode="time"
                                            is24Hour={true}
                                            minuteInterval={10}
                                            display="clock"
                                            onChange={(event, time) => {
                                                if (event.type == 'set') {
                                                    let settedTime = new Date(time);
                                                    let minutes = (settedTime.getMinutes() >= 10) ? settedTime.getMinutes() : '0' + settedTime.getMinutes();
                                                    let hours = (settedTime.getHours() >= 10) ? settedTime.getHours() : '0' + settedTime.getHours();
                                                    let timeSet = hours + ':' + minutes + ':00';
                                                    let curTime = new Date();
                                                    let choosenDate = this.state.NED.split('/');
                                                    let tim30More = new Date((choosenDate[1]) + "/" + choosenDate[0] + "/" + choosenDate[2] + " " + timeSet);
                                                    let minutesSet = (tim30More.getTime() - curTime.getTime()) / (60 * 1000);
                                                    if (minutesSet > 30) {
                                                        this.setState({ NET: timeSet, showTime: false });
                                                    }
                                                    else {
                                                        setTimeout(() => {
                                                            Toast.show("Please give at least 30 minutes notice before event starts", Toast.SHORT)
                                                        }, 300);
                                                    }
                                                }
                                                this.setState({ showTime: false });
                                            }} />
                                    }
                                </View>
                            </View>
                            <View style={[MainStyles.btnWrapper, { marginBottom: 60, flex: 1, flexDirection: 'row' }]}>
                                <TouchableOpacity style={[MainStyles.btnSave, { ...btnShadow }]} onPress={this.createNewEvent}>
                                    <Text style={MainStyles.btnSaveText}>{HardText.create_event}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {/* </View> */}
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet)),
    saveLocation: (userLat, userLng) => dispatch(SaveUserLocation(userLat, userLng)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text,AsyncStorage } from 'react-native';
import GoogleMapView from './Maps/MapView';
import { fetchEvents } from './Maps/mapData';
import Permissions from 'react-native-permissions'
import { SERVER_URL,MAPKEY } from '../Constants';
const { height, width } = Dimensions.get('window');
const TOP_BAR_HEIGHT = 110;
const IS_LOADING = "IS_LOADING";
const OK = "OK";
const IS_ERROR = "IS_ERROR";
class MapScreen extends Component {
    state = {
        markers: [],
        events: [],
        appState: IS_LOADING
    };
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount() {
        this.setUserId();
        this._loadMap();
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderView(this.state.appState)}
            </View>
        );
    }
    renderView = appState => {
        const { currentPosition, events } = this.state;
        const render = {
            [IS_ERROR]: <Text>Something was wrong</Text>,
            [IS_LOADING]: <ActivityIndicator size="large" />,
            [OK]: <GoogleMapView currentPosition={currentPosition} events={events} onNavigate={this._onNavigate} />
        };
        return render[appState];
    }

    _onNavigate = (params) => {
        this.props.navigation.navigate('EventDetail', params)
    }
    _getMapData = (position) => {
        const { latitude, longitude } = position.coords;
            const currentPosition = {
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.02
            };
            const events = await fetchEvents();
            this.setState({
                currentPosition,
                events,
                appState: OK
            });
    }
    _loadFromCountry = ()=>{
        fetch(SERVER_URL+'?action=user_country&user_id='+this.state.userID)
            .then(res=>res.json())
            .then(response=>{
                fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+response.country+'&key='+MAPKEY)
                .then(res=>res.json())
                .then(response=>{
                    console.log(response);
                    const currentPosition = {
                        latitude:response.results[0].geometry.location.lat,
                        longitude:response.results[0].geometry.location.lng,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.02
                    };
                    this.setState({currentPosition,appState:OK});
                })
                .catch()
            }).catch()
            
        
    }
    _loadMap = async () => {
        Permissions.check('location', { type: 'always' }).then(response => {
            if(response == "authorized"){
                var Geolocation = navigator.geolocation;
                Geolocation.getCurrentPosition(positions=>{
                    this._getMapData(positions);
                },error=>{
                    this._loadFromCountry()
                })
            }
            else{
                this._loadFromCountry()
            }
        })
    }

}
const styles = StyleSheet.create({
    container: {
        height: height - TOP_BAR_HEIGHT,
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
export default MapScreen;
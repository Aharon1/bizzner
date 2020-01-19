
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text,Platform } from 'react-native';
import GoogleMapView from './Maps/MapView';
import { fetchEvents } from './Maps/mapData';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { SERVER_URL, MAPKEY } from '../Constants';
import Geolocation from 'react-native-geolocation-service';
import Axios from 'axios';
import { loadingChange } from '../Actions';
import { connect } from 'react-redux';
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
    componentDidMount() {
        this.setState({ userID:this.props.reducer.userData });
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
    _getMapData = async (position) => {
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
    _loadFromCountry = async () => {
        fetch(SERVER_URL + '?action=user_country&user_id=' + this.state.userID)
            .then(res => res.json())
            .then(response => {
                fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + response.country + '&key=' + MAPKEY)
                    .then(res => res.json())
                    .then(async (response) => {
                        const currentPosition = {
                            latitude: response.results[0].geometry.location.lat,
                            longitude: response.results[0].geometry.location.lng,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.02
                        };
                        const events = await fetchEvents();
                        this.setState({
                            currentPosition,
                            events,
                            appState: OK
                        });
                    })
                    .catch();
            }).catch();
    }
    _loadMap = async () => {
        check(Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        })).then(response => {
            if (response == RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        this._getMapData(position);
                    },
                    (error) => {
                        // See error code charts below.
                        this._loadFromCountry()
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
            else if (response == RESULTS.DENIED) {
                request(Platform.select({
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                })).then(response => {
                    if (response == RESULTS.GRANTED) {
                        Geolocation.getCurrentPosition(
                            (position) => {
                                this._getMapData(position);
                            },
                            (error) => {
                                // See error code charts below.
                                this._loadFromCountry()
                            },
                            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                        );
                    }
                    else {
                        this._loadFromCountry()
                    }
                });
            }
            else {
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
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet))
});
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
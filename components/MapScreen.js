import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import GoogleMapView from './Maps/MapView';
import { fetchEvents } from './Maps/mapData';
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
    _getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
    _loadMap = async () => {
        try {
            const position = await this._getCurrentPosition();
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
        } catch (e) {
            this.setState({
                appState: IS_ERROR
            });
        }
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
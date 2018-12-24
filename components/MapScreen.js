import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import GoogleMapView from './Maps/MapView';
const { height, width } = Dimensions.get('window');
const TOP_BAR_HEIGHT = 110;
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
class MapScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <GoogleMapView onNavigate={this.onNavigate} />
            </View>
        );
    }

    onNavigate = (params) => {
        this.props.navigation.navigate('EventDetail', params)
    }
}
export default MapScreen;
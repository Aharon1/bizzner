import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
// import Icon from "react-native-vector-icons/FontAwesome";
import { MarkerItem } from "./MarkerItem";
import markers from './mapData';

export default class GoogleMapView extends PureComponent {
    render() {
        return (
            <MapView style={styles.map}
                region={{
                    latitude: 32.0677475,
                    longitude: 34.8442303,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                provider={PROVIDER_GOOGLE}>
                {/* <Marker coordinate={currentPosition} title="You are here">
                  <Icon name="map-marker" size={40} color="#ed5342" />
                </Marker> */}
                {markers.events.map((marker, id) =>  <MarkerItem {...marker} key={id} />)}
            </MapView>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});
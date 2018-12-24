import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { MarkerItem } from "./MarkerItem";
import markers from './mapData';

export default class GoogleMapView extends PureComponent {
    render() {
        return (
            <MapView style={styles.map}
                region={{
                    latitude: 32.0677475,
                    longitude: 34.8442303,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.2,
                }}
                provider={PROVIDER_GOOGLE}>
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
import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import { MarkerItem } from "./MarkerItem";
import { MOCKED_EVENTS } from './mapData';
import { MapClustering } from './MapClustering';

export default class GoogleMapView extends PureComponent {
    render() {
        return (
            <MapClustering
                style={styles.map}
                region={this.props.currentPosition}>
                {MOCKED_EVENTS.map((marker, id) => <MarkerItem {...marker} key={id} cluster={true} onNavigate={this.props.onNavigate} />)}
            </MapClustering>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { MarkerItem } from "./MarkerItem";
import { MOCKED_EVENTS } from './mapData';
import { MapClustering } from './MapClustering';
const dummyImage = require('../../assets/dummy.jpg');

export default class GoogleMapView extends PureComponent {
    state = {
        isModalOpen: false,
        modalName: ''
    }
    render() {
        const { isModalOpen, modalName } = this.state;
        return (
            <View style={styles.container}>
                <MapClustering
                    onPress={this.onCloseModal}
                    style={styles.map}
                    region={this.props.currentPosition}>
                    {MOCKED_EVENTS.map((marker, id) => (<MarkerItem {...marker}
                        key={id} onOpenModal={this.onOpenModal} cluster={true}
                        onNavigate={this.props.onNavigate} />))
                    }
                </MapClustering>
                {
                    isModalOpen &&
                    <TouchableOpacity
                        onPress={this.onCloseModal}
                        style={styles.modalContainer}>
                        <ImageBackground style={styles.image} source={dummyImage} >
                            <Text style={styles.textStyle}>
                                {modalName}
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            </View>
        );
    }

    onOpenModal = (modalName) => {
        this.setState({
            isModalOpen: true,
            modalName,
        })
    }

    onCloseModal = () => {
        this.setState({
            isModalOpen: false,
            modalName: ''
        })
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    textStyle: {
        fontSize: 20,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        padding: 5
    },
    modalContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        marginVertical: 20,
    },
    image: {
        width: 250,
        height: 150,
        justifyContent: 'flex-end'
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10
    },
});
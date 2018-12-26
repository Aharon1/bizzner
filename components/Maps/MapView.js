import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { MarkerItem } from "./MarkerItem";
import { MapClustering } from './MapClustering';
const dummyImage = require('../../assets/dummy.jpg');

export default class GoogleMapView extends PureComponent {
    state = {
        isModalOpen: false,
        modalName: '',
        subject: ''
    }
    render() {
        const { isModalOpen, modalName, backgroundImage, subject } = this.state;
        return (
            <View style={styles.container}>
                <MapClustering
                    onPress={this.onCloseModal}
                    style={styles.map}
                    region={this.props.currentPosition}>
                    {this.props.events.map((marker, id) => (<MarkerItem {...marker}
                        key={id} onOpenModal={this.onOpenModal} cluster={true}
                        onNavigate={this.props.onNavigate} />))
                    }
                </MapClustering>
                {
                    isModalOpen &&
                    <TouchableOpacity
                        onPress={this.onCloseModal}
                        style={styles.modalContainer}>
                        <ImageBackground style={styles.image} source={{ uri: backgroundImage }} >
                            <Text style={styles.textStyle}>
                                {subject}
                            </Text>
                            <Text style={styles.textStyle}>
                                {modalName}
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            </View>
        );
    }

    onOpenModal = (modalName, backgroundImage, subject) => {
        this.setState({
            isModalOpen: true,
            modalName,
            backgroundImage,
            subject
        })
    }

    onCloseModal = () => {
        this.setState({
            isModalOpen: false,
            modalName: '',
            subject: '',
            backgroundImage: null
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
        padding: 5,
        color: '#000'
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
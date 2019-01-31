import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import { MarkerItem } from "./MarkerItem";
import { MapClustering } from "./MapClustering";
import { Modal } from "./components/Modal";
import { height } from "react-native-dimension";

const dummyImage = require("../../assets/dummy.jpg");

export default class GoogleMapView extends PureComponent {
  state = {
    isModalOpen: false,
    isModalClusterOpen: false,
    modalName: "",
    subject: "",
    clusterEvents: []
  };
  render() {
    const { isModalOpen, isModalClusterOpen } = this.state;
    return (
      <View style={styles.container}>
        <MapClustering
          onPress={this.onCloseModal}
          style={styles.map}
          region={this.props.currentPosition}
          onClusterPress={this.onModalClusterOpen}
        >
          {this.props.events.map((marker, id) => (
            <MarkerItem
              {...marker}
              key={id}
              onOpenModal={this.onOpenModal}
              cluster={true}
              onNavigate={this.props.onNavigate}
            />
          ))}
        </MapClustering>
        {isModalOpen && this.renderMarker()}
        {isModalClusterOpen && this.renderCluster()}
      </View>
    );
  }
  renderMarker = () => {
    const { eventData } = this.state;
    return (
      <Modal
        eventData={eventData}
        goToEvent={() => this.goToEvent(eventData.id)}
        onCloseModal={this.onCloseModal}
        formatDate={this.formatDate}
        formatAMPM={this.formatAMPM}
      />
    );
  };

  renderCluster = () => {
    return (
      <View style={{height: '50%'}}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            alignItems: "flex-end",
            alignSelf: "flex-end",
          }}
        >
          {this.state.clusterEvents.map(event => {
            const id = event.marker.props.id;
            const eventData = event.marker.props;
            return (
              <Modal
                key={id}
                goToEvent={() => this.goToEvent(id)}
                onCloseModal={this.onModalClusterClose}
                eventData={eventData}
                formatDate={this.formatDate}
                formatAMPM={this.formatAMPM}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };
  onOpenModal = eventData => {
    this.setState(
      {
        isModalOpen: true,
        eventData
      },
      this.validateClusterOpen
    );
  };
  validateClusterOpen = () => {
    if (this.state.isModalClusterOpen) {
      this.setState({
        isModalClusterOpen: !this.state.isModalClusterOpen
      });
    }
  };
  goToEvent = id => {
    const event_id = id ? id : this.state.eventData.event_id;
    this.props.onNavigate({ event_id });

    this.setState({
      isModalOpen: false,
      eventData: ""
    });
  };
  onCloseModal = () => {
    this.setState({
      isModalOpen: false,
      eventData: ""
    });
  };
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  formatDate(date) {
    var dateStr = "";
    dateStr +=
      date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
    var monthArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var month = monthArray[date.getMonth()];
    dateStr += month + " ";
    dateStr += date.getFullYear();
    return dateStr;
  }
  onModalClusterOpen = clusterEvents => {
    this.setState({
      isModalClusterOpen: true,
      clusterEvents
    });
  };
  onModalClusterClose = () => {
    this.setState({
      isModalClusterOpen: false
    });
  };
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  textStyle: {
    fontSize: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    padding: 5,
    color: "#000"
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  }
});

import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  ScrollView
} from "react-native";
import { MarkerItem } from "./MarkerItem";
import { MapClustering } from "./MapClustering";
import { Modal } from "./components/Modal";

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
    console.log(this.props)
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
      <View style={{height: '65%'}}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            alignSelf: "center",
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
  formatAMPM(date,time) {
    fullDate = new Date(date+' '+time);
    if(Platform.OS == 'ios'){
      fullDate = new Date(date+'T'+time);
    }
    var hours = fullDate.getHours();
    var minutes = fullDate.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  formatDate(date,time) {
    fullDate = new Date(date+' '+time);
    if(Platform.OS == 'ios'){
      fullDate = new Date(date+'T'+time);
    }
    var dateStr = "";
    dateStr +=
    fullDate.getDate() < 10 ? "0" + fullDate.getDate() + " " : fullDate.getDate() + " ";
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
    var month = monthArray[fullDate.getMonth()];
    dateStr += month + " ";
    dateStr += fullDate.getFullYear();
    return dateStr;
  }onModalClusterOpen = clusterEvents => {
    this.setState({
      isModalClusterOpen: true,
      isModalOpen: false,
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
    fontSize: 17,
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
import React, { PureComponent } from "react";
import { Marker } from "react-native-maps";
import { Alert } from "react-native";
import moment from 'moment';
import Icon from "react-native-vector-icons/FontAwesome";


export class MarkerItem extends PureComponent {
  render() {
    const { group_name, group_lat, group_lng } = this.props;
    return (
      <Marker
        coordinate={{
          latitude: group_lat,
          longitude: group_lng
        }}
        title={group_name}
        onPress={this.showAlert}
      >
       {
         this.isToday()
          ?  <Icon name="map-marker" size={40} color="#5ac268" />
          : <Icon name="map-marker" size={40} color="#0645ba" />
       } 
      </Marker>
    );
  }

  showAlert = () => {
    const { group_name, event_time, event_date } = this.props;
    Alert.alert(group_name, `${event_time} \n ${event_date}`);
  };

  isToday = () => {
    const { event_date, event_time } = this.props;
    return moment().diff(`${event_date} ${event_time}`, 'days') === 0;
  }
}
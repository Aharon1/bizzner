import React, { PureComponent } from "react";
import { Marker } from "react-native-maps";
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
        onPress={this.onNavigate}
      >
        <Icon name="map-marker" size={40} color={this.isToday() ? "#5ac268" : "#0645ba"} />
      </Marker>
    );
  }

  onNavigate = () => {
    const { id } = this.props;
    this.props.onNavigate({ event_id: id })
  };

  isToday = () => {
    const { event_date, event_time } = this.props;
    return moment().isSame(`${event_date} ${event_time}`, 'days');
  }
}
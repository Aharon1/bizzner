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
        title=""
        onPress={this.onMarkerPress}
        stopPropagation={true}
      >
        <Icon name="map-marker" size={40} color={this.isToday() ? "#5ac268" : "#0645ba"} />
      </Marker>
    );
  }

  onMarkerPress = () => {
    this.props.onOpenModal({
      group_name: this.props.group_name,
      event_photo:this.props.event_photo,
      event_subject:this.props.event_subject,
      event_date:this.props.event_date,
      event_time:this.props.event_time,
      group_address:this.props.group_address,
      event_id:this.props.id,
      event_coords: [this.props.group_lng, this.props.group_lat],
    });
  };

  isToday = () => {
    const { event_date, event_time } = this.props;
    return moment().isSame(`${event_date} ${event_time}`, 'days');
  }
}
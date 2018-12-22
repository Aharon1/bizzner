import React, { PureComponent } from "react";
import { Marker } from "react-native-maps";
import { Alert } from "react-native";

export class MarkerItem extends PureComponent {
  render() {
    const { group_name, group_lat, group_lng} = this.props;
    return (
      <Marker
        coordinate={{
            latitude: group_lat,
            longitude: group_lng
        }}
        title={group_name}
        onPress={this.showAlert}
      />
    );
  }

  showAlert = () => {
    const { group_name, event_time, event_date } = this.props;
    Alert.alert(group_name, `${event_time} \n ${event_date}`);
  };
}
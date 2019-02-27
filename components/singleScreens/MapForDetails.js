import React from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { TouchableHighlight, Text, StyleSheet, View } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import getDirections from "react-native-google-maps-directions";
import { MAPKEY } from "../../Constants";

export class MapForEventDetail extends React.Component {
  state = {
    myLocation: {
      latitude: "",
      longitude: ""
    },
    polylineCoords: []
  };
  handleGetDirections = () => {
    const { location } = this.props;
    const {
      myLocation: { latitude, longitude }
    } = this.state;
    const data = {
      source: {
        latitude: latitude,
        longitude: longitude
      },
      destination: {
        latitude: location[1],
        longitude: location[0]
      },
      params: [
        {
          key: "travelmode",
          value: "walking" // may be "driving", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate" // this instantly initializes navigation using the given travel mode
        }
      ]
    };

    getDirections(data);
  };
  componentDidMount() {
    this.getCurrentPosition();
  }
  getPolyline = () => {
    const { latitude, longitude } = this.state.myLocation;
    const { location } = this.props;
    const mode = "car";
    const origin = [latitude, longitude];
    const destination = [location[1], location[0]];
    const APIKEY = "AIzaSyBWr5bPPGdOBU9ce8RgchL5sc_U9OC1yL8";
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=${mode}`;
    axios.get(url).then(resp => {
      if (resp.data.routes.length) {
        this.setState({
          polylineCoords: this.decode(
            resp.data.routes[0].overview_polyline.points
          )
        });
      }
    });
  };
  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(res => {
      this.setState(
        {
          myLocation: {
            latitude: res.coords.latitude,
            longitude: res.coords.longitude
          }
        },
        this.getPolyline
      );
    });
  };
  decode = (t, e) => {
    for (
      var n,
        o,
        u = 0,
        l = 0,
        r = 0,
        d = [],
        h = 0,
        i = 0,
        a = null,
        c = Math.pow(10, e || 5);
      u < t.length;

    ) {
      (a = null), (h = 0), (i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (n = 1 & i ? ~(i >> 1) : i >> 1), (h = i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (o = 1 & i ? ~(i >> 1) : i >> 1),
        (l += n),
        (r += o),
        d.push([l / c, r / c]);
    }
    return (d = d.map(function(t) {
      return { latitude: t[0], longitude: t[1] };
    }));
  };

  render() {
    console.log(this.props);
    const {
      polylineCoords,
      myLocation: { latitude, longitude }
    } = this.state;
    const { location } = this.props;
    return polylineCoords.length ? (
      <View style={{ position: "relative", width: "100%", height: 180 }}>
        <MapView
          style={{ width: "100%", height: 170 }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
          }}
        >
          <Polyline
            coordinates={polylineCoords}
            strokeColor="#33B1FF"
            strokeWidth={8}
          />
          <Marker
            coordinate={{
              latitude: location[1],
              longitude: location[0]
            }}
          >
            <Icon name="map-marker" size={40} color="red" />
          </Marker>
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude
            }}
          >
            <Icon name="bullseye" size={40} color="grey" />
          </Marker>
        </MapView>
        <TouchableHighlight
          onPress={this.props.closeMap}
          style={styles.closeButton}
        >
          <Icon name="close" size={30} color="#2e4d85" />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.handleGetDirections}
          style={styles.button}
        >
          <Text style={{ color:'#FFFFFF',fontFamily:'Roboto-Light',fontSize:15 }}>Directions</Text>
        </TouchableHighlight>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: "50%",
    bottom: 0,
    marginBottom: 20,
    backgroundColor: "#2e4d85",
    padding: 8,
    transform: [
      {
        translateX: -53
      }
    ]
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "2%"
  }
});

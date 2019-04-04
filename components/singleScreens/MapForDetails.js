import React from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { TouchableHighlight,TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import getDirections from "react-native-google-maps-directions";
import { MAPKEY } from "../../Constants";
import Geolocation from 'react-native-geolocation-service';
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
    const APIKEY = MAPKEY;//"AIzaSyBWr5bPPGdOBU9ce8RgchL5sc_U9OC1yL8";
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
    Geolocation.getCurrentPosition(
      (position) => {
          let Latitude = position.coords.latitude;
          let Longitude = position.coords.longitude;
          this.setState(
            {
              myLocation: {
                latitude: Latitude,
                longitude: Longitude
              }
            },
            this.getPolyline
          );
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
          
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
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
      <View style={{ position: "relative", width: "100%", height: 175,paddingHorizontal: 10,paddingVertical: 10, }}>
        <MapView
          style={{ width: "100%", height: 155 }}
          initialRegion={{
            latitude: location[1],
            longitude: location[0],
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
          }}
        >
          {/* <Polyline
            coordinates={polylineCoords}
            strokeColor="#0066ff"
            strokeWidth={2}
          /> */}
          <Marker
            coordinate={{
              latitude: location[1],
              longitude: location[0]
            }}
          >
            <Icon name="map-marker" size={40} color="#0947b9" />
          </Marker>
        {/* <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude
          }}
        >
          <Icon name="bullseye" size={40} color="grey" />
        </Marker> */}
        </MapView>
        {/* <TouchableHighlight
          onPress={this.props.closeMap}
          style={styles.closeButton}
        >
          <Icon name="close" size={15} color="#2e4d85" />
        </TouchableHighlight> */}
      
          <TouchableOpacity onPress={this.handleGetDirections} style={[{width:41,height:42,justifyContent:'center',alignItems:'center',zIndex:50, position: "absolute",right: 20,bottom: 20}]}>
            <Image source={require('../../assets/dir-icon.png')} style={[{width:41,height:42 }]}/>
          </TouchableOpacity>       
           
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

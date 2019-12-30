import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { StatusBar, View, Platform } from 'react-native';
import { COLORS } from './Constants';
import Store from './Store';
import { SaveUserLocation } from './Actions';
import Loader from './components/Loader';
import MainNavigation from './components/Navigation/Navigation';
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
console.disableYellowBox = true;
class BizznerApp extends Component {
  messageListener = '';
  componentDidmount() {
    check(Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }))
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.requestLocationPermission();
            break;
          case RESULTS.DENIED:
            this.requestLocationPermission();
            break;
          case RESULTS.GRANTED:
            this.getLocations();
            break;
          case RESULTS.BLOCKED:
            this.requestLocationPermission();
            break;
        }
      })
      .catch(error => {
        // …
      });

  }
  requestLocationPermission() {
    request(Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    })).then(result => {
      console.log(result);
      if (result == 'granted') {
        this.getLocations();
      }
      else {
        this.requestLocationPermission();
      }
    });
  }
  getLocations = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let { latitude, longitude } = position.coords;
        this.props.saveLocation(latitude, longitude);
      },
      (error) => {
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLORS.headerColor} />
        <Loader loading={this.props.reducer.loading} />
        <MainNavigation />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { reducer } = state
  return { reducer }
};
const mapDispatchToProps = dispatch => ({
  saveLocation: (userLat, userLng) => dispatch(SaveUserLocation(userLat, userLng)),
});
const AppComponentConnect = connect(mapStateToProps, mapDispatchToProps)(BizznerApp);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <AppComponentConnect />
      </Provider>
    )
  }
}
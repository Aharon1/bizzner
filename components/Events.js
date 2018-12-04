import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, SectionList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';
import MainStyles from './StyleSheet';

import EventsList from './EventsList';
import CreateEvent from './CreateEvent';
const CustomTabBar = ({
    navigation,
    navigationState,
    getLabel,
    renderIcon,
    activeTintColor,
    inactiveTintColor
  }) => (
    <View style={MainStyles.tabContainer}>
      {navigationState.routes.map((route, idx) => {
        const color = navigationState.index === idx ? activeTintColor : inactiveTintColor;
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(route.routeName);
            }}
            style={MainStyles.tab}
            key={route.routeName}
          >
            <Text style={{ color }}>
              {renderIcon({ route })}
              {getLabel({ route })}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
EventsScreen = createAppContainer(createMaterialTopTabNavigator({
    List: {
        screen:EventsList,
        navigationOptions:{
            tabBarLabel: 'Create Event',
            tabBarIcon: ({ tintColor }) => <Icon name="ellipsis-v" size={35} color={tintColor} />,
            tabBarOptions:{
                style: MainStyles.TabBar,
            }
        }
    },
    CreateEvent: {
        screen:CreateEvent,
        navigationOptions:{
            tabBarLabel: 'Create Event',
            tabBarIcon: ({ tintColor }) => <Icon name="calendar-o" size={35} color={tintColor} />,
            tabBarOptions:{
                labelStyle: {
                fontSize: 12,
                },
            }
        }
    }
},{
    navigationOptions:{
        barStyle:MainStyles.TabBar
    },
    tabBarComponent: CustomTabBar
}));
export default EventsScreen
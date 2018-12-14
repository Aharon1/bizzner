import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import TabContainer from './TabContainer';
import { HeaderButton } from './Navigation/HeaderButton';

class EventsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TabComponent: 'EL'
        }
    }
    changeTab(Screen) {
        this.setState({ TabComponent: Screen });
    }
    render() {
        return (
            <View style={MainStyles.normalContainer}>
                <View style={[MainStyles.eventsHeader, { alignItems: 'center', flexDirection: 'row' }]}>
                    <HeaderButton onPress={this.props.navigation.openDrawer} />
                    <Text style={{ fontSize: 20, color: '#8da6d5', marginLeft: 20 }}>Events near me</Text>
                </View>
                <View style={[MainStyles.tabContainer, { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'EL') ? MainStyles.tabItemActive : null
                    ]} onPress={() => this.changeTab('EL')}>
                        <Icon name="ellipsis-v" style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'EL') ? MainStyles.tabItemActiveIcon : null
                        ]} />
                        <Text style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'EL') ? MainStyles.tabItemActiveText : null
                        ]}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                    ]} onPress={() => this.changeTab('map')}>
                        <Icon name="globe" style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActiveIcon : null
                        ]} />
                        <Text style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActiveText : null
                        ]}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.tabItem,
                    (this.state.TabComponent == 'CE') ? MainStyles.tabItemActive : null
                    ]} onPress={() => this.changeTab('CE')}>
                        <Icon name="calendar-o" style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'CE') ? MainStyles.tabItemActiveIcon : null
                        ]} />
                        <Text style={[MainStyles.tabItemIcon,
                        (this.state.TabComponent == 'CE') ? MainStyles.tabItemActiveText : null
                        ]}>Create Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.tabItem}>
                        <Icon name="search" style={MainStyles.tabItemIcon} />
                        <Text style={MainStyles.tabItemText}>Search</Text>
                    </TouchableOpacity>
                </View>
                <TabContainer showContainer={{ TabComponent: this.state.TabComponent, locationList: this.props.navigation.getParam('locationList') }} />
            </View>
        )
    }
}
/*EventsScreen = createAppContainer(createMaterialTopTabNavigator({
    List: {
        screen:EventsList,
        navigationOptions:{
            title:'List',
            tabBarOptions:{
                labelStyle: {
                    fontSize: 16,
                    fontFamily: "Roboto-Light"
                },
                activeTintColor: "#6200EE",
                inactiveTintColor: "#858585",
                tabBarIcon: ({ tintColor }) => <Icon name="ellipsis-v" size={16} color={tintColor} />,
                //style: MainStyles.TabBar,
                tabBarPosition: "top",
                animationEnabled: true,
                swipeEnabled: true,
                showIcon:true
            }
            
        },
        
    },
    CreateEvent: {
        screen:CreateEvent,
        navigationOptions:{
            title:'Create Event',
            tabBarOptions:{
                labelStyle: {
                    fontSize: 16,
                    fontFamily: "Roboto-Light"
                },
                activeTintColor: "#6200EE",
                inactiveTintColor: "#858585",
                iconStyle:{
                    fontSize: 16
                },
                tabBarIcon: ({ tintColor }) => <Icon name="calendar" size={16} color={tintColor} />,
                //style: MainStyles.TabBar,
                tabBarPosition: "top",
                animationEnabled: true,
                swipeEnabled: true,
                showIcon:true
            },
            
        },
        
    }
},{
    
}));*/
export default EventsScreen
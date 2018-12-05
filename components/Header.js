import React, { Component } from 'react';
import { View,Text,TouchableOpacity} from 'react-native';
import MainStyles from './StyleSheet';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class Header extends Component{
    constructor(props){
        super(props);
        state = {
            TabComponent:'EventsList'
        }
    }
    render(){
        return (
            <View style={MainStyles.normalContainer}>
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={{paddingLeft:12}}>
                        <Icon name="bars" style={{fontSize:24,color:'#8da6d5'}}/>
                    </TouchableOpacity>
                    <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>Events near me</Text>
                </View>
                <View style={MainStyles.normalContainer}>
                    <View style={[MainStyles.tabContainer,{justifyContent:'space-between',alignItems:'center',flexDirection:'row'}]}>
                        <TouchableOpacity style={[MainStyles.tabItem,MainStyles.tabItemActive]} onPress={()=>this.setState(TabComponent,'EventsList')}>
                            <Icon name="ellipsis-v" style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveIcon]}/>
                            <Text style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveText]}>List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={MainStyles.tabItem} onPress={()=>this.setState(TabComponent,'List')}>
                            <Icon name="globe" style={MainStyles.tabItemIcon}/>
                            <Text style={MainStyles.tabItemText}>Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={MainStyles.tabItem} onPress={()=>this.setState(TabComponent,'CreateEvent')}>
                            <Icon name="calendar-o" style={MainStyles.tabItemIcon}/>
                            <Text style={MainStyles.tabItemText}>Create Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={MainStyles.tabItem} onPress={()=>this.setState(TabComponent,'List')}>
                            <Icon name="search" style={MainStyles.tabItemIcon}/>
                            <Text style={MainStyles.tabItemText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )   
    }
}
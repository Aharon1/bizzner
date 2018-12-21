import React,{Component} from 'react';
import { View,Text,TouchableOpacity,FlatList} from 'react-native';
import { DrawerActions } from 'react-navigation';
import { HeaderButton } from '../Navigation/HeaderButton';
import MainStyles from '../StyleSheet';
import {SERVER_URL} from '../../Constants';
import Loader from '../Loader';
export default class EventDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
        }
    }
    getEventUsers(){
        
    }
    render(){
        return(
            <View>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>Events near me</Text>
                </View>
                <Text>Single Details</Text>
            </View>
        );
    }
}
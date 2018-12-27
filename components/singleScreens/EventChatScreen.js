import React,{Component} from 'react';
import { View,Text,TouchableOpacity,FlatList,TextInput} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { HeaderButton } from '../Navigation/HeaderButton';
import MainStyles from '../StyleSheet';
import Loader from '../Loader';
import ProgressiveImage from '../../components/AsyncModules/ImageComponent';
class EventChatScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            event_id:this.props.navigation.getParam('event_id'),
        }
    }
    render(){
        return(
            <View style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>PRIVATE MESSAGE</Text>
                </View>
                <View style={[MainStyles.tabContainer,{justifyContent:'flex-start',paddingHorizontal:15,paddingVertical:15}]}>
                    <Text style={{fontSize:16,fontFamily:'Roboto-Medium',color:'#05296d'}}>Note: pls came from the front green door</Text>
                </View>
                <View style={MainStyles.MessageContainer}>
                    <View style={MainStyles.MessageContainerView}></View>
                    <View style={MainStyles.MessageContainerTextInput}>

                    </View>
                </View>
            </View>
        );
    }
}
export default EventChatScreen;
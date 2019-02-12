import React, {Component} from 'react';
import {Text, View, TouchableOpacity, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader';
import MainStyles from '../StyleSheet';
class ConfirmScreen extends Component{
    render(){
        return(
            <View style={
                {
                    flex:1,
                    alignItems:'center',
                    justifyContent:'center'
                }
            }>
                <View style={{
                    marginBottom:40
                }}>
                    <Icon name="check" size={35} style={{
                        color:'#39b54a'
                    }} />
                </View>
                <View style={{
                    maxWidth:280,
                    alignItems:'center',
                    justifyContent:'center',
                    marginBottom:40
                }}>
                    <Text style={{
                        fontFamily:'Roboto-Light',
                        fontSize:15,
                        textAlign:'center',
                        alignItems:'center',
                        justifyContent:'center',
                        fontSize:18
                    }}>Thank you for the confirmation. Please click to continue with the registration.</Text>
                </View>
                <View >
                    <TouchableOpacity style={MainStyles.btnSave} onPress={() => {this.props.navigation.navigate('InterestsScreen');}}>
                        <Text style={MainStyles.btnSaveText}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default ConfirmScreen;

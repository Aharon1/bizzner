import React, { Component } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SERVER_URL } from '../../Constants';
import Axios from 'axios';
import { loadingChange,ShowSearchAction } from '../../Actions';
import { connect } from 'react-redux';
class Footer extends Component {
    _isMounted = false;
    clearTime = '';
    constructor(props) {
        super(props);
        this.state = {
            pcCount: 0,
            ecCount: 0
        }
    }
    componentDidMount() {
        this._isMounted = true;
        this.getPrivatChatCount();
        this.clearTime = setInterval(() => {
            this.getPrivatChatCount();
        }, 4000);
    }
    async getPrivatChatCount() {
        let { userData } = this.props.reducer;
        await Axios.get(`${SERVER_URL}?action=privatMsgsCount&user_id=${userData}`)
            .then(res => {
                if (this._isMounted) {
                    let { pcCount, ecCount } = res.data;
                    this.setState({ pcCount: pcCount, ecCount: ecCount });
                    let totalCount = parseInt(pcCount) + parseInt(ecCount);
                }
            })
            .catch(err => { })
    }
    componentWillUnmount() {
        this._isMounted = false;
        clearTimeout(this.clearTime);
    }
    render() {
        let { navigation, ShowSearch, reducer:{isSearchOpen} } = this.props;
        var widthShow = '33.3333333%';
        return (
            <View>
                {
                    isSearchOpen == false &&
                    <View style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: '#e8edf6',
                        paddingTop: 5,
                        paddingBottom: 5,
                    }}>
                        <TouchableOpacity style={{
                            alignItems: 'center', width: widthShow,
                            paddingTop: 5,
                            paddingBottom: 5
                        }} onPress={() => navigation.navigate('EventChatList')}>
                            <View>
                                <Icon name="comments" style={{ fontSize: 27, color: '#8da6d5' }} />
                                {
                                    this.state.ecCount > 0 &&
                                    <View style={{
                                        position: 'absolute',
                                        right: -12,
                                        top: -8,
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#e74c3c',
                                        borderRadius: 100,
                                        width: 20,
                                        height: 20,
                                    }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Roboto-Medium',
                                            color: '#FFFFFF',
                                        }}>{this.state.ecCount}</Text>
                                    </View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            width: widthShow
                        }} onPress={() => navigation.navigate('Messages')} >
                            <View>
                                <Icon name="commenting" style={{ fontSize: 27, color: '#8da6d5' }} />
                                {
                                    this.state.pcCount > 0 &&
                                    <View style={{
                                        position: 'absolute',
                                        right: -12,
                                        top: -8,
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#e74c3c',
                                        borderRadius: 100,
                                        width: 20,
                                        height: 20,
                                    }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontFamily: 'Roboto-Medium',
                                            color: '#FFFFFF',
                                        }}>{this.state.pcCount}</Text>
                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            width: widthShow
                        }} onPress={() => { ShowSearch(!isSearchOpen) }}>
                            <Icon name="search" style={{ fontSize: 27, color: '#8da6d5' }} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet)),
    ShowSearch:(open)=>dispatch(ShowSearchAction(open))
});
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
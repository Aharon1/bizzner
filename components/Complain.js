import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    Text, View, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView,
    AsyncStorage,
    Platform, ScrollView
} from 'react-native';
import { SERVER_URL } from '../Constants';
import MainStyles from './StyleSheet';
import Toast from 'react-native-simple-toast';
import HardText from '../HardText';
import { loadingChange } from '../Actions';
import { connect } from 'react-redux';
import Axios from 'axios';
class ComplainPageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            Name: '',
            subject: '',
            message: '',
            UserID: this.props.reducer.userData
        }
    }
    get_usersDetails = async () => {
        await Axios.get(`${SERVER_URL}?action=get_user_data&user_id=${this.state.userID}`)
            .then(res => {
                let { code, body } = res.data;
                if (code == 200) {
                    this.setState({
                        loading: false,
                        emailAddress: body.user_email
                    });
                }
            })
    }
    componentDidMount() {
        this.get_usersDetails();
    }
    sendComplain() {
        this.props.loadingChangeAction(true);
        Axios(SERVER_URL + '?action=send_complain&name=' + this.state.name + '&subject=' + this.state.subject + '&message=' + this.state.message + '&useremail=' + this.state.emailAddress)
            .then(res => {
                let { message } = res.data
                setTimeout(() => { Toast.show(message, Toast.SHORT); }, 200);
                this.setState({ name: '', subject: '', message: '' }, () => { this.props.loadingChangeAction(false); });
            })
            .catch(err => {
                setTimeout(() => { Toast.show(err.message, Toast.SHORT); }, 200);
                this.props.loadingChangeAction(false);
            });
    }
    render() {
        var behavior = (Platform.OS == 'ios') ? 'padding' : '';
        return (
            <View style={MainStyles.normalContainer}>
                {/*Body Section*/}
                <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior={behavior}>
                    <ScrollView style={[MainStyles.profileBody, { marginTop: 20 }]}>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <TextInput style={MainStyles.ifWITI} placeholder="Name" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.name} onChangeText={(text) => { this.setState({ name: text }) }} />
                        </View>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <TextInput style={MainStyles.ifWITI} placeholder="Subject" placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.subject} onChangeText={(text) => { this.setState({ subject: text }) }} />
                        </View>
                        <View style={MainStyles.inputFieldWithIcon}>
                            <TextInput style={MainStyles.ifWITI} placeholder="Message" multiline={true} placeholderTextColor="#03163a" underlineColorAndroid="transparent" value={this.state.message} numberOfLines={6} onChangeText={(text) => { this.setState({ message: text }) }} />
                        </View>

                        <View style={[MainStyles.btnWrapper, { flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }]}>
                            <TouchableOpacity style={MainStyles.btnSave} onPress={() => { this.sendComplain(); }}>
                                <Text style={MainStyles.btnSaveText}>{HardText.send_btn}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet))
});
export default connect(mapStateToProps, mapDispatchToProps)(ComplainPageScreen);
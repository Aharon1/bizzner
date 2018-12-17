import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export function HeaderButton({ onPress }) {
    return (
        <TouchableOpacity style={{ paddingLeft: 12 }} onPress={onPress}>
            <Icon name="bars" style={{ fontSize: 24, color: '#8da6d5' }} />
        </TouchableOpacity>
    )
}

import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';

const Button = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;
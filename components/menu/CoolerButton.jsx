import React, { Component } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '@styles/main';
import { useFonts } from 'expo-font';

const CoolerButton = ({ onPress, title }) => {
    useFonts({
        Honk: require('@assets/fonts/Honk_400Regular.ttf'),
    });

    let coolerStyles = {
        coolerButton: {
            width: 200,
            height: 80,
            backgroundColor: '#007276ff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            marginVertical: 10,
            
            
        },
        coolerButtonText: {
            color: 'white',
            fontFamily: 'Honk',
            fontSize: 48,
            
            
        },
    };

    return (
        <Pressable onPress={onPress} style={coolerStyles.coolerButton}>
            <Text style={coolerStyles.coolerButtonText}>{title}</Text>
        </Pressable>
    );
};

export default CoolerButton;

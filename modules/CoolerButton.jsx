import React, { Component } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '@styles/main';
import { useFonts } from 'expo-font';

const CoolerButton = ({ onPress, title }) => {
    useFonts({
        Honk: require('../node_modules/@expo-google-fonts/honk/400Regular/Honk_400Regular.ttf'),
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
            borderColor: 'red',
            borderWidth: 2,
        },
        coolerButtonText: {
            color: 'white',
            fontFamily: 'Honk',
            fontSize: 48,
            borderColor: 'red',
            borderWidth: 2,
        },
    };

    return (
        <Pressable onPress={onPress} style={coolerStyles.coolerButton}>
            <Text style={coolerStyles.coolerButtonText}>{title}</Text>
        </Pressable>
    );
};

export default CoolerButton;

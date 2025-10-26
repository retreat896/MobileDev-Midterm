import { Text, View, Component, Pressable } from 'react-native'
import { useState } from 'react';

const PopupScreen = ({ children, title, width, height, radius, style }) => {

    return (
        <View
            style={{
                width: width,
                height: height,
                display: 'flexbox',
                borderRadius: radius,
                borderWidth: 1,
                
                backgroundColor: 'lightblue',
                position: 'absolute',
                zIndex: 1,
                opacity: 0.8,
            }}>

            <Text style={{
                textAlign: 'center',
                color: 'black'
            }}>{title}</Text>

            <View>
                {children}    
            </View>
        </View>
    )
}


export default PopupScreen;

import { Text, View, Component, Pressable } from 'react-native'
import { useState } from 'react';

const PopupScreen = ({ children, title }) => {

    return (
        <View
            style={styles.popup}>

            <Text style={styles.text}>{title}</Text>

            <View>
                {children}
            </View>
        </View>
    )
}
let styles = {
    popup: {
        display: 'flexbox',
        flex:1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'lime',
        position: 'absolute',
        zIndex: 1,
        opacity: 0.8,
    },
    text: {
        textAlign: 'center',
        color: 'black'
    }
}


export default PopupScreen;

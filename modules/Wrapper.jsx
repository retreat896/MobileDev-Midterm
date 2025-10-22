import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

const Wrapper = ({ children, title, subtitle, onOpen, onClose, style }) => {
    const { width, height } = useWindowDimensions();

    const myCode = () => {
        try {
            onOpen();
        } catch(e) {
            console.log("No Open Function Defined");
        }
    }

    return (
        <Card style={[style||null]}>
            {myCode()}
            <Text style={wrapperStyles.title}>{title}</Text>
            <Card.Actions style={wrapperStyles.close}>
                <Button mode="contained" onPress={onClose}>X</Button>
            </Card.Actions>
            {children}
        </Card>
    );
}

const wrapperStyles = StyleSheet.create({
    container: {
        height: '100%',
                borderColor: "red",
        borderWidth: 2,
    },
    close: {
        position:'absolute',
        alignSelf: 'flex-end',
        borderColor: "red",
        borderWidth: 2,
    },
    title:{
        position:"absolute",
        top:0,
        alignSelf:"center",
        fontSize: 48,
        fontWeight: 700,
        borderColor: "green",
        borderWidth: 2,
        zIndex:2,
        padding:5,
        backgroundColor:"rgba(0, 255, 255, 0.65)",
        borderRadius:10,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    }
});

export default Wrapper;
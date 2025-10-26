import React, { useEffect } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { Button, Card, Dialog, FAB, Text } from 'react-native-paper';

const Wrapper = ({ children, title, subtitle, onOpen, onClose, style }) => {
    const { width, height } = useWindowDimensions();

    // Call onOpen using UseEffect on every initial render
    useEffect(onOpen, []);

    return (
        // <Card style={[style||null]}>
        //     <Text style={wrapperStyles.title}>{title}</Text>
        //     <Card.Actions style={wrapperStyles.close}>
        //         <Button mode="contained" onPress={onClose}>X</Button>
        //     </Card.Actions>
        //     {children}
        // </Card>
        <Dialog visible={true} style={[style, wrapperStyles.container]} onDismiss={onClose}>
            <Dialog.Actions style={wrapperStyles.close}>
                <FAB icon="close" onPress={onClose} />
            </Dialog.Actions>
            <Dialog.Title style={wrapperStyles.title}>{title}</Dialog.Title>
            <Dialog.Content style={wrapperStyles.content}>{children}</Dialog.Content>
        </Dialog>
    );
};

const wrapperStyles = StyleSheet.create({
    container: {
        height: '100%',
    },
    close: {
        position: 'absolute',
        alignSelf: 'flex-end',
        zIndex: 1,
        opacity: 1,
    },
    title: {
        position: 'absolute',
        top: -10,
        alignSelf: 'center',
        zIndex: 2,
        padding: 0,
        opacity: 1,
    },
    content: {
        opacity: 1,
        marginTop:50
    },
});

export default Wrapper;

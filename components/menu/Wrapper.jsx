import React, { useEffect } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { Button, Card, Dialog, FAB, Text, Portal } from 'react-native-paper';

const Wrapper = ({ children, title, subtitle, onOpen, onClose, style, titleStyle }) => {
    const { width, height } = useWindowDimensions();

    // Call onOpen using UseEffect on every initial render
    useEffect(() => {
        if (onOpen) onOpen();
    }, []);

    return (
        <Portal>
            <Dialog visible={true} style={[style, wrapperStyles.container]} onDismiss={onClose ? onClose : () => { }}>
                {onClose && (
                    <View style={wrapperStyles.closeButtonContainer}>
                        <FAB icon="close" onPress={onClose} size="small" />
                    </View>
                )}

                <View style={wrapperStyles.headerContainer}>
                    <Dialog.Title style={[wrapperStyles.title, titleStyle]}>{title}</Dialog.Title>
                </View>

                <Dialog.Content style={wrapperStyles.content}>{children}</Dialog.Content>
            </Dialog>
        </Portal>
    );
};

const wrapperStyles = StyleSheet.create({
    container: {
        width: '80%',
        height: '90%',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        minHeight: 60,
        zIndex: 2,
        marginTop: 0,
        width: '100%',
    },
    title: {
        margin: 0, // Remove default margin
        textAlign: 'center',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    content: {
        flex: 1,
        marginTop: 0, // Removed fixed margin
    },
});

export default Wrapper;

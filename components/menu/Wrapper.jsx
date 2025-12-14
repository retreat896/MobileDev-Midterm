import React, { useEffect } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { Button, Card, Dialog, FAB, Text, Portal } from 'react-native-paper';

const Wrapper = ({ children, title, subtitle, onOpen, onClose, style }) => {
    const { width, height } = useWindowDimensions();

    // Call onOpen using UseEffect on every initial render
    useEffect(() => {
        if (onOpen) onOpen();
    }, []);

    return (
        <Portal>
            <Dialog visible={true} style={[style, wrapperStyles.container]} onDismiss={onClose ? onClose : () => {}}>
                <View style={wrapperStyles.headerContainer}>
                    <Dialog.Title style={wrapperStyles.title}>{title}</Dialog.Title>
                    {onClose && (
                        <View style={wrapperStyles.closeButtonContainer}>
                            <FAB icon="close" onPress={onClose} />
                        </View>
                    )}
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 10,
        minHeight: 80,
        zIndex: 2,
        marginTop: 0,
    },
    title: {
        margin: 0, // Remove default margin
        textAlign: 'center',
    },
    closeButtonContainer: {
        position: 'absolute',
        right: 12,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        marginTop: 0, // Removed fixed margin
    },
});

export default Wrapper;

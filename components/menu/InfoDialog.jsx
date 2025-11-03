import React, { useState } from 'react';
import { Pressable, Platform, View, KeyboardAvoidingView } from 'react-native';
import { Portal, Text, TextInput, Dialog, Button } from 'react-native-paper';
import { styles } from '@styles/main';
import { useFonts } from 'expo-font';

const InfoDialog = ({ title, info, isError, visible, dismissable, confirmText, onConfirm, onDismiss }) => {
    return (
        <Portal style={styles.dialog}>
            <Dialog
                visible={visible}
                dismissable={dismissable}
                dismissableBackButton={dismissable}
                onDismiss={onDismiss}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text style={ isError ? styles.error : null }>{info}</Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={() => { onConfirm(); }}>
                        {confirmText || "OK"}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default InfoDialog;

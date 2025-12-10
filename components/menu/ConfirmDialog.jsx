import React, { useState } from 'react';
import { Pressable, Text, Platform, View, KeyboardAvoidingView } from 'react-native';
import { TextInput, Dialog, Button } from 'react-native-paper';
import { styles } from '@styles/main';
import { useFonts } from 'expo-font';

const ConfirmDialog = ({ title, info, isError, visible, denyText, onDeny, confirmText, onConfirm }) => {
    return (
        <Dialog
            visible={visible}
            dismissable={false}
            dismissableBackButton={false}
        >
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
                <Text style={isError ? styles.error : null}>{info}</Text>
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={() => { onDeny(); }}>
                    {denyText || "Cancel"}
                </Button>
                <Button onPress={() => { onConfirm(); }}>
                    {confirmText || "OK"}
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default ConfirmDialog;

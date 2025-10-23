import { useFonts } from '@expo-google-fonts/honk';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c1c1cff',
        borderWidth: 1,
        borderColor: 'red',
    },
    wrapper: {
        position: 'absolute',
        width: '90%',
        height: '90%',
        flex: 1,
        opacity: 0.9,
        borderColor: 'red',
        borderWidth: 2,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: 'red',
        borderWidth: 2,
    },
});

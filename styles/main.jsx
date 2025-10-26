import { useFonts } from '@expo-google-fonts/honk';
import { useInteropClassName } from 'expo-router/build/link/useLinkHooks';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c1c1cff',
        borderWidth: 1,
        
    },
    wrapper: {

    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    debug: {
        borderColor: 'blue',
        
    },
    portal: {
        width: '100%',
    },
    usernameModal: {
        position: 'absolute',
        justifyContent: 'center',
        marginHorizontal: '10%',
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius:8
    },
    username:{
        color:"red",
        fontFamily:"Honk"
    },
});

import { useFonts } from '@expo-google-fonts/honk';
import { useInteropClassName } from 'expo-router/build/link/useLinkHooks';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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

        borderRadius: 8,
    },
    username: {
        color: 'red',
        fontFamily: 'Honk',
    },
    imageFullDisplay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});
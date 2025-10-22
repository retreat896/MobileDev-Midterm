
import { useFonts } from '@expo-google-fonts/honk';
import { StyleSheet } from 'react-native';

// useFonts({
//     'Honk': require('../node_modules/@expo-google-fonts/honk/400Regular/Honk_400Regular.ttf'),
// });

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c1c1cff',
        borderWidth: 1,
        borderColor: 'red',
    },
    titleButton: {
        width: 200,
        height: 80,
        backgroundColor: '#007276ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginVertical: 10,
        borderColor: "red",
        borderWidth: 2,
    },
    titleButtonText: {
        color: 'white',
        fontFamily:  'Honk',
        fontSize: 48,
        borderColor: "red",
        borderWidth: 2,
    },
    wrapper: {
        position:"absolute",
        width:"90%",
        height:"90%",
        flex:1,
        opacity: 0.90,
        borderColor: "red",
        borderWidth: 2,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        borderColor: "red",
        borderWidth: 2,
    }
});

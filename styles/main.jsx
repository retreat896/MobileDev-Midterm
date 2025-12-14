import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c1c1cff',
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        width: '66%',
        height: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    imageFullDisplay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});

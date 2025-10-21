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
    gameText: {
        color: '#ffffff',
    },
    titleButton: {
        width: 200,
        height: 80,
        backgroundColor: '#007276ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginVertical: 10,
    },
    titleButtonText: {
        color: 'white',
    },
    popupContainer: {
        flex:1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'lime',
        borderWidth:1,
        backgroundColor: 'rgba(0, 255, 81, 0.21)',
        zIndex: 1
    },
    popupText: {
        textAlign: 'center',
        color: 'black',
    },
    pageButton: {
        width: 50,
        height: 25,
        backgroundColor: '#007276ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginVertical: 10,
    },


});

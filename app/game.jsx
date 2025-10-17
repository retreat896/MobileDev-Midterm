import { Text, View } from 'react-native';
import React from 'react';
import { styles } from '../styles/main';

const game = () => {
    return (
        <View style={styles.mainView}>
            <Text style={styles.gameText}>game go here</Text>
        </View>
    );
};

export default game;

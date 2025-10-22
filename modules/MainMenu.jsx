import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import CoolerButton from '@components/CoolerButton';

const MainMenu = ({onPlay, onSettings, onStats}) => {

    return (
        <View>
            <CoolerButton title="Play" onPress={onPlay||null} />
            <CoolerButton title="Settings" onPress={onSettings||null} />
            <CoolerButton title="Stats" onPress={onStats||null} />

        </View>
    )
};

export default MainMenu;
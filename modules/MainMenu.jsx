import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CoolerButton from './CoolerButton'

const MainMenu = ({onPlay, onSettings, onStats}) => {

    function play() {
        onPlay();
        console.log("running onPlay;")
    }

    return (
        <View>
            <CoolerButton title="Play" onPress={()=>play()} />
            <CoolerButton title="Settings" onPress={onSettings||null} />
            <CoolerButton title="Stats" onPress={onStats||null} />

        </View>
    )
}

export default MainMenu

const styles = StyleSheet.create({})
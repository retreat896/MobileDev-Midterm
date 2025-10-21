import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CoolerButton from './CoolerButton'

const MainMenu = ({onPlay, onSettings, onStats}) => {
    return (
        <View>
            <CoolerButton title="Play" onPress={onPlay||null} />
            <CoolerButton title="Settings" onPress={onSettings||null} />
            <CoolerButton title="Stats" onPress={onSettings||null} />
        </View>
    )
}

export default MainMenu

const styles = StyleSheet.create({})
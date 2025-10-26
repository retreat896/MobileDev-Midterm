import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import CoolerButton from '@components/menu/CoolerButton';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const Background = require('@assets/backgrounds/used/Main_Background.jpg');

const MainMenu = ({ onPlay, onSettings, onStats }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Background Layer */}
                <ImageBackground
                    source={Background}
                    resizeMode="contain" // Changed to contain to show full image
                    style={[
                        styles.backgroundImage,
                        styles.imageFullDisplay
                    ]}
                />

                {/* Content Overlay Layer */}
                <View style={styles.contentOverlay}>
                    <CoolerButton title="Play" onPress={onPlay || null} />
                    <CoolerButton title="Settings" onPress={onSettings || null} />
                    <CoolerButton title="Stats" onPress={onStats || null} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Background color for letterboxing areas
    },
    backgroundImage: {
        position: 'absolute',
    },
    imageFullDisplay: {
        width: screenWidth,
        height: screenHeight,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    contentOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MainMenu;
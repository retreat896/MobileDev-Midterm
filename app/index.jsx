import { View, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { styles } from '@styles/main';
import LevelSelect from '@components/LevelSelect';
import MainMenu from '@components/MainMenu';
import Wrapper from '@components/Wrapper';
import * as ScreenOrientation from 'expo-screen-orientation';

// router.push(path): Navigates to a new screen and adds it to the navigation stack.
// router.replace(path): Replaces the current screen in the navigation stack with the new one.
// router.back(): Navigates back to the previous screen.
// router.navigate({ pathname: string, params: object }): Navigates to a specific path with parameters.

const index = () => {
    // Lock the screen to landscape mode
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    const router = useRouter();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    const [settings, openSettings] = useState(false);
    const [stats, openStats] = useState(false);
    const [levelSelect, openLevelSelect] = useState(false);

    useEffect(() => {
        console.log("Loaded Main index.jsx")
    }, [settings, stats, levelSelect])


    const showSettings = () => {
        if (settings) {
            return (
                <Wrapper style={styles.wrapper} title="Settings" subtitle="here be settings" onOpen={() => console.log('Settings Opened')} onClose={() => openSettings(false)} >
                    <Text>I am a child</Text>
                </Wrapper>
            )
        }
        return null;
    }

    const showStats = () => {
        if (stats) {
            return (
                <Wrapper style={styles.wrapper} title="Player Stats" subtitle="here be stats" onOpen={() => console.log('Stats Opened')} onClose={() => openStats(false)} >
                    <Text>I am a child</Text>
                </Wrapper>
            )
        }
        return null;
    }

    const showLevelSelect = () => {
        let levels = ['https://images.dog.ceo/breeds/terrier-andalusian/images.jpg'];
        if (levelSelect) {
            return (
                <Wrapper style={styles.wrapper} title="Levels" subtitle="here be levels" onOpen={() => console.log('Levels Opened')} onClose={() => openLevelSelect(false)}>
                    <LevelSelect levels={levels} onSelect={(level) => console.log("Selected: " + levels[level])} />
                </Wrapper>
            )
        }
        return null;
    }


    return (
        // <SafeAreaProvider>
        //     <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
            <MainMenu
                onPlay={() => openLevelSelect(true)}
                onSettings={() => openSettings(true)}
                onStats={() => openStats(true)} />

            {/* Toggle the Modal display per each option */}
            {showSettings()}
            {showLevelSelect()}
            {showStats()}
        </View>
        //     </SafeAreaView>
        // </SafeAreaProvider>
    );
};

// export default index
export default index;
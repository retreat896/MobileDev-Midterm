import { View, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { styles } from '@styles/main';
import LevelSelect from '@components/LevelSelect';
import MainMenu from '@components/MainMenu';
import Wrapper from '@components/Wrapper';
import Level from '@app/Level';
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
    // A dynamic Wrapper Title variable
    const [wrapperTitle, setWrapperTitle] = useState('');

    useEffect(() => {
        console.log("Loaded Main index.jsx")
    }, [settings, stats, levelSelect])


    const showSettings = () => {
        if (settings) {
            return (
                <Wrapper title={wrapperTitle} style={styles.wrapper}
                    onOpen={(() => {
                        console.log('Settings Opened');
                        setWrapperTitle('Settings');
                    })}

                    onClose={() => {
                        console.log('Settings Closed');
                        openSettings(false);
                        setWrapperTitle('');
                    }} >
                    
                    <Text>I am a child</Text>
                </Wrapper>
            )
        }
        return null;
    }

    const showStats = () => {
        if (stats) {
            return (
                <Wrapper title={wrapperTitle} style={styles.wrapper}
                    onOpen={(() => {
                        console.log('Player-Stats Opened');
                        setWrapperTitle('Player Stats');
                    })}

                    onClose={() => {
                        console.log('Player-Stats Closed');
                        openStats(false);
                        setWrapperTitle('');
                    }} >

                    <Text>I am a child</Text>
                </Wrapper>
            )
        }
        return null;
    }

    const showLevelSelect = () => {
        const levels = [
            new Level("HelloWorld").setImage(require('@assets/favicon.png')), 
            new Level("Lo").setImageURI('https://images.dog.ceo/breeds/terrier-andalusian/images.jpg'),
            new Level("A. Lovelace").setImage(require('@assets/splash-icon.png'))
        ];

        if (levelSelect) {
            return (
                <Wrapper title={wrapperTitle} style={styles.wrapper}
                    onOpen={(() => {
                        console.log('Level-Select Opened');
                        setWrapperTitle(levels[0].getName()); // Set to the first level
                    })}

                    onClose={() => {
                        console.log('Level-Select Closed');
                        openLevelSelect(false);
                        setWrapperTitle('');
                    }} >
                        
                    <LevelSelect levels={levels} 
                        onSelect={(level) => console.log("Level Selected: " + level.getName())}
                        onChange={(level) => { setWrapperTitle(level.getName())}}
                    />
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
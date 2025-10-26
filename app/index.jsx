import { View, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { styles } from '@styles/main';
import LevelSelect from '@modules/LevelSelect';
import MainMenu from '@modules/MainMenu';
import Wrapper from '@modules/Wrapper';
import Level from '@app/Level';
import * as ScreenOrientation from 'expo-screen-orientation';
import leveldata from '@assets/leveldata.json';

// router.push(path): Navigates to a new screen and adds it to the navigation stack.
// router.replace(path): Replaces the current screen in the navigation stack with the new one.
// router.back(): Navigates back to the previous screen.
// router.navigate({ pathname: string, params: object }): Navigates to a specific path with parameters.

// Array to hold all levels
const levels = [];

async function fetchLevels() {
    let start = Date.now();
    try {
        // Process each level
        for (let level of leveldata) {
            // Fetch the Level image
            let res = await fetch("https://raw.githubusercontent.com/retreat896/MobileDev-Midterm/main/" + level.image).catch(e => console.error)
            
            if (res.status !== 200) {
                console.log(`Failed to resolve: "${res.url}`);
                console.log(`Status: ${res.status}  -  "${res.statusText}"`);
                
                // Keep going
                continue;
            }

            // Process the response data
            let data = await res.json();
        
            // Create a new Level using the name and image
            levels.push(new Level(level.name).setImage(data));
            console.log(`Created Level: "${level.name}"`);
        }
    }
    catch (e) {
        console.error(e);
    }
    let end = Date.now();

    console.log(`Level Load Time: ${(end - start)/1000} seconds`);
}

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

        fetchLevels();
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
                        onSelect={(level) => {console.log("Level Selected: " + level.getName()); router.navigate("/game")}}
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
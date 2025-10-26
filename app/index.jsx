import { View, useWindowDimensions } from 'react-native';
import { Modal, Dialog, Text, Button, TextInput, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { styles } from '@styles/main';
import LevelSelect from '@components/menu/LevelSelect';
import MainMenu from '@components/menu/MainMenu';
import Wrapper from '@components/menu/Wrapper';
import Level from '@modules/menu/Level';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
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
    const [usernameInput, openUsernameInput] = useState(false);
    const [usernameError, showUsernameError] = useState(false);
    const [username, changeUsername] = useState('');
    const [tempUsername, changeTempUsername] = useState('');
    const [playerStats, changePlayerStats] = useState({highScore:"", totalPlayTime:""})

    // A dynamic Wrapper Title variable
    const [wrapperTitle, setWrapperTitle] = useState('');

    useEffect(() => {
        async function loadUsername() {
            try {
                const stored = await AsyncStorage.getItem('username');
                if (!stored) {
                    openUsernameInput(true);
                } else {
                    changeUsername(stored);
                    console.log('Loaded username:', stored);
                }
            } catch (error) {
                console.error('Error loading username:', error);
            }
        }

        async function loadStats(){
             try {
                const highScore = await AsyncStorage.getItem('HighScore');
                const totalPlayTime = await AsyncStorage.getItem('TotalDuration');
                changePlayerStats({highScore:highScore, totalPlayTime:totalPlayTime})
            } catch (error) {
                console.error('Error loading username:', error);
            }
        }

        loadStats();
        loadUsername();
    }, []);

    async function handleUsernameChange(text, update = false) {
        try {
            if (update == true) {
                await AsyncStorage.setItem('username', text);
                changeUsername(text);
                console.log("updating username to '" + text + "'");
            } else {
                changeTempUsername(text);
                console.log("updating tempusername to '" + text + "'");
            }

            showUsernameError(false);
        } catch (error) {
            console.error('Error saving username:', error);
        }
    }

    useEffect(() => {
        fetchLevels();
        
        async function getUsername() {
            return await AsyncStorage.getItem('username');
        }
        
        console.log('Loaded Main index.jsx');
        if (getUsername() === '') {
            openUsernameInput(true); //show initial username input if the username is empty
        }
        
        console.log(getUsername());
    }, [settings, stats, levelSelect, usernameInput, username]);

    const showSettings = () => {
        if (settings) {
            return (
                <Wrapper
                    title={wrapperTitle}
                    style={styles.wrapper}
                    onOpen={() => {
                        console.log('Settings Opened');
                        setWrapperTitle('Settings');
                    }}
                    onClose={() => {
                        console.log('Settings Closed');
                        openSettings(false);
                        setWrapperTitle('');
                    }}>
                    <Text>I am a child</Text>
                </Wrapper>
            );
        }
        return null;
    };

    const showStats = () => {
        if (stats) {
            return (
                <Wrapper
                    title={wrapperTitle}
                    style={styles.wrapper}
                    onOpen={() => {
                        console.log('Player-Stats Opened');
                        setWrapperTitle('Player Stats');
                    }}
                    onClose={() => {
                        console.log('Player-Stats Closed');
                        openStats(false);
                        setWrapperTitle('');
                    }}>
                    <View style={styles.row}>
                        <Text variant="bodyLarge">High Score: {playerStats.highScore||0}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text variant="bodyLarge">Total Playtime: {playerStats.totalPlayTime||0}</Text>
                    </View>
                </Wrapper>
            );
        }
        return null;
    };

    const showLevelSelect = () => {
        const levels = [
            // new Level("HelloWorld").setImage(require('@assets/favicon.png')),
            new Level('Level 1').setImageURI('https://images.dog.ceo/breeds/terrier-andalusian/images.jpg'),
            // new Level("A. Lovelace").setImage(require('@assets/splash-icon.png'))
        ];

        if (levelSelect) {
            return (
                <Wrapper
                    title={wrapperTitle}
                    style={styles.wrapper}
                    onOpen={() => {
                        console.log('Level-Select Opened');
                        setWrapperTitle(levels[0].getName()); // Set to the first level
                    }}
                    onClose={() => {
                        console.log('Level-Select Closed');
                        openLevelSelect(false);
                        setWrapperTitle('');
                    }}>
                    <LevelSelect
                        levels={levels}
                        onSelect={(level) => {
                            console.log('Level Selected: ' + level.getName());
                            router.navigate('/Game');
                        }}
                        onChange={(level) => {
                            setWrapperTitle(level.getName());
                        }}
                    />
                </Wrapper>
            );
        }
        return null;
    };

    return (
        // <SafeAreaProvider>
        //     <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
            <StatusBar hidden={true} />
            <Text variant="displaySmall" style={styles.username}>Welcome {username !== '' ? username : 'John Doe'}!</Text>
            <MainMenu onPlay={() => openLevelSelect(true)} onSettings={() => openSettings(true)} onStats={() => openStats(true)} />
            
            {/* Toggle the Modal display per each option */}
            {showSettings()}
            {showLevelSelect()}
            {showStats()}
            <Dialog
                visible={usernameInput}
                onDismiss={() => {
                    if (username == '') {
                        openUsernameInput(true);
                        showUsernameError(true);
                        return;
                    }
                    showUsernameError(false);
                    openUsernameInput(false);
                    console.log('Closing Username Input');
                }}>
                <Dialog.Title>Please Enter A Username</Dialog.Title>
                <Dialog.Content>
                    {usernameError ? <Text style={styles.error}>Please Submit a Username</Text> : null}
                    <TextInput value={tempUsername} onChangeText={handleUsernameChange} error={usernameError} placeholder="Username" mode="outlined" />
                </Dialog.Content>

                <Dialog.Actions>
                    <Button
                        onPress={() => {
                            if (tempUsername == '') {
                                openUsernameInput(true);
                                showUsernameError(true);
                                return;
                            }
                            handleUsernameChange(tempUsername, true);
                            openUsernameInput(false)
                            console.log('Closing Username Input');
                        }}>
                        Done
                    </Button>
                </Dialog.Actions>
            </Dialog>
            <Button
                onPress={() => {
                    handleUsernameChange('', true);
                    openUsernameInput(true)
                    changeTempUsername('');
                    changeUsername('');
                }}>
                reset Username
            </Button>
        </View>
        //     </SafeAreaView>
        // </SafeAreaProvider>
    );
};

// export default index
export default index;

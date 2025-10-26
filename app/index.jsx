import { View, useWindowDimensions } from 'react-native';
import { Modal, Dialog, Text, Button, TextInput, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { styles } from '@styles/main';
import LevelSelect from '@components/menu/LevelSelect';
import MainMenu from '@components/menu/MainMenu';
import Wrapper from '@components/menu/Wrapper';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useLevel } from '@components/LevelContext';

// router.push(path): Navigates to a new screen and adds it to the navigation stack.
// router.replace(path): Replaces the current screen in the navigation stack with the new one.
// router.back(): Navigates back to the previous screen.
// router.navigate({ pathname: string, params: object }): Navigates to a specific path with parameters.

const index = () => {
    // Lock the screen to landscape mode
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    const router = useRouter();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    // Get the global Level properties and operations
    const { level, allLoaded, allLevels } = useLevel();

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

    // Eventually: Add a loading screen while leveldata is loading
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

        if (levelSelect) {
            return (
                <Wrapper
                    title={wrapperTitle}
                    style={styles.wrapper}
                    onOpen={() => {
                        console.log('Level-Select Opened');
                        setWrapperTitle(allLevels[0].getName()||null); // Set to the first level
                    }}
                    onClose={() => {
                        console.log('Level-Select Closed');
                        openLevelSelect(false);
                        setWrapperTitle('');
                    }}>
                    <LevelSelect
                        levels={allLevels} // Uses the LevelContext allLevels
                        onSelect={(selected) => {
                            console.log('Level Selected: ' + selected.getName());
                            level.current = selected; // Set LevelContext current level
                            router.navigate('/game'); // No need to pass parameters to Game when can use Context
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

    if (!allLoaded) {
        return (
            <View>
                <Text>
                    The level data is loading. Please hold.
                </Text>
            </View>
        )
    }

    return (
        // <SafeAreaProvider>
        //     <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
            <StatusBar hidden={true} />
            {/* <Text variant="displaySmall" style={styles.username}>Welcome {username !== '' ? username : 'John Doe'}!</Text> */}
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

import { View, Platform, useWindowDimensions, KeyboardAvoidingView, KeyboardAvoidingViewBase, KeyboardAvoidingViewComponent, ImageBackground, FlatList } from 'react-native';
import { Modal, Dialog, Text, Button, Chip, Card, TextInput, PaperProvider, FAB } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { styles } from '@styles/main';
import LevelSelect from '@components/menu/LevelSelect';
import MainMenu from '@components/menu/MainMenu';
import InfoDialog from '@components/menu/InfoDialog';
import ConfirmDialog from '@components/menu/ConfirmDialog';
import Wrapper from '@components/menu/Wrapper';
import { StatusBar } from 'expo-status-bar';
import { useLevel } from '@components/LevelContext';
import { useData, getKeys } from '@components/DataContext';
import Constants from "expo-constants";

// router.push(path): Navigates to a new screen and adds it to the navigation stack.
// router.replace(path): Replaces the current screen in the navigation stack with the new one.
// router.back(): Navigates back to the previous screen.
// router.navigate({ pathname: string, params: object }): Navigates to a specific path with parameters.

// DOTENV
const { API_SERVER_URL } = Constants.expoConfig.extra;

const index = () => {
    // Lock the screen to landscape mode
    const Background = require('@assets/backgrounds/used/Main_Background.jpg');

    const router = useRouter();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    // Get the global properties and operations
    const { level, levelsLoaded, allLevels } = useLevel();
    const { dataLoaded, getItem, getKeys, setItem, saveItems } = useData();

    const [settings, openSettings] = useState(false);
    const [stats, openStats] = useState(false);
    const [levelSelect, openLevelSelect] = useState(false);
    const [noUsernameInput, disableUsernameInput] = useState(true);
    const [forceUsername, setForceUsername] = useState(false);
    const [usernameError, showUsernameError] = useState(false);
    const [username, changeUsername] = useState('');
    const [usernameConfirm, showUsernameConfirm] = useState(false);
    const [playerStats, setPlayerStats] = useState(null);

    // A dynamic Wrapper Title variable
    const [wrapperTitle, setWrapperTitle] = useState('');

    // Execute once, on initial render
    useEffect(() => {
        console.log('RUNNING');
    }, []);

    /**
     * Register the player with the server, or update their username
     * @example
     * 
     * // Player name is changed or initialized
     * handleUsernameSubmit(newUsername) // Verifies valid username syntax
     * /// Above function calls this:
     * 
     * // Update with server
     * await registerOrUpdateName();
     * 
     * // Log the updated username, and print unique identifier
     * console.log(getItem('UUID'));
     * console.log(getItem('Username'));
     * 
     */
    const registerOrUpdateName = async () => {
        // Get the UUID/Username from storage, if any
        const uuid = getItem('UUID');
        
        console.log("Fetching: " + `${API_SERVER_URL}/player/${uuid ? uuid + '/name' : ''}`);

        // Send Username submission to the server, or update the player's username
        const response = await fetch(`${API_SERVER_URL}/player/${uuid ? uuid + '/name' : ''}`, {
            method: uuid ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        }).catch(e => console.error);

        // Check server response
        if (response.ok) {
            // Process server response
            const data = await response.json();
            console.log(data.message);
            
            // The user was required to submit a username
            if (forceUsername) {
                // Disable the forced-username input
                setForceUsername(false);
                // Hide the username dialog
                showUsernameConfirm(false);
                // Close settings
                openSettings(false);
            }

            // Update the username
            // Ensure it is saved
            setItem('Username', username);
            
            // Check for UUID returned
            if (data.UUID) {
                // Store the UUID in device storage
                // Ensure it is saved
                setItem('UUID', data.UUID);
            }

            // Save the updated User and UUID data
            await saveItems('Username', 'UUID');
        }
        else {
            console.error(`Failed to register or update player name.`);
        }
    }

    /**
     * Update player statistics from server
     * Otherwise use existing stored values (by default, defaults.json)
     * @example
     * 
     * // When app opened, update stats to match server
     * 
     * // Update with server
     * await fetchPlayerData();
     * 
     * // Log the latest HighScore and LongestGame values
     * console.log(getItem('HighScore'));
     * console.log(getItem('LongestGame'));
     */
    const fetchPlayerData = async () => {
        // Attempt to fetch the player data from the server
        const response = await fetch(`${API_SERVER_URL}/player/${getItem('UUID')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check response
        if (response.ok) {
            // Get the player data
            const data = await response.json();
            
            // Log any server message
            if (data.message) console.log(data.message);

            // Update the gamedata in the device storage
            for (let key in data) {
                // Save the player data
                // Ensure it is saved
                setItem(key, data[key]);
                await saveItems(key);
            }
        }
        else {
            console.log('Encountered an error fetching playerdata');
        }
    }

    // Execute as soon as the data loads
    useEffect(() => {
        if (!dataLoaded) return;

        // Get the stored Username
        const savedUUID = getItem('UUID');

        console.log("UUID: " + savedUUID);

        // NO DATA
        // No username has been saved
        if (savedUUID == "") {
            console.log("Showing Stetings")
            // Display the settings menu
            openSettings(true);
            showSettings();
            // Force username input
            setForceUsername(true);
            showUsernameConfirm(true);
        }
    }, [dataLoaded]);

    // Execute when one of the menu options is changed
    useEffect(() => {
        console.log('LOADING');

        // Data has been loaded
        if (dataLoaded) {
            const savedUsername = getItem('Username');
            const savedUUID = getItem('UUID');

            // Only run when settings is being opened
            // Username not being edited and doesn't match saved data
            if (settings && (noUsernameInput || username != savedUsername)) {
                console.log('Updating Username: ' + savedUsername);
                changeUsername(savedUsername); // Update the username
            }

            // Fetch player data if the player is registered
            if (savedUUID != "") {
                // Update Player data
                fetchPlayerData();
            }

            // Only run when stats is being opened
            if (stats) {
                // Empty array to store stats
                let stats = [];

                // Store the key and its value to the statistics list
                for (let key of getKeys('gamedata')) {
                    stats.push([key, getItem(key)]);
                }

                console.log('New Stats');
                console.log(stats);

                // Update the player stats
                setPlayerStats(stats);
            }
        }
    }, [settings, stats, levelSelect]);

    /**
     * Verify the submitted username, then update in server
     */
    const handleUsernameSubmit = async () => {
        // Check if username is valid
        const isValidUsername = (str) => {
            return /^[a-zA-Z_\s]+$/.test(str);
        };

        // Action based on validity
        if (!isValidUsername(username)) {
            console.log(`Invalid Username: ${username}`);
            showUsernameError(true);
            return;
        }
        
        console.log(`Username Submitted: ${username}`);
        
        disableUsernameInput(true); // Hide username input
        
        // Update the player name (using getItem('Username'))
        registerOrUpdateName();
    }

    const showSettings = () => {
        if (!settings) return null;

        return (
            <Wrapper
                title={wrapperTitle}
                style={styles.wrapper}
                onOpen={() => {
                    console.log('Settings Opened');
                    setWrapperTitle('Settings');
                }}
                onClose={forceUsername ? () => {} : () => {
                    console.log('Settings Closed');
                    openSettings(false);
                    setWrapperTitle('');
                }}>
                {/* Settings Components */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Or 'position' for Android if 'height' doesn't work
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust 64 based on your header height
                    style={{ flexDirection: 'column', alignContent: 'center' }} // Ensure it takes up available space
                >
                    {/* Username Text Input */}
                    <TextInput
                        disableFullscreenUI // Prevent Fullscreen Stupid Keyboard
                        left={<TextInput.Icon disabled icon="account-outline" />}
                        style={{ width: '50%', alignSelf: 'center' }}
                        theme={{ roundness: 10 }}
                        disabled={noUsernameInput}
                        label="Username"
                        value={username}
                        submitBehavior="blurAndSubmit"
                        onChangeText={(text) => changeUsername(text)}
                        onSubmitEditing={(e) => handleUsernameSubmit(e.nativeEvent.text)}
                    />
                </KeyboardAvoidingView>
                {/* Edit-Username Error Dialog */}
                <InfoDialog 
                    title="Invalid Username"
                    info="A username may only contain a-z, A-Z, '_', and spaces." 
                    isError={true}
                    visible={usernameError}
                    onConfirm={() => showUsernameError(false)}
                />
                {/* Reset-Username Confirm Dialog */}
                <ConfirmDialog
                    title={ (forceUsername ? 'Enter' : 'Reset') + "Username" }
                    info={forceUsername ? "You must enter a username to continue. You may change this in settings at any time." : "Are you sure you want to change this?"}
                    visible={usernameConfirm}
                    onDeny={forceUsername ? () => {} : () => {
                        console.log('Cancelled Username change.');
                        disableUsernameInput(true);
                        // Hide username input
                        showUsernameConfirm(false); // Hide ConfirmDialog
                    }}
                    onConfirm={() => {
                        console.log('Enable Username Input');
                        disableUsernameInput(false);
                        // Enable username input
                        showUsernameConfirm(false); // Hide ConfirmDialog
                    }}
                />
                {/* Reset-Username Button */}
                <View style={styles.row}>
                    <Button
                        compact
                        mode="text"
                        onPress={() => {
                            console.log('Show Dialog');
                            showUsernameConfirm(true); // Show ConfirmDialog
                        }}>
                        
                        Edit Username
                    </Button>
                </View>
            </Wrapper>
        );
    };

    const showStats = () => {
        if (!stats) return null;

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
                <FlatList
                    data={playerStats}
                    renderItem={({ item }) => {
                        // Destructure item from the object
                        return (
                            <View style={styles.row}>
                                <Text variant="bodyLarge">{item[0]}:</Text>
                                <Text variant="bodyLarge">{item[1]}</Text>
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Wrapper>
        );
    };

    const showLevelSelect = () => {
        if (!levelSelect) return null;

        return (
            <Wrapper
                title={wrapperTitle}
                style={styles.wrapper}
                onOpen={() => {
                    console.log('Level-Select Opened');
                    setWrapperTitle(allLevels[0].getName() || null); // Set to the first level
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
                        router.navigate('/GameScreen'); // No need to pass parameters to Game when can use Context
                    }}
                    onChange={(level) => {
                        // Add a space, because some titles don't display the second word
                        // This is a patch, not a fix
                        setWrapperTitle(level.getName() + ' ');
                    }}
                />
            </Wrapper>
        );
    };

    if (!levelsLoaded || !dataLoaded) {
        return (
            <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                <Text>The {!dataLoaded ? 'data is' : !levelsLoaded ? 'levels are' : ''} loading. Please hold.</Text>
            </View>
        );
    }

    return (
        // <SafeAreaProvider>
        //     <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
            <StatusBar hidden={true} />
            <ImageBackground
                source={Background}
                resizeMode="cover" // Changed to contain to show full image
                style={[styles.backgroundImage, styles.imageFullDisplay]}
            />
            {/* <Text variant="displaySmall" style={styles.username}>Welcome {username !== '' ? username : 'John Doe'}!</Text> */}
            <MainMenu onPlay={() => openLevelSelect(true)} onSettings={() => openSettings(true)} onStats={() => openStats(true)} />

            {/* Toggle the Modal display per each option */}
            {showSettings()}
            {showLevelSelect()}
            {showStats()}
            <FAB icon="information" style={styles.info} onPress={() => router.navigate('/info')}></FAB>
        </View>
        //     </SafeAreaView>
        // </SafeAreaProvider>
    );
};

// export default index
export default index;

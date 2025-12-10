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

// router.push(path): Navigates to a new screen and adds it to the navigation stack.
// router.replace(path): Replaces the current screen in the navigation stack with the new one.
// router.back(): Navigates back to the previous screen.
// router.navigate({ pathname: string, params: object }): Navigates to a specific path with parameters.

const index = () => {
    // Lock the screen to landscape mode
    const Background = require('@assets/backgrounds/used/Main_Background.jpg');

    const router = useRouter();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    // Get the global properties and operations
    const { level, levelsLoaded, allLevels } = useLevel();
<<<<<<< HEAD
    const { dataLoaded, getItem, getKeys, setItem, saveItems } = useData();
=======
    const { dataLoaded, getItem, getKeys, setItem } = useData();
>>>>>>> goober

    const [settings, openSettings] = useState(false);
    const [stats, openStats] = useState(false);
    const [levelSelect, openLevelSelect] = useState(false);
    const [noUsernameInput, disableUsernameInput] = useState(true);
    const [usernameError, showUsernameError] = useState(false);
    const [username, changeUsername] = useState(null);
    const [usernameConfirm, showUsernameConfirm] = useState(false);
    const [playerStats, setPlayerStats] = useState(null);

    // A dynamic Wrapper Title variable
    const [wrapperTitle, setWrapperTitle] = useState('');

    // Execute once, on initial render
    useEffect(() => {
        console.log('RUNNING');
    }, []);

<<<<<<< HEAD
=======
    /**
     * Send the username to the server to log in, or create a user account otherwise
     */
    const signupOrLogin = async () => {
        // Get the UUID from storage, if any
        const uuid = getItem('UUID');
        const username = getItem('Username');

        // Determine if the username or UUID must be sent
        const payload = uuid ? { uuid } : { username };

        // Send Username submission to the server
        // Check device storage for UUID to sign up or log in
        const response = await fetch(`${API_SERVER_URL}/${getItem("UUID") ? "login" : "signup"}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Check server response
        if (response.ok) {
            // Process server response
            const data = await response.json();
            console.log(data.message);
            
            // Check for UUID returned
            if (data.uuid) {
                // Store the UUID in device storage
                // Ensure it is saved
                setItem('UUID', data.uuid, saveToAsyncStorage=true);
            }
            
            // Check for JWT Token
            if (data.token) {
                // Store the token in device storage
                // Ensure it is saved
                setItem('Token', data.token, saveToAsyncStorage=true);
            }
        }
    }

    const fetchPlayerData = async () => {
        // Attempt to fetch the player data from the server
        const response = await fetch(`${API_SERVER_URL}/player/${getItem('UUID')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getItem('Token')}`
            }
        })

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
                setItem(key, data[key], saveToAsyncStorage=true);
            }
        }
        else {
            console.log('Encountered an error fetching playerdata');
        }
    }

>>>>>>> goober
    useEffect(() => {
        console.log('LOADING');

        // Data has been loaded
        if (dataLoaded) {
<<<<<<< HEAD
            // Only run when settings is being opened
            // Username not being edited and doesn't match saved data
            if (settings && (noUsernameInput || username != getItem('Username'))) {
                console.log('Updating Username: ' + getItem('Username'));
                changeUsername(getItem('Username')); // Update the username

                // Turn off the username input
                if (!noUsernameInput) {
                    disableUsernameInput(true);
                }
=======
            const savedUsername = getItem('Username');
            const savedUUID = getItem('UUID');

            // Only run when settings is being opened
            // Username not being edited and doesn't match saved data
            if (settings && noUsernameInput && username != savedUsername) {
                console.log('Updating Username: ' + savedUsername);
                changeUsername(savedUsername); // Update the username
            }

            // If there is a username attached to the account, have the user log in
            if (savedUUID || savedUsername) {
                // Login
                signupOrLogin();
                // Player data
                fetchPlayerData();
>>>>>>> goober
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

<<<<<<< HEAD
=======
    // Handle input form submission, but only process username variable
    const handleUsernameSubmit = async () => {
        // Check if username is valid
        const isValidUsername = (str) => {
            return /^[a-zA-Z_]+$/.test(str);
        };

        // Action based on validity
        if (!isValidUsername(username)) {
            console.log(`Invalid Username: ${username}`);
            showUsernameError(true);
            return;
        }

        console.log(`Username Submitted: ${username}`);
        setItem('Username', username, true); // Update the username
        disableUsernameInput(true); // Hide username input

        // TODO: Update username in server
    }

>>>>>>> goober
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
                onClose={() => {
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
<<<<<<< HEAD
                        value={username}
                        submitBehavior="blurAndSubmit"
                        onChangeText={(text) => changeUsername(text)}
                        onSubmitEditing={(submit) => {
                            // Check if username is valid
                            const isValidUsername = (str) => {
                                return /^[a-zA-Z_\s]+$/.test(str);
                            };
                            let text = submit.nativeEvent.text;
                            if (isValidUsername(text)) {
                                console.log(`Username Submitted: ${text}`);
                                setItem('Username', text); // Update the username
                                saveItems('Username'); // Save the username
                                disableUsernameInput(true); // Hide username input
                            }
                            else {
                                console.log(`Invalid Username: ${text}`);
                                showUsernameError(true);
                            }
                        }}></TextInput>
                </KeyboardAvoidingView>
                {/* Edit-Username Error Dialog */}
                <InfoDialog title="Invalid Username" info="A username may only contain a-z, A-Z, '_', and spaces. " isError={true} visible={usernameError} onConfirm={() => showUsernameError(false)} />
=======
                        value="Kristopher Adams"
                        submitBehavior="blurAndSubmit"
                        onChangeText={(text) => changeUsername(text)}
                        onSubmitEditing={(e) => handleUsernameSubmit(e.nativeEvent.text)}
                    />
                </KeyboardAvoidingView>
                {/* Edit-Username Error Dialog */}
                <InfoDialog title="Invalid Username" info="A username may only contain a-z, A-Z and '_'" isError={true} visible={usernameError} onConfirm={() => showUsernameError(false)} />
>>>>>>> goober
                {/* Reset-Username Confirm Dialog */}
                <ConfirmDialog
                    title="Reset Username"
                    info="Are you sure you want to change this?"
                    visible={usernameConfirm}
                    onDeny={() => {
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
<<<<<<< HEAD

=======
                    
>>>>>>> goober
                    <Button
                        compact
                        mode="text"
                        onPress={() => {
                            console.log('Show Dialog');
                            showUsernameConfirm(true); // Show ConfirmDialog
                        }}>
<<<<<<< HEAD

=======
                        
>>>>>>> goober
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
<<<<<<< HEAD
                            <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                                {/* Format the data label with spaces between Pascal case words */}
                                <Text variant="bodyLarge">{item[0].replace(/([a-z])([A-Z])/g, '$1 $2')}:</Text>
                                <Text variant="bodyLarge">{" " + item[1]}</Text>
=======
                            <View style={styles.row}>
                                <Text variant="bodyLarge">{item[0]}:</Text>
                                <Text variant="bodyLarge">{item[1]}</Text>
>>>>>>> goober
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
<<<<<<< HEAD
                        level.current = selected; // Set LevelContext current level 
                        router.navigate('/GameScreen'); // No need to pass parameters to Game when can use Context
=======
                        level.current = selected; // Set LevelContext current level
                        router.navigate('/game'); // No need to pass parameters to Game when can use Context
>>>>>>> goober
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

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
    const { dataLoaded, getItem, getKeys, setItem, saveItems } = useData();

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

    useEffect(() => {
        console.log('LOADING');
        // Data has been loaded
        if (dataLoaded) {
            // Only run when settings is being opened
            // Username not being edited and doesn't match saved data
            if (settings && (noUsernameInput || username != getItem('Username'))) {
                console.log('Updating Username: ' + getItem('Username'));
                changeUsername(getItem('Username')); // Update the username

                // Turn off the username input
                if (!noUsernameInput) {
                    disableUsernameInput(true);
                }
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

    const handleUsernameSubmit = (text) => {
        // Check if username is valid
        const isValidUsername = (str) => {
            return /^[a-zA-Z_\s]+$/.test(str);
        };

        // Act based on validity
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
                        value={username}
                        submitBehavior="blurAndSubmit"
                        onChangeText={(text) => changeUsername(text)}
                        onSubmitEditing={(e) => handleUsernameSubmit(e.nativeEvent.text)}></TextInput>
                </KeyboardAvoidingView>
                {/* Edit-Username Error Dialog */}
                <InfoDialog title="Invalid Username" info="A username may only contain a-z, A-Z, '_', and spaces. " isError={true} visible={usernameError} onConfirm={() => showUsernameError(false)} />
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
                            <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                                {/* Format the data label with spaces between Pascal case words */}
                                <Text variant="bodyLarge">{item[0].replace(/([a-z])([A-Z])/g, '$1 $2')}:</Text>
                                <Text variant="bodyLarge">{" " + item[1]}</Text>
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

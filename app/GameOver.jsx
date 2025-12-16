import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import Wrapper from '@components/menu/Wrapper';
import Constants from 'expo-constants';

const { API_SERVER_URL } = Constants.expoConfig.extra;

const { width, height } = Dimensions.get('window');

export default function GameOver() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedScore = await AsyncStorage.getItem('Score');
                const storedHighScore = await AsyncStorage.getItem('HighScore');
                const storedDuration = await AsyncStorage.getItem('Duration');
                const uuid = await AsyncStorage.getItem('UUID');

                if (storedScore) setScore(parseInt(storedScore, 10));
                if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));
                if (storedDuration) setDuration(parseInt(storedDuration, 10));

                if (uuid && storedScore && storedDuration) {
                    saveGameData(uuid, storedScore, storedDuration);
                }
            } catch (error) {
                console.error('Failed to load game data', error);
            }
        };

        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        };

        loadData();
        lockOrientation();
    }, []);

    const formatDuration = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const saveGameData = async (uuid, score, duration) => {
        try {
            console.log(`Saving game data to ${API_SERVER_URL}/player/${uuid}/save-game`);
            await fetch(`${API_SERVER_URL}/player/${uuid}/save-game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score: parseInt(score),
                    duration: parseInt(duration),
                }),
            });
        } catch (error) {
            console.error('Failed to save game data to server', error);
        }
    };

    return (
        <ImageBackground source={require('../assets/backgrounds/used/Main_Background.jpg')} style={styles.background} resizeMode="cover">
            <Wrapper onClose={() => router.dismissAll()} style={styles.container}>
                <View style={styles.content}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="displayMedium" style={styles.title}>
                                Mission Failed
                            </Text>

                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text variant="bodyMedium" style={styles.label}>
                                        Score
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.value}>
                                        {score}
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text variant="bodyMedium" style={styles.label}>
                                        High Score
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.value}>
                                        {highScore}
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text variant="bodyMedium" style={styles.label}>
                                        Time Survived
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.value}>
                                        {formatDuration(duration)}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={() => router.replace('/GameScreen')} style={styles.button} icon="restart">
                            Try Again
                        </Button>
                        <Button mode="contained" onPress={() => router.dismissAll()} style={styles.button} buttonColor="#555" icon="home">
                            Main Menu
                        </Button>
                    </View>
                </View>
            </Wrapper>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        //flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)', // Overlay effect
    },
    content: {
        width: '60%', // Adjust for landscape
        maxWidth: 600,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        elevation: 5,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#D32F2F', // Red for game over

    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        padding: 10,
    },
    statItem: {
        alignItems: 'center',
        margin: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 5,
    }
});

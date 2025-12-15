// app/game.jsx (or your game screen file)
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, StatusBar, ImageBackground, useWindowDimensions, View } from 'react-native';
import { GameLoop } from 'react-native-game-engine';
import { router } from 'expo-router';
import { useLevel } from '@components/LevelContext';
import { useGameLoop } from '@hooks/useGameLoop';
import { useData } from '@components/DataContext';
import GameCanvas from '@components/game/GameCanvas';
import GameHUD from '@components/game/GameHUD';
import PauseMenu from '@components/game/PauseMenu';

export default function GameScreen() {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    // Calculate target dimensions for 16:9 aspect ratio
    // Calculate target dimensions for 16:10 aspect ratio
    const LOGICAL_WIDTH = 1280;
    const LOGICAL_HEIGHT = 800;
    const targetRatio = LOGICAL_WIDTH / LOGICAL_HEIGHT;
    let gameWidth, gameHeight;

    if (windowWidth / windowHeight > targetRatio) {
        // Window is wider than 16:10 (pillarbox)
        gameHeight = windowHeight;
        gameWidth = windowHeight * targetRatio;
    } else {
        // Window is taller than 16:10 (letterbox)
        gameWidth = windowWidth;
        gameHeight = windowWidth / targetRatio;
    }

    // Determine the scale factor to fit the logical resolution into the gameWidth/Height
    // Since gameWidth/gameHeight maintains the ratio, we can use either dimension
    const scale = gameWidth / LOGICAL_WIDTH;

    const offsetX = (windowWidth - gameWidth) / 2;
    const offsetY = (windowHeight - gameHeight) / 2;

    return (
        <View style={styles.excludeContainer}>
            <View style={[styles.gameContainer, { width: gameWidth, height: gameHeight }]}>
                {/* Scale the game session to fit the container while maintaining logical resolution */}
                <View style={{ width: LOGICAL_WIDTH, height: LOGICAL_HEIGHT, transform: [{ scale }], transformOrigin: 'top left' }}>
                    <GameSession
                        key={`${gameWidth}-${gameHeight}`} // Remount on resize
                        width={LOGICAL_WIDTH}
                        height={LOGICAL_HEIGHT}
                        scale={scale} // Pass scale for input handling
                        offsetX={offsetX}
                        offsetY={offsetY}
                    />
                </View>
            </View>
        </View>
    );
}

function GameSession({ width, height, scale, offsetX, offsetY }) {
    const [loaded, setLoaded] = useState(false); // Use this to start the game after loading
    const gameEnded = useRef(false); // Prevent multiple game over triggers
    const { level } = useLevel();

    const {
        getItem, // Pull from memory
        setItem, // Alter storage
        saveItems, // Save to storage
    } = useData(); // DataContext operations

    const { gameState, player, handleTouch, updateGame, togglePause, getGameDuration, isGameOver } = useGameLoop({
        width,
        height,
        scale,
        offsetX,
        offsetY,
        spawnPoints: level.current.getEnemySpawn(),
        enemyPaths: level.current.getEnemyPaths(),
        playerSpawn: level.current.getPlayerSpawn(),
    }); // Custom game-loop operations

    /**
     * Save the gamedata to the app storage
     */
    const saveGamedata = async () => {
        const duration = getGameDuration();
        const score = player.getScore();

        // Save the game data to the app storage
        setItem('Score', score, true);
        setItem('Duration', duration, true);

        // Update TotalTimePlayed
        let totalTimePlayed = parseInt(getItem('TotalTimePlayed'));
        setItem('TotalTimePlayed', duration + totalTimePlayed);

        // Update HighScore, if qualifies
        let highScore = parseInt(getItem('HighScore'));
        if (score > highScore) {
            setItem('HighScore', score);
        }

        // Update LongestGame, if qualifies
        let longestGame = parseInt(getItem('LongestGame'));
        if (duration > longestGame) {
            setItem('LongestGame', duration);
        }

        // Wait for the storage to sync
        await saveItems('Score', 'HighScore', 'Duration', 'TotalTimePlayed', 'LongestGame').catch((err) => console.error('Failed to save game: ', err));
    };

    // Execute on initial render
    useEffect(() => {
        // Tell the GameLoop to start running
        setLoaded(true);
    }, []);

    // Execute when the game ends
    useEffect(() => {
        if (isGameOver && !gameEnded.current) {
            gameEnded.current = true;
            saveGamedata().then(() => router.replace('/GameOver'));
        }
    }, [isGameOver, player.getScore(), getGameDuration]);

    // Run when the user exists the game early
    const handleQuit = async () => {
        try {
            // Save data, then head back to the previous screen
            saveGamedata().then(() => router.back());
        } catch (error) {
            console.error('Failed to save on quit:', error);
            router.back();
        }
    };

    const onUpdate = ({ touches }) => {
        handleTouch(touches);
        updateGame();
    };

    return (
        <GameLoop style={styles.container} onUpdate={onUpdate} running={loaded}>
            <ImageBackground source={level.current.getImage()} style={[styles.backgroundImage, styles.imageFullDisplay]} />

            <StatusBar hidden />

            <GameCanvas player={player} projectiles={gameState.projectiles} enemies={gameState.enemies} />

            <GameHUD score={player.getScore()} hp={player.getHp()} duration={getGameDuration()} paused={gameState.paused} onPausePress={togglePause} />

            <PauseMenu visible={gameState.paused} onResume={togglePause} onQuit={handleQuit} />
        </GameLoop>
    );
}

const styles = StyleSheet.create({
    excludeContainer: {
        flex: 1,
        backgroundColor: '#000', // Black bars
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameContainer: {
        overflow: 'hidden', // Clip content outside the game area
        position: 'relative',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    imageFullDisplay: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ensure image covers the 16:9 area
        position: 'absolute',
    },
});
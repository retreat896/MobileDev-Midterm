// app/game.jsx (or your game screen file)
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, StatusBar, ImageBackground, useWindowDimensions } from 'react-native';
import { GameLoop } from 'react-native-game-engine';
import { router } from 'expo-router';
import { useLevel } from '@components/LevelContext';
import { useGameLoop } from '@hooks/useGameLoop';
import { useData } from '@components/DataContext';
import GameCanvas from '@components/game/GameCanvas';
import GameHUD from '@components/game/GameHUD';
import PauseMenu from '@components/game/PauseMenu';

export default function GameScreen() {
	const { width, height } = useWindowDimensions();

	// Remount the game session whenever the dimensions change to ensure correct initialization
	return (
		<GameSession
			key={`${width}-${height}`}
			width={width}
			height={height}
		/>
	);
}

function GameSession({ width, height }) {
	const [loaded, setLoaded] = useState(false); // Use this to start the game after loading
	const gameEnded = useRef(false); // Prevent multiple game over triggers
	const { level } = useLevel();

	const { 
		getItem, 	// Pull from memory
		setItem, 	// Alter storage
		saveItems 	// Save to storage
	} = useData(); // DataContext operations
	
	const {
		gameState,
		player,
		handleTouch,
		updateGame,
		togglePause,
		getGameDuration,
		isGameOver,
	} = useGameLoop({ width, height }); // Custom game-loop operations

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
		await saveItems('Score', 'HighScore', 'Duration', 'TotalTimePlayed', 'LongestGame')
			.catch(err => console.error('Failed to save game: ', err));
	}

	// Execute on initial render
	useEffect(() => {
		// Tell the GameLoop to start running
		setLoaded(true);
	}, [])

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
			<ImageBackground
				source={level.current.getImage()}
				style={[styles.backgroundImage, styles.imageFullDisplay]}
			/>

			<StatusBar hidden />

			<GameCanvas
				player={player}
				projectiles={gameState.projectiles}
				enemies={gameState.enemies}
			/>

			<GameHUD
				score={player.getScore()}
				hp={player.getHp()}
				duration={getGameDuration()}
				paused={gameState.paused}
				onPausePress={togglePause}
			/>

			<PauseMenu
				visible={gameState.paused}
				onResume={togglePause}
				onQuit={handleQuit}
			/>
		</GameLoop>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF',
	},
	imageFullDisplay: {
		width: "100%",
		height: "100%",
		alignSelf: 'center',
		justifyContent: 'center',
		position: 'absolute',
	},
});
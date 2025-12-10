import Projectile from '@modules/game/Projectile';
import Enemy from '@modules/game/Enemy';
import Player from '@modules/game/Player';
import React, { Component, useState } from 'react';
import { StyleSheet, Dimensions, StatusBar, View, ImageBackground, useWindowDimensions, Image } from 'react-native';
import { Button, Dialog, FAB, Portal, Text } from 'react-native-paper';
import { GameLoop } from 'react-native-game-engine';
import * as ScreenOrientation from 'expo-screen-orientation';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wrapper from '@components/menu/Wrapper';
import { useLevel } from '@components/LevelContext';
import Level from '@modules/menu/Level';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const guy = require("../assets/guy.png");
const bad_guy = require("../assets/bad_guy.png")

const RADIUS = 20; //used for finger radius
const PLAYER_SIZE = 50;
const PLAYER_START_HP = 10;

// Player
const PLAYER = new Player(PLAYER_START_HP, SCREEN_WIDTH, SCREEN_HEIGHT, PLAYER_SIZE);

// see chat gpt for what i implemented. https://chatgpt.com/share/68fda8d9-4bec-800b-a86d-11ed95a51191
class SingleTouch extends Component {
    constructor() {
        super();
        this.state = {
            touchX: SCREEN_WIDTH / 2,
            touchY: SCREEN_HEIGHT / 2,
            projectiles: [],
            enemies: [],
            score: 0,
            paused: false,
        };
        this.gameOver = false;
    }

    async componentDidMount() {
        PLAYER.reset();
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        
        // Set Player Spawn
        const level = this.props.level.current;
        let startX = 0;
        let startY = 0;

        if (level && level.getPlayerSpawn()) {
            const spawn = level.getPlayerSpawn();
            PLAYER.setPos(spawn.x, spawn.y);
        }

        // Example: Set offsets (Adjust these values to center the image and align the gun)
        //PLAYER.setImageOffset(10, 0); 
        PLAYER.setBulletOffset(30, 10);

        if (level && level.getEnemySpawn()) {
            const spawn = level.getEnemySpawn();
            startX = spawn.x;
            startY = spawn.y;
        } else {
            // Default if no spawn point
            startY = Math.random() * (SCREEN_HEIGHT - 100);
        }

        // Generate the single path for this level
        this.currentLevelPath = this.generateComplexPath(startX, startY, 5);

        this.startEnemySpawning();
        this.startTime = Date.now();
    }

    componentWillUnmount() {
        this.stopEnemySpawning();
    }

    startEnemySpawning = () => {
        this.enemySpawnActive = true;
        this.scheduleNextEnemy();
    };

    scheduleNextEnemy = () => {
        if (!this.enemySpawnActive) return;
        const randomDelay = Math.random() * 2000 + 1000;

        this.enemySpawnTimeout = setTimeout(() => {
            this.spawnEnemy();
            this.scheduleNextEnemy();
        }, randomDelay);
    };

    stopEnemySpawning = () => {
        this.enemySpawnActive = false;
        if (this.enemySpawnTimeout) clearTimeout(this.enemySpawnTimeout);
    };

    generateComplexPath = (startX, startY, turns) => {
        let path = [{x: startX, y: startY}];
        let currentX = startX;
        let currentY = startY;
        const segmentWidth = SCREEN_WIDTH / (turns + 1);

        for (let i = 0; i < turns; i++) {
            // Move forward
            currentX += segmentWidth;
            // Random Y within bounds (padding 50)
            currentY = Math.random() * (SCREEN_HEIGHT - 100) + 50;
            path.push({x: currentX, y: currentY});
        }
        
        // Final point off screen
        path.push({x: SCREEN_WIDTH + 100, y: currentY});
        return path;
    }

    spawnEnemy = () => {
        let enemy = new Enemy();
        
        // Use the pre-generated path
        if (this.currentLevelPath) {
            enemy.setPath(this.currentLevelPath);
            enemy.x = this.currentLevelPath[0].x;
            enemy.y = this.currentLevelPath[0].y;
        } else {
             // Fallback if something went wrong
            const randomY = Math.random() * (SCREEN_HEIGHT - enemy.height * 2);
            enemy.setYPos(randomY);
        }

        this.setState((prev) => ({
            enemies: [...prev.enemies, enemy],
        }));
    };

    fireProjectile = () => {
        const { x: px, y: py } = PLAYER.getPos();
        const { x: ox, y: oy } = PLAYER.getBulletOffset();
        const rot = PLAYER.getRotation();
        const rad = rot * (Math.PI / 180);

        // Rotate offset
        const rotatedOx = ox * Math.cos(rad) - oy * Math.sin(rad);
        const rotatedOy = ox * Math.sin(rad) + oy * Math.cos(rad);

        const spawnX = px + rotatedOx;
        const spawnY = py + rotatedOy;

        const projectile = new Projectile(spawnX, spawnY, rot, 15);
        this.setState((prev) => ({
            projectiles: [...prev.projectiles, projectile],
        }));
    };

    setLocalStorage = async () => {
        try {
            const duration = Date.now() - this.startTime;

            // Parse stored values or default to 0
            const highScoreStr = await AsyncStorage.getItem('HighScore');
            const totalDurationStr = await AsyncStorage.getItem('TotalDuration');

            const highScore = parseInt(highScoreStr || '0', 10);
            const totalDuration = parseInt(totalDurationStr || '0', 10);

            // Save new high score if needed
            if (this.state.score > highScore) {
                await AsyncStorage.setItem('HighScore', this.state.score.toString());
            }

            // Always update current session score and duration
            await AsyncStorage.setItem('Score', this.state.score.toString());
            await AsyncStorage.setItem('Duration', duration.toString());

            // Update total playtime safely
            const newTotal = duration + totalDuration;
            await AsyncStorage.setItem('TotalDuration', newTotal.toString());

            console.log('Game data saved to storage.');
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    };

    formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    onUpdate = ({ touches }) => {
        if (this.state.paused === true) {
            if (this.enemySpawnActive) {
                this.stopEnemySpawning();
                clearInterval(this.fireInterval);
            }

            return;
        } else if (!this.state.paused && !this.enemySpawnActive) {
            this.startEnemySpawning();
        } else {
        }

        if (PLAYER.getHP() <= 0) {
            if (this.gameOver) return;
            this.gameOver = true;
            
            const duration = Date.now() - this.startTime;
            AsyncStorage.setItem('Score', this.state.score.toString());
            AsyncStorage.setItem('Duration', duration.toString());
            router.replace('/GameOver');
        }

        //-----------projectiles-----------
        let start = touches.find((t) => t.type === 'start'); //player toutches the screen
        let end = touches.find((t) => t.type === 'end'); //player lifts thier finger off the screen
        let press = touches.find((t) => t.type === 'press'); // player taps the screen quickly
        let longPress = touches.find((t) => t.type === 'long-press'); //player holds the screen without moving for a time
        let move = touches.find((t) => t.type === 'move'); //player is dragging thier finger on the screen

        if (start) {
            this.fireInterval = setInterval(() => this.fireProjectile(), 100);
        }

        if (press) {
            this.fireProjectile();
        }

        if (end) {
            clearInterval(this.fireInterval);
        }

        let touch = touches.find((x) => x.type === 'start' || x.type === 'move');
        if (touch) {
            const touchX = touch.event.pageX;
            const touchY = touch.event.pageY;
            const dx = touchX - PLAYER.getPos().x;
            const dy = touchY - PLAYER.getPos().y;
            const angleRadians = Math.atan2(dy, dx);
            const angle = angleRadians * (180 / Math.PI);

            PLAYER.setRotation(angle);

            this.setState({
                touchX,
                touchY,
            });
        }

        this.setState((prev) => {
            let addScore = 0;
            // ---- Update projectiles ----
            const projectiles = prev.projectiles.map((p) => {
                p.update();
                return p;
            });

            // ---- Update enemies & handle collisions ----
            const enemies = prev.enemies.map((e) => {
                e.update();

                projectiles
                    .filter((p) => p.active)
                    .forEach((p) => {
                        if (e.collidesWith(p)) {
                            e.hp -= p.damage;
                            p.remove();
                            addScore = e.points;
                        }
                    });

                return e;
            });

            // ---- Filter out dead or inactive entities ----
            // ---- Filter out dead or inactive entities ----
            const activeProjectiles = projectiles.filter((p) => p.active && !p.isOutOfBounds(SCREEN_WIDTH, SCREEN_HEIGHT));
            
            // Check for out of bounds enemies and apply damage BEFORE filtering them out
            enemies.forEach((e) => {
                if (e.isOutOfBounds(SCREEN_WIDTH, SCREEN_HEIGHT)) {
                    PLAYER.enemyOutOfBounds(e);
                }
            });

            const activeEnemies = enemies.filter((e) => e.active && e.hp > 0 && !e.isOutOfBounds(SCREEN_WIDTH, SCREEN_HEIGHT));

            // ---- Return new state ----
            return {
                projectiles: activeProjectiles,
                enemies: activeEnemies,
                score: prev.score + addScore,
            };
        });
    };

    render() {
        const level = this.props.level.current;

        return (
            <GameLoop style={styles.container} onUpdate={this.onUpdate}>
                {/* Display the Level Background */}
                <ImageBackground source={level.getImage()} style={[
                    styles.backgroundImage,
                    styles.imageFullDisplay
                ]}/>
                <StatusBar hidden={true} />
                <FAB icon={this.state.paused ? 'close' : 'pause'} style={styles.pause} onPress={() => this.setState({ paused: !this.state.paused })} />
                {this.state.paused ? (
                    <Portal>
                        <Wrapper
                            style={styles.pauseMenu}
                            title="Paused"
                            onClose={() => {
                                this.setState({ paused: false });
                            }}
                            onOpen={() => {
                                console.log('Paused');
                            }}>
                            <Button
                                mode="outlined"
                                icon="door-open"
                                style={styles.pauseButton}
                                labelStyle={styles.pauseText}
                                onPress={async () => {
                                    await this.setLocalStorage();
                                    router.back();
                                }}>
                                Quit
                            </Button>
                        </Wrapper>
                    </Portal>
                ) : null}

                {/* Score */}
                <Text style={styles.score}>Score: {this.state.score}</Text>

                {/* Player HP */}
                <Text style={styles.playerHP}>HP: {PLAYER.getHP()}</Text>

                {/* Duration */}
                <Text style={styles.duration}>Playtime: {this.formatDuration(Date.now() - this.startTime)}</Text>

                {/* Touch - DEBUG ONLY*/}
                {/* <View
                    style={[
                        styles.finger,
                        {
                            left: this.state.touchX - RADIUS,
                            top: this.state.touchY - RADIUS,
                        },
                    ]}
                /> */}

                {/* Player */}
                <Image
                    style={[
                        styles.player,
                        {
                            width: PLAYER.getWidth().width*2,
                            height: PLAYER.getHeight().height,

                            // Center the player at its fixed position (playerX, playerY)
                            // Width is size*2 (100), so shift left by size (50) to center
                            left: PLAYER.getPos().x - PLAYER.getSize(), 
                            top: PLAYER.getPos().y - PLAYER.getSize() / 2,

                            // Apply rotation and offsets
                            transform: [
                                { rotate: `${PLAYER.getRotation()}deg` },
                                { translateX: PLAYER.getImageOffset().x },
                                { translateY: PLAYER.getImageOffset().y }
                            ],
                        },
                        // PLAYER.getColor(),
                    ]}
                    source={guy}
                    resizeMode='contain'
                />

                {/* Player Center Dot (Red) */}
                <View style={{
                    position: 'absolute',
                    left: PLAYER.getPos().x - 2,
                    top: PLAYER.getPos().y - 2,
                    width: 4,
                    height: 4,
                    backgroundColor: 'red',
                    zIndex: 101,
                    borderRadius: 2
                }} />

                {/* Player Rotation Indicator (Blue) */}
                <View style={{
                    position: 'absolute',
                    left: PLAYER.getPos().x + (Math.cos(PLAYER.getRotation() * (Math.PI / 180)) * 40) - 3,
                    top: PLAYER.getPos().y + (Math.sin(PLAYER.getRotation() * (Math.PI / 180)) * 40) - 3,
                    width: 6,
                    height: 6,
                    backgroundColor: 'blue',
                    zIndex: 100,
                    borderRadius: 3
                }} />

                {/* Projectile */}
                {this.state.projectiles.map((p, i) => (
                    <View
                        key={i}
                        style={[
                            styles.projectile,
                            {
                                left: p.x - 5,
                                top: p.y - 5,
                            },
                        ]}
                    >
                        <View style={{
                            position: 'absolute',
                            left: 3,
                            top: 3,
                            width: 4,
                            height: 4,
                            backgroundColor: 'red',
                            borderRadius: 2
                        }}/>
                    </View>
                ))}

                {/* Enemy */}
                {this.state.enemies.map((e, i) => (
                    <Image
                        key={i}
                        style={[
                            styles.enemy,
                            {
                                left: e.x,
                                top: e.y,
                                width: e.width,
                                height: e.height,
                                transform: [{ rotate: `${e.getRotation()}deg` }]
                            },
                            // e.getColor(),
                        ]}
                        source={bad_guy}
                    />
                ))}
            </GameLoop>
        );
    }
}

export default function GameScreen() {
    const { level } = useLevel();

    console.log("Level is Class Object: " + (level.current instanceof Level));

    return <SingleTouch level={level} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    backgroundImage: {
        position: 'absolute',
    },
    imageFullDisplay: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    finger: {
        borderColor: '#CCC',
        borderWidth: 4,
        borderRadius: RADIUS * 2,
        width: RADIUS * 2,
        height: RADIUS * 2,
        backgroundColor: 'pink',
        position: 'absolute',
    },
    player: {
    },
    projectile: {
        width: 10,
        height: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        position: 'absolute',
    },
    enemy: {
        position: 'absolute',
    },
    score: {
        fontSize: 20,
        position: 'absolute',
        top: 30,
        left: 10,
        borderRadius: 10,
    },
    playerHP: {
        fontSize: 20,
        position: 'absolute',
        top: 10,
        left: 10,
        borderRadius: 10,
    },
    duration: {
        fontSize: 20,
        position: 'absolute',
        top: 50,
        left: 10,
        borderRadius: 10,
    },
    pause: {
        position: 'absolute',
        right: 0,
        borderRadius: 100,
        margin: 10,
    },
    pauseMenu: {
        height: '100%',
    },
    pauseButton: {
        alignSelf: 'center',
        width: '45%',
    },
    pauseText: {
        fontSize: 28,
    },
});

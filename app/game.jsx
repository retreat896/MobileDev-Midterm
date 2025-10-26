import Projectile from '@modules/game/projectile';
import Enemy from '@modules/game/enemy';
import Player from '@modules/game/player';
import React, { Component, useState } from 'react';
import { StyleSheet, Dimensions, StatusBar, View, useWindowDimensions } from 'react-native';
import { Button, Dialog, FAB, Portal, Text } from 'react-native-paper';
import { GameLoop } from 'react-native-game-engine';
import * as ScreenOrientation from 'expo-screen-orientation';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wrapper from '@components/menu/Wrapper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const RADIUS = 20; //used for finger radius
const PLAYER_SIZE = 50;
const PLAYER_START_HP = 100;

// Player
const PLAYER = new Player(PLAYER_START_HP, SCREEN_WIDTH, SCREEN_HEIGHT, PLAYER_SIZE);

// see chat gpt for what i implemented. https://chatgpt.com/share/68fda8d9-4bec-800b-a86d-11ed95a51191
export default class SingleTouch extends Component {
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
    }

    async componentDidMount() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
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

    spawnEnemy = () => {
        let enemy = new Enemy();
        const randomY = Math.random() * (SCREEN_HEIGHT - enemy.height * 2);
        enemy.setYPos(randomY);
        this.setState((prev) => ({
            enemies: [...prev.enemies, enemy],
        }));
    };

    fireProjectile = () => {
        const projectile = new Projectile(PLAYER.getPos().x, PLAYER.getPos().y, PLAYER.getRotation(), 15);
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
            AsyncStorage.setItem('Score', this.state.score);
            AsyncStorage.setItem('Duration', this.duration);
            router.navigate('/gameOver');
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
            const activeProjectiles = projectiles.filter((p) => p.active && !p.isOutOfBounds(SCREEN_WIDTH, SCREEN_HEIGHT));
            const activeEnemies = enemies.filter((e) => e.active && e.hp > 0 && !e.isOutOfBounds(SCREEN_WIDTH, SCREEN_HEIGHT));

            activeEnemies.forEach((e) => {
                PLAYER.enemyOutOfBounds(e);
            });

            // ---- Return new state ----
            return {
                projectiles: activeProjectiles,
                enemies: activeEnemies,
                score: prev.score + addScore,
            };
        });
    };

    render() {
        return (
            <GameLoop style={styles.container} onUpdate={this.onUpdate}>
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
                <View
                    style={[
                        styles.player,
                        {
                            width: PLAYER.getSize(),
                            height: PLAYER.getSize(),

                            // Center the player at its fixed position (playerX, playerY)
                            left: PLAYER.getPos().x - PLAYER.getSize() / 2,
                            top: PLAYER.getPos().y - PLAYER.getSize() / 2,

                            // Apply rotation
                            transform: [{ rotate: `${PLAYER.getRotation()}deg` }],
                        },
                        PLAYER.getColor(),
                    ]}
                />

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
                    />
                ))}

                {/* Enemy */}
                {this.state.enemies.map((e, i) => (
                    <View
                        key={i}
                        style={[
                            styles.enemy,
                            {
                                left: e.x,
                                top: e.y,
                                width: e.width,
                                height: e.height,
                            },
                            e.getColor(),
                        ]}
                    />
                ))}
            </GameLoop>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
        borderColor: '#CCC',
        borderWidth: 4,
        backgroundColor: 'pink',
    },
    projectile: {
        width: 10,
        height: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        position: 'absolute',
    },
    enemy: {
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 10,
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

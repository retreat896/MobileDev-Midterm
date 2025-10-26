import Projectile from '@modules/game/objects/projectile';
import Enemy from '@modules/game/objects/enemy';
import Player from '@modules/game/objects/player';
import React, { Component } from 'react';
import { StyleSheet, Dimensions, StatusBar, View, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { GameLoop } from 'react-native-game-engine';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');

const RADIUS = 20; 

// Player position constants
const PLAYER = new Player(100, WIDTH, HEIGHT, 50);

// see chat gpt for what i implemented. https://chatgpt.com/share/68fda8d9-4bec-800b-a86d-11ed95a51191
export default class SingleTouch extends Component {
    constructor() {
        super();
        this.state = {
            touchX: WIDTH / 2,
            touchY: HEIGHT / 2,

            angle: 0,
            projectiles: [],
            enemies: [],
            score: 0,
        };
    }

    componentDidMount() {
        this.startEnemySpawning();
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
        const randomY = Math.random() * (HEIGHT - enemy.height * 2);
        enemy.setYPos(randomY);
        this.setState((prev) => ({
            enemies: [...prev.enemies, enemy],
        }));
    };

    fireProjectile = () => {
        const { angle } = this.state;
        const projectile = new Projectile(PLAYER.getPos().x, PLAYER.getPos().y, angle, 15);
        this.setState((prev) => ({
            projectiles: [...prev.projectiles, projectile],
        }));
    };

    onUpdate = ({ touches }) => {
        if (touches.length > 0) console.log(touches);
        //-----------projectiles-----------
        let start = touches.find((t) => t.type === 'start'); //player toutches the screen
        let end = touches.find((t) => t.type === 'end'); //player lifts thier finger off the screen
        let press = touches.find((t) => t.type === 'press'); // player taps the screen quickly
        let longPress = touches.find((t) => t.type === 'long-press'); //player holds the screen without moving for a time
        let move = touches.find((t) => t.type === 'move');

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

            this.setState({
                touchX,
                touchY,
                angle,
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
            const activeProjectiles = projectiles.filter((p) => p.active && !p.isOutOfBounds(WIDTH, HEIGHT));
            const activeEnemies = enemies.filter((e) => e.active && e.hp > 0 && !e.isOutOfBounds(WIDTH, HEIGHT));

            activeEnemies.forEach((e)=>{
                PLAYER.enemyOutOfBounds(e);
            })

            // ---- Return new state ----
            return {
                projectiles: activeProjectiles,
                enemies: activeEnemies,
                score: prev.score + addScore,
            };
        });
    };

    render() {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        return (
            <GameLoop style={styles.container} onUpdate={this.onUpdate}>
                <StatusBar hidden={true} />

                {/* Score */}
                <Text style={styles.score}>Score: {this.state.score}</Text>

                {/* Player HP */}
                <Text style={styles.playerHP}>HP: {PLAYER.getHP()}</Text>

                {/* Touch */}
                <View
                    style={[
                        styles.finger,
                        {
                            left: this.state.touchX - RADIUS,
                            top: this.state.touchY - RADIUS,
                        },
                    ]}
                />

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
                            transform: [{ rotate: `${this.state.angle}deg` }],
                        },
                        PLAYER.getColor()
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
        top: 10,
        right: 10,
        borderRadius: 10,
    },
    playerHP:{
        fontSize: 20,
        position: 'absolute',
        top: 10,
        left: 10,
        borderRadius: 10,
    },
});

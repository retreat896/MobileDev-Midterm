import React, { Component } from 'react';
import { StyleSheet, Dimensions, StatusBar, View } from 'react-native';
import { GameLoop } from 'react-native-game-engine';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const RADIUS = 20;

export default class SingleTouch extends Component {
    constructor() {
        super();
        this.state = {
            playerX: WIDTH - 100,
            playerY: HEIGHT / 2,

            touchX: WIDTH / 2,
            touchY: HEIGHT / 2,

            angle: 0,
        };
    }

    onUpdate = ({ touches }) => {
        let touch = touches.find((x) => x.type === 'start' || x.type === 'move');

        if (touch) {
            const touchX = touch.event.pageX;
            const touchY = touch.event.pageY;

            // Calculate the difference between touch and player
            const dx = touchX - this.state.playerX;
            const dy = touchY - this.state.playerY;

            // Get the angle in radians
            const angleRadians = Math.atan2(dy, dx);

            // Convert radians to degrees
            
            const angleDegrees = angleRadians * (180 / Math.PI);

            this.setState({
                touchX: touchX,
                touchY: touchY,
                angle: angleDegrees,
            });
        }
    };

    render() {
        const PLAYER_SIZE = 50;
        return (
            <GameLoop style={styles.container} onUpdate={this.onUpdate}>
                <StatusBar hidden={true} />

                <View
                    style={[
                        styles.finger,
                        {
                            left: this.state.touchX - RADIUS,
                            top: this.state.touchY - RADIUS,
                        },
                    ]}
                />

                <View
                    style={[
                        styles.player,
                        {
                            width: PLAYER_SIZE,
                            height: PLAYER_SIZE,
                            
                            // Center the player at its fixed position (playerX, playerY)
                            left: this.state.playerX - PLAYER_SIZE / 2,
                            top: this.state.playerY - PLAYER_SIZE / 2,

                            // Apply rotation
                            transform: [{ rotate: `${this.state.angle}deg` }],
                        },
                    ]}
                />

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
});

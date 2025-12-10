import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const SplashScreen = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            // Fade In
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            // Hold
            Animated.delay(2000),
            // Fade Out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onFinish) {
                onFinish();
            }
        });
    }, [fadeAnim, onFinish]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Image
                    source={require('../assets/uwp.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Ensure it sits on top
    },
    logo: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;

import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { LevelProvider } from '@components/LevelContext';
import { DataProvider } from '@components/DataContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import SplashScreen from '@components/SplashScreen';

export default function RootLayout() {
    const [isSplashVisible, setIsSplashVisible] = useState(true);
    const appFadeAnim = useRef(new Animated.Value(0)).current;

    useFonts({
        Honk: require('@assets/fonts/Honk_400Regular.ttf'),
    });
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    const onSplashFinish = () => {
        setIsSplashVisible(false);
        Animated.timing(appFadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {isSplashVisible && <SplashScreen onFinish={onSplashFinish} />}
            <Animated.View style={{ flex: 1, opacity: appFadeAnim }}>
                <PaperProvider>
                    <LevelProvider>
                        <DataProvider>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    detachPreviousScreen: true,
                                    unmountOnBlur: true,
                                }}></Stack>
                        </DataProvider>
                    </LevelProvider>
                </PaperProvider>
            </Animated.View>
        </View>
    );
}
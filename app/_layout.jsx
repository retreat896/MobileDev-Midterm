import { PaperProvider, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { LevelProvider } from '@components/LevelContext';
import { DataProvider } from '@components/DataContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import SplashScreen from '@components/SplashScreen';

export default function RootLayout() {
    const [isSplashVisible, setIsSplashVisible] = useState(true);
    const appFadeAnim = useRef(new Animated.Value(0)).current;

    const { DarkTheme } = adaptNavigationTheme({
        reactNavigationLight: NavigationDarkTheme,
        reactNavigationDark: NavigationDarkTheme,
    });

    const CombinedDarkTheme = {
        ...MD3DarkTheme,
        colors: {
            ...MD3DarkTheme.colors,
            ...DarkTheme.colors,
        },
    };

    const [fontsLoaded, fontError] = useFonts({
        Honk: require('@assets/fonts/Honk_400Regular.ttf'),
    });
    const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    const onSplashFinish = () => {
        setSplashAnimationFinished(true);
    };

    useEffect(() => {
        if (splashAnimationFinished && (fontsLoaded || fontError)) {
            // Configure immersive mode
            NavigationBar.setVisibilityAsync('hidden');
            NavigationBar.setBehaviorAsync('overlay-swipe');

            // Hide splash screen
            setIsSplashVisible(false);
            Animated.timing(appFadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [splashAnimationFinished, fontsLoaded, fontError]);

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {isSplashVisible && <SplashScreen onFinish={onSplashFinish} />}
            <Animated.View style={{ flex: 1, opacity: appFadeAnim }}>
                <PaperProvider theme={CombinedDarkTheme}>
                    <LevelProvider>
                        <DataProvider>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    detachPreviousScreen: true,
                                    unmountOnBlur: true,
                                }}
                            />
                        </DataProvider>
                    </LevelProvider>
                </PaperProvider>
            </Animated.View>
        </View>
    );
}

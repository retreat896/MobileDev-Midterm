// app/_layout.tsx
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { LevelProvider } from '@components/LevelContext';
import { DataProvider } from '@components/DataContext';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function RootLayout() {
    useFonts({
        Honk: require('@assets/fonts/Honk_400Regular.ttf'),
    });
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    return (
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
    );
}

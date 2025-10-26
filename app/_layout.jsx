// app/_layout.tsx
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { LevelProvider } from '@components/LevelContext';

export default function RootLayout() {
   useFonts({
          Honk: require('@assets/fonts/Honk_400Regular.ttf'),
      });
  
    return (
        <PaperProvider>
            <LevelProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        detachPreviousScreen: true,
                        unmountOnBlur: true,
                    }}></Stack>
            </LevelProvider>
        </PaperProvider>
    );
}

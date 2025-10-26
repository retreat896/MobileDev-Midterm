// app/_layout.tsx
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

export default function RootLayout() {
   useFonts({
          Honk: require('@assets/fonts/Honk_400Regular.ttf'),
      });
  
    return (
        <PaperProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    detachPreviousScreen: true,
                    unmountOnBlur: true,
                }}></Stack>
        </PaperProvider>
    );
}

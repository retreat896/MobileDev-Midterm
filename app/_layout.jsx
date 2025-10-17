// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        detachPreviousScreen: true, 
        unmountOnBlur: true
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="geometry" />
      <Stack.Screen name="gravity" />
      <Stack.Screen name="custom" />
    </Stack>
  );
}

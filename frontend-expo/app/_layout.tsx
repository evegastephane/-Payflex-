import { Stack } from 'expo-router';
import { Text } from 'react-native';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(pin)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
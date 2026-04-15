import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Retour' }}>
            <Stack.Screen name="sign-in" options={{ title: 'Connexion' }} />
            <Stack.Screen name="sign-up" options={{ title: 'Inscription' }} />
            <Stack.Screen name="create-pin" options={{ title: 'Créer votre PIN' }} />
        </Stack>
    );
}
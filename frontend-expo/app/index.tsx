import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Index() {
    useEffect(() => {
        // Simule une vérification d'authentification
        const checkAuth = async () => {
            // Ici on pourrait vérifier si l'utilisateur est connecté
            // Pour l'exemple, on redirige directement vers l'auth
            setTimeout(() => {
                router.replace('/');
            }, 1000);
        };

        checkAuth();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text>Chargement de l'application...</Text>
        </View>
    );
}
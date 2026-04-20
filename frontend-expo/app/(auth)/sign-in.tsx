import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function SignIn() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Écran de Connexion</Text>
            <Text style={styles.message}>Page d'authentification - Saisie email/mot de passe</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Se connecter"
                    onPress={() => router.replace('/(tabs)/wallet')}
                />
                <Button
                    title="Créer un compte"
                    onPress={() => router.push('/(auth)/sign-up')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    message: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
    buttonContainer: { gap: 10, width: '100%', maxWidth: 200 },
});
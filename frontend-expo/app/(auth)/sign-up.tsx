import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function SignUp() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Écran d'Inscription</Text>
            <Text style={styles.message}>Formulaire d'inscription - Nom, email, mot de passe</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Déjà un compte ? Se connecter"
                    onPress={() => router.back()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    message: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
    buttonContainer: { gap: 10, width: '100%', maxWidth: 200 }
});
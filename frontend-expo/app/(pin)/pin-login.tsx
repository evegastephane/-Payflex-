import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function PinLogin() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vérification PIN</Text>
            <Text style={styles.message}>Écran affiché à chaque ouverture - Saisie du code secret</Text>

            <View style={styles.buttonContainer}>
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
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Profile() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mon Profil</Text>
            <Text style={styles.message}>Informations personnelles et préférences</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Modifier le profil"
                    onPress={() => alert('Formulaire de modification')}
                />
                <Button
                    title="Vérification KYC"
                    onPress={() => alert('Redirection vers les étapes KYC')}
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
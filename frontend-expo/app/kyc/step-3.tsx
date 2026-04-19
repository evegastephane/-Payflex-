import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function KYCStep3() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>KYC - Étape 3/3</Text>
            <Text style={styles.message}>
                Justificatif de domicile et photo de profil
            </Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Terminer la vérification"
                    onPress={() => {
                        Alert.alert('Succès', 'KYC complété avec succès !', [
                            { text: 'OK', onPress: () => router.replace('/(tabs)/profile') },
                        ]);
                    }}
                />
                <Button
                    title="Retour"
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
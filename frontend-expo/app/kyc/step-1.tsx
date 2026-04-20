import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function KYCStep1() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>KYC - Étape 1/3</Text>
            <Text style={styles.message}>
                Informations personnelles : Nom, prénom, date de naissance
            </Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Étape suivante"
                    onPress={() => router.push('/kyc/step-2')}
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
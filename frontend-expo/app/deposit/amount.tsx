import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function DepositAmount() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Saisir le montant du dépôt</Text>
            <Text style={styles.message}>
                Page de saisie du montant à déposer
            </Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Continuer"
                    onPress={() => router.push('/deposit/confirmation')}
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
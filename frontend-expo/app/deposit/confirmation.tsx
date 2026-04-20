import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function DepositConfirmation() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmation du dépôt</Text>
            <Text style={styles.message}>
                Page de confirmation avant validation du dépôt
            </Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Confirmer le dépôt"
                    onPress={() => {
                        Alert.alert('Succès', 'Dépôt confirmé !', [
                            { text: 'OK', onPress: () => router.replace('/(tabs)/wallet') },
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
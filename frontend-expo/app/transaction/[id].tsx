import { View, Text, Button, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function TransactionDetail() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Détail de la transaction</Text>
            <Text style={styles.message}>
                Transaction ID: {id}
            </Text>
            <Text style={styles.message}>
                Montant, date, statut, et détails de la transaction
            </Text>

            <View style={styles.buttonContainer}>
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
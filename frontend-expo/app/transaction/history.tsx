import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';

export default function TransactionHistory() {
    // Données mockées pour l'exemple
    const transactions = [
        { id: '1', date: '2024-01-15', amount: '+50€', type: 'Dépôt' },
        { id: '2', date: '2024-01-14', amount: '-20€', type: 'Achat' },
        { id: '3', date: '2024-01-13', amount: '+100€', type: 'Virement' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historique des transactions</Text>
            <Text style={styles.message}>
                Liste de toutes vos transactions avec filtres et recherche
            </Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <Text>{item.date}</Text>
                        <Text>{item.type}</Text>
                        <Text style={item.amount.startsWith('+') ? styles.positive : styles.negative}>
                            {item.amount}
                        </Text>
                    </View>
                )}
            />

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
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    message: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
    buttonContainer: { marginTop: 20, gap: 10 },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    positive: { color: 'green', fontWeight: 'bold' },
    negative: { color: 'red', fontWeight: 'bold' },
});
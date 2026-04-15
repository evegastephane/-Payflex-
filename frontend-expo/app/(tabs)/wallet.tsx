import { View, Text, Button, StyleSheet } from 'react-native';

export default function Wallet() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mon Portefeuille</Text>
            <Text style={styles.message}>Affichage du solde et des dernières transactions</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Voir les transactions"
                    onPress={() => alert('Redirection vers historique des transactions')}
                />
                <Button
                    title="Déposer des fonds"
                    onPress={() => alert('Redirection vers dépôt')}
                />
                <Button
                    title="Envoyer de l'argent"
                    onPress={() => alert('Redirection vers envoi')}
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
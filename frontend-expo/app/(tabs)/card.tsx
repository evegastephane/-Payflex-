import { View, Text, Button, StyleSheet } from 'react-native';

export default function Card() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ma Carte Virtuelle</Text>
            <Text style={styles.message}>Gestion de la carte - Solde, blocage, paramètres</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Voir les détails de la carte"
                    onPress={() => alert('Affichage numéro, date, CVV')}
                />
                <Button
                    title="Bloquer la carte"
                    onPress={() => alert('Carte bloquée temporairement')}
                />
                <Button
                    title="Recharger la carte"
                    onPress={() => alert('Redirection vers rechargement')}
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
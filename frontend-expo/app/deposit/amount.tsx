import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const API_BASE_URL = 'http://192.168.1.116:8080';
const MONTANT_MAX  = 1_000_000;
const DECIMALES_MAX = 2;

export default function DepositAmount() {
    const [montant, setMontant] = useState('');
    const [loading, setLoading] = useState(false);

    const appuyer = (valeur: string) => {
        if (valeur === '.' && montant.includes('.')) return;
        if (valeur === '.' && montant === '') return;
        if (montant.includes('.')) {
            const decimales = montant.split('.')[1];
            if (decimales && decimales.length >= DECIMALES_MAX) return;
        }
        const prochain = montant + valeur;
        if (parseFloat(prochain) > MONTANT_MAX) return;
        setMontant(prochain);
    };

    const effacer = () => setMontant(prev => prev.slice(0, -1));

    const formaterAffichage = (val: string): string => {
        if (!val) return '0';
        const [entier, decimale] = val.split('.');
        const entierFormate = parseInt(entier, 10).toLocaleString('fr-FR');
        return decimale !== undefined ? `${entierFormate},${decimale}` : entierFormate;
    };

    const validerMontant = (): boolean => {
        if (!montant || montant === '.') {
            Alert.alert('Montant invalide', 'Veuillez saisir un montant.');
            return false;
        }
        const val = parseFloat(montant);
        if (isNaN(val) || val <= 0) {
            Alert.alert('Montant invalide', 'Le montant doit etre superieur a 0.');
            return false;
        }
        if (val > MONTANT_MAX) {
            Alert.alert('Montant trop eleve', `Le montant maximum est ${MONTANT_MAX.toLocaleString('fr-FR')} FCFA.`);
            return false;
        }
        return true;
    };

    const deposer = async () => {
        if (!validerMontant() || loading) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/depot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ montant: parseFloat(montant) }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail?.message ?? 'Erreur serveur');
            }
            router.push('/deposit/confirmation');
        } catch (err: any) {
            Alert.alert('Erreur', err.message ?? 'Impossible de traiter le depot. Verifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    const touches = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

    return (
        <View style={styles.container}>

            <View style={styles.container_retour}>
                <TouchableOpacity onPress={() => router.navigate('/(tabs)/card')} disabled={loading}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Deposer des fonds</Text>
            </View>

            <Text style={styles.titre}>Saisir le montant du depot</Text>

            <View style={styles.affichage}>
                <Text style={[styles.montantTexte, !montant && styles.montantVide]}>
                    {formaterAffichage(montant)}
                </Text>
                <Text style={styles.devise}>FCFA</Text>
            </View>

            <Text style={styles.indication}>Maximum : {MONTANT_MAX.toLocaleString('fr-FR')} FCFA</Text>

            <View style={styles.clavier}>
                {touches.map(touche => (
                    <TouchableOpacity key={touche} style={styles.touche} onPress={() => appuyer(touche)} disabled={loading}>
                        <Text style={styles.touche_texte}>{touche}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.touche} onPress={effacer} disabled={loading}>
                    <Ionicons name="backspace-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.bouton_deposer, loading && styles.bouton_disabled]}
                    onPress={deposer}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="white" size="small" />
                        : <Text style={styles.bouton_texte}>Deposer</Text>
                    }
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container:        { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, width: '100%' },
    container_retour: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 35 },
    title:            { fontSize: 20, fontWeight: 'bold' },
    titre:            { fontSize: 12, marginBottom: 35, color: 'gray' },
    indication:       { fontSize: 11, color: '#9CA3AF', marginBottom: 20 },
    affichage:        { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 10, paddingVertical: 16, paddingHorizontal: 24, minWidth: '70%' },
    montantTexte:     { fontSize: 42, fontWeight: '600', color: '#1a1a18', letterSpacing: -1 },
    montantVide:      { color: '#c0bdb8' },
    devise:           { fontSize: 18, fontWeight: '500', color: '#6b6b68', marginBottom: 6 },
    clavier:          { width: '100%', maxWidth: 700, backgroundColor: 'rgba(241,238,238,0.45)', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 45 },
    touche:           { width: 90, height: 50, justifyContent: 'center', alignItems: 'center' },
    touche_texte:     { fontSize: 25 },
    buttonContainer:  { width: '100%', maxWidth: 200, borderRadius: 80, marginTop: 20 },
    bouton_deposer:   { backgroundColor: 'blue', width: '100%', maxWidth: 300, padding: 18, borderRadius: 30, alignItems: 'center' },
    bouton_disabled:  { backgroundColor: '#93A8F4' },
    bouton_texte:     { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
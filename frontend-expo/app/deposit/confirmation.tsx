import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://192.168.1.116:8080';

interface DepotData {
    montant: number;
    frais: number;
    total: number;
}

type EtatChargement = 'loading' | 'success' | 'error';

export default function DepositConfirmation() {
    const [depot, setDepot] = useState<DepotData | null>(null);
    const [etat, setEtat] = useState<EtatChargement>('loading');
    const [erreur, setErreur] = useState('');
    const [confirmation, setConfirmation] = useState(false);

    useEffect(() => {
        chargerDepot();
    }, []);

    const chargerDepot = async () => {
        setEtat('loading');
        setErreur('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/depot`);
            if (!res.ok) throw new Error('Impossible de charger les donnees du depot.');
            const data: DepotData = await res.json();
            setDepot(data);
            setEtat('success');
        } catch (err: any) {
            setErreur(err.message ?? 'Erreur de connexion.');
            setEtat('error');
        }
    };

    const confirmer = async () => {
        if (confirmation) return;
        setConfirmation(true);
        try {
            // TODO: remplacer par POST /api/depot/confirm
            await new Promise(resolve => setTimeout(resolve, 800));
            Alert.alert('Depot confirme', 'Votre depot a ete traite avec succes.', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/wallet') },
            ]);
        } catch (err: any) {
            Alert.alert('Erreur', 'La confirmation a echoue. Veuillez reessayer.');
        } finally {
            setConfirmation(false);
        }
    };

    const formater = (val: number | undefined): string => {
        if (val === undefined || val === null) return '—';
        return val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    if (etat === 'loading') {
        return (
            <View style={styles.centeredState}>
                <ActivityIndicator size="large" color="blue" />
                <Text style={styles.chargementTexte}>Chargement du recapitulatif...</Text>
            </View>
        );
    }

    if (etat === 'error') {
        return (
            <View style={styles.centeredState}>
                <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
                <Text style={styles.erreurTitre}>Chargement echoue</Text>
                <Text style={styles.erreurSub}>{erreur}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={chargerDepot} activeOpacity={0.8}>
                    <Text style={styles.retryBtnTexte}>Reessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Confirmer le depot</Text>
                <Ionicons name="help-circle-outline" size={24} color="black" />
            </View>

            <View style={styles.icone_container}>
                <Ionicons name="wallet-outline" size={30} color="white" />
            </View>

            <View style={styles.carte}>
                <Text style={styles.label}>MONTANT DU DEPOT</Text>
                <Text style={styles.montant}>{formater(depot?.montant)} FCFA</Text>

                <View style={styles.source}>
                    <View style={styles.source_info}>
                        <Text style={styles.from}>SOURCE</Text>
                        <Text style={styles.operateur}>MTN MoMo - 4920</Text>
                    </View>
                    <Ionicons name="checkmark-circle-outline" size={24} color="blue" />
                </View>

                <View style={styles.ligne}>
                    <Text style={styles.ligne_label}>Frais reseau</Text>
                    <Text style={styles.ligne_valeur}>{formater(depot?.frais)} FCFA</Text>
                </View>
                <View style={styles.ligne}>
                    <Text style={styles.ligne_label}>Delai de traitement</Text>
                    <Text style={styles.ligne_instant}>Instantane</Text>
                </View>

                <View style={styles.separateur} />

                <View style={styles.total_container}>
                    <View>
                        <Text style={styles.total_label}>TOTAL A PAYER</Text>
                        <Text style={styles.total_montant}>{formater(depot?.total)} FCFA</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badge_texte}>MONTANT FINAL</Text>
                    </View>
                </View>
            </View>

            <View style={styles.securite}>
                <Ionicons name="lock-closed-outline" size={14} color="gray" />
                <Text style={styles.securite_texte}>
                    Les transactions sont chiffrees avec des protocoles de securite bancaire.
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.bouton, confirmation && styles.bouton_disabled]}
                onPress={confirmer}
                disabled={confirmation}
                activeOpacity={0.85}
            >
                {confirmation
                    ? <ActivityIndicator color="white" size="small" />
                    : <Text style={styles.bouton_texte}>Confirmer le depot</Text>
                }
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container:       { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, backgroundColor: '#F5F5F5' },
    centeredState:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32, backgroundColor: '#F5F5F5' },
    chargementTexte: { fontSize: 14, color: 'gray', marginTop: 8 },
    erreurTitre:     { fontSize: 16, fontWeight: '700', color: '#111827' },
    erreurSub:       { fontSize: 13, color: 'gray', textAlign: 'center' },
    retryBtn:        { marginTop: 8, backgroundColor: 'blue', borderRadius: 30, paddingHorizontal: 28, paddingVertical: 12 },
    retryBtnTexte:   { color: 'white', fontWeight: '700', fontSize: 14 },
    header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 25 },
    title:           { fontSize: 18, fontWeight: 'bold' },
    icone_container: { backgroundColor: 'blue', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
    carte:           { backgroundColor: 'white', width: '100%', borderRadius: 20, padding: 20, gap: 15, marginBottom: 20 },
    label:           { fontSize: 11, color: 'gray', textAlign: 'center', letterSpacing: 1 },
    montant:         { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
    separateur:      { height: 1, backgroundColor: '#F3F4F8' },
    source:          { backgroundColor: '#F5F5F5', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    source_info:     { gap: 3 },
    from:            { fontSize: 10, color: 'gray', letterSpacing: 1 },
    operateur:       { fontSize: 15, fontWeight: 'bold' },
    ligne:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ligne_label:     { fontSize: 14, color: 'gray' },
    ligne_valeur:    { fontSize: 14, fontWeight: '500' },
    ligne_instant:   { fontSize: 14, color: 'blue', fontWeight: '500' },
    total_container: { backgroundColor: '#EEF2FF', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    total_label:     { fontSize: 10, color: 'blue', letterSpacing: 1 },
    total_montant:   { fontSize: 22, fontWeight: 'bold' },
    badge:           { backgroundColor: 'blue', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
    badge_texte:     { fontSize: 10, color: 'white', fontWeight: 'bold' },
    securite:        { flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingHorizontal: 10, marginBottom: 20 },
    securite_texte:  { fontSize: 11, color: 'gray', flex: 1 },
    bouton:          { backgroundColor: 'blue', width: '100%', padding: 18, borderRadius: 30, alignItems: 'center' },
    bouton_disabled: { backgroundColor: '#93A8F4' },
    bouton_texte:    { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
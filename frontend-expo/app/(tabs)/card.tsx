import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://192.168.1.116:8080';

interface CardData {
    numero: string;
    numero_cache: string;
    titulaire: string;
    expiration: string;
    type: string;
    tier: string;
}

interface Activite {
    id: string;
    nom: string;
    date: string;
    montant: string;
    statut: string;
    icone: string;
}

type EtatChargement = 'loading' | 'success' | 'error';

const couleurStatut = (statut: string): string => {
    switch (statut) {
        case 'COMPLETED': return '#16A34A';
        case 'SETTLED':   return '#16A34A';
        case 'PENDING':   return '#F97316';
        case 'DECLINED':  return '#DC2626';
        default:          return '#6B7280';
    }
};

export default function Card() {
    const [visible, setVisible] = useState(false);
    const [card, setCard] = useState<CardData | null>(null);
    const [activites, setActivites] = useState<Activite[]>([]);
    const [etat, setEtat] = useState<EtatChargement>('loading');
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chargerDonnees = async () => {
        setEtat('loading');
        setErreur('');
        try {
            const [resCard, resActivites] = await Promise.all([
                fetch(`${API_BASE_URL}/api/card`),
                fetch(`${API_BASE_URL}/api/activites?limit=3`),
            ]);
            if (!resCard.ok)      throw new Error('Impossible de charger la carte.');
            if (!resActivites.ok) throw new Error('Impossible de charger les activites.');
            const [dataCard, dataActivites] = await Promise.all([resCard.json(), resActivites.json()]);
            setCard(dataCard);
            setActivites(dataActivites);
            setEtat('success');
        } catch (err: any) {
            setErreur(err.message ?? 'Erreur de connexion.');
            setEtat('error');
        }
    };

    if (etat === 'loading') {
        return (
            <View style={styles.centeredState}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    if (etat === 'error') {
        return (
            <View style={styles.centeredState}>
                <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
                <Text style={styles.erreurTitre}>Chargement echoue</Text>
                <Text style={styles.erreurSub}>{erreur}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={chargerDonnees} activeOpacity={0.8}>
                    <Text style={styles.retryBtnTexte}>Reessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.photo}>
                    <Image
                        source={require('../../assets/images/logo payflex.jpg')}
                        style={styles.avatar}
                        defaultSource={require('../../assets/images/logo payflex.jpg')}
                    />
                    <Text style={styles.text}>PayFlex</Text>
                </View>
                <TouchableOpacity onPress={() => console.log('notifications')}>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.carte}>
                <View style={styles.carte_top}>
                    <View>
                        <Text style={styles.tier}>{card?.tier}</Text>
                        <Text style={styles.type}>{card?.type}</Text>
                    </View>
                    <Ionicons name="radio-outline" size={30} color="white" />
                </View>

                <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.numero_container}>
                    <Text style={styles.numero}>{visible ? card?.numero : card?.numero_cache}</Text>
                    <Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={15} color="white" />
                </TouchableOpacity>

                <View style={styles.carte_bottom}>
                    <View>
                        <Text style={styles.label}>TITULAIRE</Text>
                        <Text style={styles.valeur}>{card?.titulaire}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>EXPIRE</Text>
                        <Text style={styles.valeur}>{card?.expiration}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.boutons_row}>
                <View style={styles.bouton_item}>
                    <TouchableOpacity style={styles.bouton_bleu} onPress={() => router.push('/deposit/amount')}>
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.bouton_label}>AJOUT</Text>
                </View>
                <View style={styles.bouton_item}>
                    <TouchableOpacity style={styles.bouton_gris} onPress={() => router.push('//deposit/amount')}>
                        <Ionicons name="wallet-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.bouton_label}>RETRAIT</Text>
                </View>
                <View style={styles.bouton_item}>
                    <TouchableOpacity style={styles.bouton_gris} onPress={() => console.log('supprimer')}>
                        <Ionicons name="remove-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.bouton_label}>SUPPRESSION</Text>
                </View>
                <View style={styles.bouton_item}>
                    <TouchableOpacity style={styles.bouton_gris} onPress={() => console.log('options')}>
                        <Ionicons name="settings-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.bouton_label}>OPTIONS</Text>
                </View>
            </View>

            <View style={styles.transactions}>
                <Text style={styles.recent}>Activites Recentes</Text>
                <View style={styles.plus}>
                    <Text style={styles.small}>Vos activites du mois</Text>
                    <TouchableOpacity onPress={() => router.push('/transaction/history')}>
                        <Text style={styles.voir}>Voir plus</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.trans}>
                    {activites.map(activite => (
                        <TouchableOpacity key={activite.id} onPress={() => router.push(`/transaction/${activite.id}`)}>
                            <View style={styles.transaction_item}>
                                <Ionicons name={(activite.icone as any) ?? 'receipt-outline'} size={24} color="blue" />
                                <View style={styles.nom}>
                                    <Text style={styles.name}>{activite.nom}</Text>
                                    <Text style={styles.small}>{activite.date}</Text>
                                </View>
                                <View style={styles.statut}>
                                    <Text style={[styles.name, { color: activite.montant.startsWith('-') ? '#DC2626' : '#2563EB' }]}>
                                        {activite.montant}
                                    </Text>
                                    <Text style={[styles.statut_texte, { color: couleurStatut(activite.statut) }]}>
                                        {activite.statut}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container:        { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 0, backgroundColor: '#F5F5F5' },
    centeredState:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32, backgroundColor: '#F5F5F5' },
    erreurTitre:      { fontSize: 16, fontWeight: '700', color: '#111827' },
    erreurSub:        { fontSize: 13, color: 'gray', textAlign: 'center' },
    retryBtn:         { marginTop: 8, backgroundColor: 'blue', borderRadius: 30, paddingHorizontal: 28, paddingVertical: 12 },
    retryBtnTexte:    { color: 'white', fontWeight: '700', fontSize: 14 },
    header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 13, marginBottom: 10 },
    photo:            { flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' },
    avatar:           { width: 30, height: 30, borderRadius: 20 },
    text:             { fontWeight: 'bold', fontSize: 20, marginLeft: 8, color: 'rgba(26,35,126,0.67)' },
    carte:            { backgroundColor: 'blue', width: '90%', borderRadius: 20, padding: 20, marginBottom: 25, gap: 15 },
    carte_top:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    tier:             { fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
    type:             { fontSize: 18, color: 'white', fontWeight: 'bold' },
    numero_container: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    numero:           { fontSize: 16, color: 'white', letterSpacing: 2 },
    carte_bottom:     { flexDirection: 'row', justifyContent: 'space-between' },
    label:            { fontSize: 8, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
    valeur:           { fontSize: 13, color: 'white', fontWeight: 'bold' },
    boutons_row:      { flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginBottom: 25 },
    bouton_item:      { alignItems: 'center', gap: 5 },
    bouton_bleu:      { backgroundColor: 'blue', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    bouton_gris:      { backgroundColor: '#E0E0E0', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    bouton_label:     { fontSize: 10, color: 'gray', fontWeight: '500' },
    transactions:     { justifyContent: 'flex-start', width: '100%', paddingHorizontal: 20 },
    plus:             { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    recent:           { fontSize: 22, color: 'black', fontWeight: 'bold', marginBottom: 5 },
    small:            { fontSize: 10, color: 'gray' },
    voir:             { fontSize: 10, color: 'blue' },
    nom:              { justifyContent: 'center', flex: 1, paddingHorizontal: 10 },
    statut:           { alignItems: 'flex-end' },
    statut_texte:     { fontSize: 10, fontWeight: '600' },
    trans:            { justifyContent: 'center', marginTop: 10 },
    name:             { fontSize: 14 },
    transaction_item: { paddingHorizontal: 15, borderRadius: 25, height: 60, backgroundColor: 'white', marginBottom: 15, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
});
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

interface Transaction {
    id: string;
    nom: string;
    date: string;
    montant: string;
    statut: string;
    icone: string;
    type: string;
}

type EtatChargement = 'loading' | 'success' | 'error';

const iconeParType = (type: string): string => {
    switch (type) {
        case 'depot':   return 'cash-outline';
        case 'retrait': return 'wallet-outline';
        default:        return 'card-outline';
    }
};

const couleurStatut = (statut: string): string => {
    switch (statut) {
        case 'COMPLETED': return '#16A34A';
        case 'SETTLED':   return '#16A34A';
        case 'PENDING':   return '#F97316';
        case 'DECLINED':  return '#DC2626';
        default:          return '#6B7280';
    }
};

export default function Wallet() {
    const [solde, setSolde] = useState<number>(0);
    const [tier, setTier] = useState<string>('');
    const [visible, setVisible] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [etat, setEtat] = useState<EtatChargement>('loading');
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chargerDonnees = async () => {
        setEtat('loading');
        setErreur('');
        try {
            const [resWallet, resTrans] = await Promise.all([
                fetch(`${API_BASE_URL}/api/wallet/balance`),
                fetch(`${API_BASE_URL}/api/transactions?limit=3`),
            ]);
            if (!resWallet.ok) throw new Error('Impossible de charger le solde.');
            if (!resTrans.ok)  throw new Error('Impossible de charger les transactions.');
            const [dataWallet, dataTrans] = await Promise.all([resWallet.json(), resTrans.json()]);
            setSolde(dataWallet.solde ?? 0);
            setTier(dataWallet.tier ?? '');
            setTransactions(dataTrans);
            setEtat('success');
        } catch (err: any) {
            setErreur(err.message ?? 'Erreur de connexion.');
            setEtat('error');
        }
    };

    const formaterSolde = (val: number): string =>
        val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

            <View style={styles.balance}>
                <View style={styles.container_balance}>
                    <Text style={styles.current}>SOLDE ACTUEL</Text>
                    <TouchableOpacity onPress={() => setVisible(!visible)}>
                        <Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={13} color="white" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.montant}>
                    {visible ? `${formaterSolde(solde)} FCFA` : '••••'}
                </Text>

                <View style={styles.container_silver}>
                    <Text style={styles.tier_texte}>PayFlex {tier || 'Silver'}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.botouns_add} onPress={() => router.push('/deposit/amount')}>
                        <Ionicons name="add-circle-outline" size={15} color="white" />
                        <Text style={styles.add}>AJOUT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botouns_withdraw} onPress={() => router.push('//deposit/amount')}>
                        <Ionicons name="cash-outline" size={15} color="white" />
                        <Text style={styles.with}>RETRAIT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.transactions}>
                <Text style={styles.recent}>Transactions recentes</Text>
                <View style={styles.plus}>
                    <Text style={styles.small}>Vos transactions financieres de la semaine</Text>
                    <TouchableOpacity onPress={() => router.push('/transaction/history')}>
                        <Text style={styles.voir}>Voir plus</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.trans}>
                    {transactions.map(transaction => (
                        <TouchableOpacity key={transaction.id} onPress={() => router.push(`/transaction/${transaction.id}`)}>
                            <View style={styles.transaction_item}>
                                <Ionicons name={iconeParType(transaction.type) as any} size={24} color="blue" />
                                <View style={styles.nom}>
                                    <Text style={styles.name}>{transaction.nom}</Text>
                                    <Text style={styles.small}>{transaction.date}</Text>
                                </View>
                                <View style={styles.statut_container}>
                                    <Text style={[styles.name, { color: transaction.montant.startsWith('-') ? '#DC2626' : '#2563EB' }]}>
                                        {transaction.montant}
                                    </Text>
                                    <Text style={[styles.statut_texte, { color: couleurStatut(transaction.statut) }]}>
                                        {transaction.statut}
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
    header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 13, marginBottom: 30 },
    photo:            { flexDirection: 'row', justifyContent: 'center', gap: 1, marginTop: 2, alignItems: 'center' },
    avatar:           { width: 30, height: 30, borderRadius: 20 },
    text:             { fontWeight: 'bold', fontSize: 20, marginLeft: 8, color: 'rgba(26,35,126,0.67)' },
    balance:          { justifyContent: 'flex-start', marginBottom: 30, alignItems: 'center', backgroundColor: 'blue', width: '100%', maxWidth: 270, gap: 10, height: '100%', maxHeight: 200, borderRadius: 30 },
    container_balance:{ justifyContent: 'center', flexDirection: 'row', marginTop: 25, alignItems: 'center', gap: 8, marginBottom: 1 },
    current:          { fontSize: 10, color: 'white' },
    montant:          { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 1 },
    container_silver: { marginBottom: 25, backgroundColor: 'rgba(224,224,224,0.44)', borderRadius: 20, width: '100%', maxWidth: 80, justifyContent: 'center', alignItems: 'center', padding: 3 },
    tier_texte:       { fontSize: 7, color: 'white' },
    buttonContainer:  { backgroundColor: 'rgba(224,224,224,0.35)', gap: 0, width: '100%', maxWidth: 270, height: 43, justifyContent: 'center', flexDirection: 'row', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    botouns_add:      { borderBottomLeftRadius: 30, borderRightWidth: 1, borderRightColor: 'white', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', width: '100%', maxWidth: 135, height: 43, flexDirection: 'row', gap: 4 },
    botouns_withdraw: { borderBottomRightRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', width: '100%', maxWidth: 135, height: 43, flexDirection: 'row', gap: 4 },
    add:              { fontSize: 10, color: 'white' },
    with:             { fontSize: 10, color: 'white' },
    transactions:     { justifyContent: 'flex-start', width: '100%', paddingHorizontal: 20 },
    plus:             { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    recent:           { fontSize: 25, color: 'black', fontWeight: 'bold', marginBottom: 10 },
    small:            { fontSize: 10, color: 'gray' },
    voir:             { fontSize: 10, color: 'blue' },
    nom:              { justifyContent: 'center', flex: 1, paddingHorizontal: 10 },
    statut_container: { alignItems: 'flex-end' },
    statut_texte:     { fontSize: 10, fontWeight: '600' },
    trans:            { justifyContent: 'center', marginTop: 20 },
    name:             { fontSize: 15 },
    transaction_item: { paddingHorizontal: 15, borderRadius: 25, height: 60, backgroundColor: 'white', marginBottom: 15, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
});
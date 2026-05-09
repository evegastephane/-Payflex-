import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Share,
    ActivityIndicator,
} from 'react-native';


const API_BASE_URL = 'http://192.168.1.116:8080';



export interface TransactionDetail {
    id: string;
    titre: string;
    date: string;
    montant: string;
    statut: 'Réussi' | 'En attente' | 'Échoué';
    icone: string;
    iconeBg: string;
    groupe: string;
    destinataire: string;
    banque: string;
    reference: string;
    blockchain: boolean;
    note: string;
    sous_total: string;
    frais_reseau: string;
    total: string;
}

type LoadingState = 'loading' | 'success' | 'error';


const fetchTransactionDetail = async (id: string): Promise<TransactionDetail> => {
    const res = await fetch(`${API_BASE_URL}/api/historique/${id}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail?.message ?? 'Transaction introuvable');
    }
    return res.json();
};



const statusConfig = (statut: TransactionDetail['statut']) => {
    switch (statut) {
        case 'Réussi':
            return { color: '#2563EB', bg: '#EFF6FF', icon: '✓', label: 'PAIEMENT RÉUSSI' };
        case 'En attente':
            return { color: '#F97316', bg: '#FFF7ED', icon: '⏳', label: 'EN ATTENTE' };
        case 'Échoué':
            return { color: '#DC2626', bg: '#FEF2F2', icon: '✕', label: 'PAIEMENT ÉCHOUÉ' };
    }
};



const BackIcon  = () => <Text style={{ fontSize: 20, color: '#111827' }}>←</Text>;
const ShareIcon = () => <Text style={{ fontSize: 18, color: '#111827' }}>⇧</Text>;
const MoreIcon  = () => <Text style={{ fontSize: 18, color: '#111827' }}>⋮</Text>;
const CopyIcon  = () => <Text style={{ fontSize: 16, color: '#9CA3AF' }}>⧉</Text>;
const NoteIcon  = () => <Text style={{ fontSize: 18, color: '#6B7280' }}>≡</Text>;
const BadgeIcon = () => <Text style={{ fontSize: 18, color: '#2563EB' }}>✔</Text>;



interface InfoCardProps { label: string; children: React.ReactNode }
const InfoCard: React.FC<InfoCardProps> = ({ label, children }) => (
    <View style={styles.infoCard}>
        <Text style={styles.infoCardLabel}>{label}</Text>
        {children}
    </View>
);

interface SummaryRowProps { label: string; value: string; valueColor?: string; bold?: boolean }
const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, valueColor, bold }) => (
    <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, bold && { fontWeight: '700', color: '#111827' }]}>{label}</Text>
        <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : null, bold && { fontSize: 16 }]}>
            {value}
        </Text>
    </View>
);


const DetailSkeleton = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.skeletonCircle, { alignSelf: 'center', marginTop: 16, marginBottom: 14 }]} />
        <View style={[styles.skeletonLine, { width: 140, alignSelf: 'center', marginBottom: 16 }]} />
        <View style={[styles.skeletonLine, { width: 180, height: 40, alignSelf: 'center', marginBottom: 6 }]} />
        <View style={[styles.skeletonLine, { width: 200, alignSelf: 'center', marginBottom: 24 }]} />
        {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.infoCard, { gap: 10 }]}>
                <View style={[styles.skeletonLine, { width: 80 }]} />
                <View style={[styles.skeletonLine, { width: '70%', height: 18 }]} />
                <View style={[styles.skeletonLine, { width: '50%' }]} />
            </View>
        ))}
    </ScrollView>
);



interface TransactionDetailsProps {
    transactionId: string;
    onBack?: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
                                                                   transactionId,
                                                                   onBack,
                                                               }) => {
    const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadDetail();
    }, [transactionId]);

    const loadDetail = async () => {
        setLoadingState('loading');
        setErrorMessage('');
        try {
            const data = await fetchTransactionDetail(transactionId);
            setTransaction(data);
            setLoadingState('success');
        } catch (err: any) {
            setErrorMessage(err.message ?? 'Erreur de chargement');
            setLoadingState('error');
        }
    };

    const handleShare = async () => {
        if (!transaction) return;
        try {
            await Share.share({
                message: `Transaction ${transaction.reference} — ${transaction.montant} vers ${transaction.destinataire}`,
            });
        } catch {}
    };

    const handleCopyRef = () => {
        if (!transaction) return;
        // Clipboard.setString(transaction.reference);
        console.log('Référence copiée :', transaction.reference);
    };



    if (loadingState === 'loading') {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F3F4F8" />
                <View style={styles.navbar}>
                    <TouchableOpacity style={styles.navBtn} onPress={onBack} activeOpacity={0.7}><BackIcon /></TouchableOpacity>
                    <Text style={styles.navTitle}>Transaction</Text>
                    <View style={styles.navActions}>
                        <View style={styles.navBtn} /><View style={styles.navBtn} />
                    </View>
                </View>
                <DetailSkeleton />
            </SafeAreaView>
        );
    }

    if (loadingState === 'error' || !transaction) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F3F4F8" />
                <View style={styles.navbar}>
                    <TouchableOpacity style={styles.navBtn} onPress={onBack} activeOpacity={0.7}><BackIcon /></TouchableOpacity>
                    <Text style={styles.navTitle}>Transaction</Text>
                    <View style={{ width: 72 }} />
                </View>
                <View style={styles.errorState}>
                    <Text style={{ fontSize: 36 }}>⚠</Text>
                    <Text style={styles.errorTitle}>Chargement échoué</Text>
                    <Text style={styles.errorSub}>{errorMessage}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={loadDetail} activeOpacity={0.8}>
                        <Text style={styles.retryBtnText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const status = statusConfig(transaction.statut);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F8" />

            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navBtn} onPress={onBack} activeOpacity={0.7}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Transaction</Text>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navBtn} onPress={handleShare} activeOpacity={0.7}>
                        <ShareIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navBtn} activeOpacity={0.7}>
                        <MoreIcon />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>


                <View style={styles.successIconContainer}>
                    <View style={[styles.successIconCircle, { backgroundColor: status.color, shadowColor: status.color }]}>
                        <Text style={{ fontSize: 24, color: '#FFFFFF' }}>{status.icon}</Text>
                    </View>
                </View>


                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>


                <Text style={styles.amount}>{transaction.montant}</Text>
                <Text style={styles.amountSub}>Vers {transaction.destinataire}</Text>


                <InfoCard label="DESTINATAIRE">
                    <View style={styles.recipientRow}>
                        <View style={[styles.recipientAvatar, { backgroundColor: transaction.iconeBg + '22' }]}>
                            <Text style={{ fontSize: 22 }}>{transaction.icone}</Text>
                        </View>
                        <View style={styles.recipientInfo}>
                            <Text style={styles.recipientName}>{transaction.destinataire}</Text>
                            <Text style={styles.recipientBank}>{transaction.banque}</Text>
                        </View>
                        <BadgeIcon />
                    </View>
                </InfoCard>


                <InfoCard label="DATE & HEURE">
                    <Text style={styles.infoCardPrimary}>{transaction.date}</Text>
                    <Text style={styles.infoCardSecondary}>{transaction.groupe}</Text>
                </InfoCard>


                <InfoCard label="RÉFÉRENCE">
                    <View style={styles.referenceRow}>
                        <View>
                            <Text style={styles.infoCardPrimary}>{transaction.reference}</Text>
                            <Text style={styles.infoCardSecondary}>
                                {transaction.blockchain ? ' Vérifié blockchain' : ' Non vérifié'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleCopyRef} activeOpacity={0.7}>
                            <CopyIcon />
                        </TouchableOpacity>
                    </View>
                </InfoCard>


                <InfoCard label="RÉCAPITULATIF">
                    <SummaryRow label="Sous-total" value={transaction.sous_total} />
                    <View style={styles.divider} />
                    <SummaryRow label="Frais réseau" value={transaction.frais_reseau} valueColor="#2563EB" />
                    <View style={styles.dividerThick} />
                    <SummaryRow label="Total" value={transaction.total} bold />
                </InfoCard>


                {transaction.note ? (
                    <View style={styles.noteCard}>
                        <NoteIcon />
                        <View style={styles.noteContent}>
                            <Text style={styles.noteLabel}>NOTE</Text>
                            <Text style={styles.noteText}>"{transaction.note}"</Text>
                        </View>
                    </View>
                ) : null}


                <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.85}
                                  onPress={() => console.log('Téléchargement reçu PDF…')}>
                    <Text style={styles.downloadBtnText}>Télécharger le reçu PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.reportBtn} activeOpacity={0.7}
                                  onPress={() => console.log('Signalement…')}>
                    <Text style={styles.reportBtnText}>Signaler un problème</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};


const BLUE       = '#2563EB';
const BG         = '#F3F4F8';
const CARD_BG    = '#FFFFFF';
const TEXT_DARK  = '#111827';
const TEXT_MUTED = '#6B7280';
const TEXT_LABEL = '#9CA3AF';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },

    navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: BG },
    navBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    navTitle:   { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: TEXT_DARK, letterSpacing: 0.1 },
    navActions: { flexDirection: 'row', gap: 4 },

    scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 40 },

    successIconContainer: { marginTop: 16, marginBottom: 14 },
    successIconCircle: {
        width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
        shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },

    statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, gap: 6, marginBottom: 16 },
    statusDot:   { width: 7, height: 7, borderRadius: 3.5 },
    statusText:  { fontSize: 11, fontWeight: '700', letterSpacing: 1 },

    amount:    { fontSize: 38, fontWeight: '800', color: TEXT_DARK, letterSpacing: -1 },
    amountSub: { fontSize: 14, color: TEXT_MUTED, marginTop: 4, marginBottom: 24 },

    infoCard: {
        width: '100%', backgroundColor: CARD_BG, borderRadius: 16, padding: 16, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    infoCardLabel:     { fontSize: 10, fontWeight: '700', color: TEXT_LABEL, letterSpacing: 1.2, marginBottom: 10 },
    infoCardPrimary:   { fontSize: 16, fontWeight: '700', color: TEXT_DARK, lineHeight: 22 },
    infoCardSecondary: { fontSize: 13, color: TEXT_MUTED, marginTop: 2 },

    recipientRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
    recipientAvatar:{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    recipientInfo:  { flex: 1 },
    recipientName:  { fontSize: 15, fontWeight: '700', color: TEXT_DARK, lineHeight: 20 },
    recipientBank:  { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },

    referenceRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

    summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    summaryLabel: { fontSize: 14, color: TEXT_MUTED },
    summaryValue: { fontSize: 14, fontWeight: '600', color: TEXT_DARK },
    divider:      { height: 1, backgroundColor: '#F3F4F8', marginVertical: 6 },
    dividerThick: { height: 1.5, backgroundColor: '#E5E7EB', marginVertical: 8 },

    noteCard:    { width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 28, flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderColor: '#E5E7EB' },
    noteContent: { flex: 1 },
    noteLabel:   { fontSize: 10, fontWeight: '700', color: TEXT_LABEL, letterSpacing: 1.2, marginBottom: 6 },
    noteText:    { fontSize: 13, color: TEXT_MUTED, lineHeight: 19, fontStyle: 'italic' },

    downloadBtn: {
        width: '100%', backgroundColor: BLUE, borderRadius: 50, paddingVertical: 18, alignItems: 'center', marginBottom: 12,
        shadowColor: BLUE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },
    downloadBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
    reportBtn:     { width: '100%', backgroundColor: CARD_BG, borderRadius: 50, paddingVertical: 17, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    reportBtnText: { color: TEXT_DARK, fontSize: 15, fontWeight: '600' },

    // Skeleton
    skeletonCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E5E7EB' },
    skeletonLine:   { height: 14, borderRadius: 7, backgroundColor: '#E5E7EB', marginBottom: 4 },

    // Erreur
    errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
    errorTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
    errorSub:   { fontSize: 13, color: TEXT_MUTED, textAlign: 'center' },
    retryBtn:   { marginTop: 12, backgroundColor: BLUE, borderRadius: 50, paddingHorizontal: 28, paddingVertical: 12 },
    retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

export default TransactionDetails;
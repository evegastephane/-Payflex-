import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';



const API_BASE_URL = 'http://192.168.1.116:8080';



export type FilterType = 'Tous' | 'Réussi' | 'En attente' | 'Échoué';

export interface Transaction {
    id: string;
    titre: string;
    date: string;
    montant: string;
    statut: 'Réussi' | 'En attente' | 'Échoué';
    icone: string;
    iconeBg: string;
    groupe: string;
}

interface TransactionGroupe {
    jour: string;
    transactions: Transaction[];
}

interface HistoriqueResponse {
    groupes: TransactionGroupe[];
    total: number;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';


const fetchHistorique = async (statut?: string): Promise<HistoriqueResponse> => {
    const params = new URLSearchParams();
    if (statut && statut !== 'Tous') params.append('statut', statut);

    const res = await fetch(`${API_BASE_URL}/api/historique?${params.toString()}`);
    if (!res.ok) throw new Error('Impossible de charger l\'historique');
    return res.json();
};


const FILTERS: FilterType[] = ['Tous', 'Réussi', 'En attente', 'Échoué'];

const statusColor = (statut: Transaction['statut']): string => {
    switch (statut) {
        case 'Réussi':     return '#16A34A';
        case 'En attente': return '#F97316';
        case 'Échoué':     return '#DC2626';
    }
};



const BackIcon   = () => <Text style={{ fontSize: 20, color: '#111827' }}>←</Text>;
const SearchIcon = () => <Text style={{ fontSize: 20, color: '#111827' }}>🔍</Text>;


interface FilterTabProps { label: FilterType; active: boolean; onPress: () => void }

const FilterTab: React.FC<FilterTabProps> = ({ label, active, onPress }) => (
    <TouchableOpacity
        style={[styles.filterTab, active && styles.filterTabActive]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
            {label}
        </Text>
    </TouchableOpacity>
);


interface TransactionCardProps {
    item: Transaction;
    onPress: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={() => onPress(item.id)}>
        <View style={[styles.iconCircle, { backgroundColor: item.iconeBg + '22' }]}>
            <Text style={styles.iconEmoji}>{item.icone}</Text>
        </View>
        <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.titre}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
        </View>
        <View style={styles.cardRight}>
            <Text style={styles.cardAmount}>{item.montant}</Text>
            <Text style={[styles.cardStatus, { color: statusColor(item.statut) }]}>
                {item.statut}
            </Text>
        </View>
    </TouchableOpacity>
);



const SkeletonCard = () => (
    <View style={[styles.card, styles.skeletonCard]}>
        <View style={styles.skeletonIcon} />
        <View style={{ flex: 1, gap: 8 }}>
            <View style={[styles.skeletonLine, { width: '60%' }]} />
            <View style={[styles.skeletonLine, { width: '40%' }]} />
        </View>
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <View style={[styles.skeletonLine, { width: 60 }]} />
            <View style={[styles.skeletonLine, { width: 50 }]} />
        </View>
    </View>
);


interface TransactionHistoryProps {
    onTransactionPress?: (id: string) => void;
    onBack?: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
                                                                   onTransactionPress,
                                                                   onBack,
                                                               }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('Tous');
    const [groupes, setGroupes] = useState<TransactionGroupe[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const loadData = useCallback(async (filter: FilterType, isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoadingState('loading');
        }
        setErrorMessage('');

        try {
            const data = await fetchHistorique(filter === 'Tous' ? undefined : filter);
            setGroupes(data.groupes);
            setLoadingState('success');
        } catch (err: any) {
            setErrorMessage(err.message ?? 'Erreur de chargement');
            setLoadingState('error');
        } finally {
            setRefreshing(false);
        }
    }, []);


    useEffect(() => {
        loadData(activeFilter);
    }, []);


    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        loadData(filter);
    };

    const handleRefresh = () => loadData(activeFilter, true);

    const handleTransactionPress = (id: string) => {
        onTransactionPress?.(id);
    };



    const renderContent = () => {
        if (loadingState === 'loading') {
            return (
                <View style={styles.listContent}>
                    <Text style={styles.dayLabel}>Chargement…</Text>
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </View>
            );
        }

        if (loadingState === 'error') {
            return (
                <View style={styles.centeredState}>
                    <Text style={styles.errorEmoji}></Text>
                    <Text style={styles.errorTitle}>Impossible de charger</Text>
                    <Text style={styles.errorSub}>{errorMessage}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => loadData(activeFilter)} activeOpacity={0.8}>
                        <Text style={styles.retryBtnText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (groupes.length === 0) {
            return (
                <View style={styles.centeredState}>
                    <Text style={styles.errorEmoji}>📭</Text>
                    <Text style={styles.errorTitle}>Aucune transaction</Text>
                    <Text style={styles.errorSub}>Aucun résultat pour ce filtre.</Text>
                </View>
            );
        }

        return (
            <View style={styles.listContent}>
                {groupes.map(group => (
                    <View key={group.jour}>
                        <Text style={styles.dayLabel}>{group.jour}</Text>
                        {group.transactions.map(item => (
                            <TransactionCard key={item.id} item={item} onPress={handleTransactionPress} />
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F8" />

            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navBtn} onPress={onBack} activeOpacity={0.7}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Historique</Text>
                <TouchableOpacity style={styles.navBtn} activeOpacity={0.7}>
                    <SearchIcon />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
                style={styles.filtersScroll}
            >
                {FILTERS.map(f => (
                    <FilterTab
                        key={f}
                        label={f}
                        active={activeFilter === f}
                        onPress={() => handleFilterChange(f)}
                    />
                ))}
            </ScrollView>


            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#2563EB"
                        colors={['#2563EB']}
                    />
                }
            >
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
};


const BLUE    = '#2563EB';
const BG      = '#F3F4F8';
const CARD_BG = '#FFFFFF';
const TEXT_DARK  = '#111827';
const TEXT_MUTED = '#6B7280';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },

    navbar: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: BG,
    },
    navBtn:   { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    navTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: TEXT_DARK, letterSpacing: -0.3 },

    filtersScroll: { flexGrow: 0, marginBottom: 8 },
    filtersContainer: { paddingHorizontal: 16, gap: 8, flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    filterTab:           { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 50 },
    filterTabActive:     { backgroundColor: BLUE },
    filterTabText:       { fontSize: 14, fontWeight: '600', color: TEXT_MUTED },
    filterTabTextActive: { color: '#FFFFFF' },

    listContent: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
    dayLabel: { fontSize: 13, fontWeight: '700', color: TEXT_MUTED, marginTop: 16, marginBottom: 10, letterSpacing: 0.2 },

    card: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: CARD_BG,
        borderRadius: 16, padding: 14, marginBottom: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 12,
    },
    iconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    iconEmoji:  { fontSize: 20 },
    cardInfo:   { flex: 1 },
    cardTitle:  { fontSize: 15, fontWeight: '700', color: TEXT_DARK, marginBottom: 3 },
    cardDate:   { fontSize: 12, color: TEXT_MUTED },
    cardRight:  { alignItems: 'flex-end', gap: 3 },
    cardAmount: { fontSize: 15, fontWeight: '700', color: TEXT_DARK },
    cardStatus: { fontSize: 12, fontWeight: '600' },

    // Skeleton
    skeletonCard: { opacity: 0.5 },
    skeletonIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E5E7EB' },
    skeletonLine: { height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' },

    // États vides / erreur
    centeredState: { paddingTop: 80, alignItems: 'center', gap: 8 },
    errorEmoji: { fontSize: 36, marginBottom: 8 },
    errorTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
    errorSub:   { fontSize: 13, color: TEXT_MUTED, textAlign: 'center', paddingHorizontal: 32 },
    retryBtn: {
        marginTop: 12, backgroundColor: BLUE, borderRadius: 50,
        paddingHorizontal: 28, paddingVertical: 12,
    },
    retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

export default TransactionHistory;
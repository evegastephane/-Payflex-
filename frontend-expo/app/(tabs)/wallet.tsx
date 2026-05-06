import { View, Text,TouchableOpacity,Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Wallet() {
    const [solde, setSolde] = useState(0);
    const [visible, setVisible] = useState(true);
    const icones: { [key: string]: keyof typeof Ionicons.glyphMap } = {
        '1': 'medkit-outline',
        '2': 'cash-outline',
    };
    const [transactions, setTransactions] = useState<{
        id: string;
        nom: string;
        date: string;
        montant: string;
        statut: string;
    }[]>([
        { id: '1', nom: 'Apple Store', date: 'May 12, 2024 • 14:30', montant: '-$1,299.00', statut: 'DECLINED' },
        { id: '2', nom: 'External Deposit', date: 'May 11, 2024 • 09:15', montant: '+$0.00', statut: 'SETTLED' },
        { id: '3', nom: 'Blue Bottle Coffee', date: 'May 10, 2024 • 08:45', montant: '-$5.50', statut: 'PENDING' },
    ]);
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.photo}>
                    <Image
                        source={require('../../assets/images/logo payflex.jpg')}
                        style={styles.avatar}
                    />
                    <Text style={styles.text}>PayFlex</Text>
                </View>

                <TouchableOpacity onPress={() => console.log('cloche appuyée')}>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
           </View>

            <View style={styles.balance}>
                <View style={styles.container_balance}>
                  <Text style={styles.current}>CURRENT BALANCE</Text>
                    <TouchableOpacity onPress={() => setVisible(!visible)}>
                        <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={13} color="white" />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.montant}> {visible ? `$${solde}` : '••••'}</Text>
                </View>
                <View style={styles.container_silver}>
                    <Text style={styles.tier}>PayFlex Tier: Silver</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.botouns_add} onPress={() =>router.push('/deposit/amount')}>
                        <Ionicons name="add-circle-outline" size={15} color="white" />
                        <Text style={styles.add}>Add/Deposit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botouns_withdraw}onPress={() =>router.push('/deposit/amount')}>
                            <Ionicons name="cash-outline" size={15} color="white" />
                            <Text style={styles.with}>Withdraw</Text>
                        </TouchableOpacity>
                </View>
            </View>

            <View style={styles.transactions}>
                <Text style={styles.recent}> Reçentes transactions</Text>
                <View style={styles.plus}>
                  <Text style={styles.small}> Vos transactions financieres de la semaine </Text>
                  <TouchableOpacity  onPress={() =>router.push('/transaction/history')}>
                    <Text style={styles.voir}>Voir plus</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.trans}>
                    {transactions.map((transaction) => (
                        <TouchableOpacity key={transaction.id} onPress={() => router.push(`/transaction/${transaction.id}`)}>
                            <View style={styles.transaction_item}>
                                <Ionicons name={icones[transaction.id]} size={24} color="blue" />
                                <View style={styles.nom}>
                                    <Text style={styles.name}>{transaction.nom} </Text>
                                    <Text style={styles.small}>{transaction.date} </Text>
                                </View>
                                <View style={styles.statut}>
                                    <Text style={[styles.name, { color: transaction.montant.startsWith('-') ? 'red' : 'blue' }]}>
                                        {transaction.montant}
                                    </Text>
                                    <Text style={styles.smalle}>{transaction.statut} </Text>
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
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 0},
    nom: {justifyContent: 'center'},
    statut: {justifyContent: 'center'},
    trans: {justifyContent: 'center', marginTop: 20},
    name: { fontSize: 15 },
    transaction_item:{ paddingHorizontal: 15,borderRadius:25,height:60,backgroundColor:'white',marginBottom:15,justifyContent: "space-between",flexDirection: "row",alignItems: "center"},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 13,marginBottom:30},
    container_balance:{ justifyContent: 'center', flexDirection: 'row',marginTop:25, alignItems: 'center', gap: 8, marginBottom:1 },
    photo: {flexDirection: 'row',justifyContent: 'center',gap:1, marginTop:2},
    tier: { fontSize: 7,color: 'white'},
    transactions:{ justifyContent:"flex-start", height:'100%'},
    plus:{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', gap: 100, marginBottom:15 },
    recent: {fontSize: 25, color: 'black' , fontWeight: 'bold',marginBottom:10},
    small: { fontSize: 10, color: 'gray' },
    smalle: { fontSize: 10, color: 'green' },
    voir: { fontSize: 10, color: 'blue' },
    add:{fontSize: 10, color: 'white' },
    with:{fontSize: 10, color: 'white' },
    botouns_add: {borderBottomLeftRadius: 30,borderRightWidth: 1, borderRightColor: 'white',justifyContent:"center",alignItems:"center",backgroundColor:'rgba(224,224,224,0)',width: '100%', maxWidth: 135,  borderColor:'black', height:43,flexDirection:"row"},
    botouns_withdraw: { borderBottomRightRadius: 30, justifyContent:"center" ,alignItems:"center",backgroundColor:'rgba(224,224,224,0.01)',width: '100%', maxWidth: 135, borderColor:'black',height:43,flexDirection:"row" },
    container_silver: { marginBottom:25,backgroundColor:'rgba(224,224,224,0.44)', borderRadius:20, width:'100%' , maxWidth:80,justifyContent:"center", alignItems:"center", padding:3 },
    montant: {fontSize: 35, fontWeight: 'bold',color: 'white', marginBottom:1},
    balance: { justifyContent:"flex-start", marginBottom:30, alignItems: 'center', backgroundColor:'blue', width:'100%', maxWidth: 270, gap:10, height:'100%', maxHeight:200, borderRadius:30},
    current: { fontSize: 10,color:'white'},
    text: { fontWeight:"bold",fontSize: 20,justifyContent: 'space-between', marginLeft:8,color:'rgba(26,35,126,0.67)',fontFamily:'inter' },
    avatar: {width: 30, height: 30, borderRadius: 20,},
    message: { fontSize: 16, color: 'rgb(241,238,238)', textAlign: 'center', marginBottom: 30 },
    buttonContainer: { backgroundColor:'rgba(224,224,224,0.35)',gap: 0, width: '100%', maxWidth: 270,height:43,justifyContent: 'center', flexDirection:"row",borderBottomLeftRadius: 30, borderBottomRightRadius: 30},
});
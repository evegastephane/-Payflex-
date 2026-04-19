import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#4F46E5',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: { borderTopWidth: 1, borderTopColor: '#E5E7EB' },
            }}
        >
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Portefeuille',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="card"
                options={{
                    title: 'Carte',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'card' : 'card-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
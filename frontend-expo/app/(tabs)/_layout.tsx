import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Mon Portefeuille',
                    tabBarIcon: ({ focused }) => (
                        <Text>{focused ? '💰' : '💼'}</Text>
                    )
                }}
            />
            <Tabs.Screen
                name="card"
                options={{
                    title: 'Ma Carte Virtuelle',
                    tabBarIcon: ({ focused }) => (
                        <Text>{focused ? '💳' : '🃏'}</Text>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Mon Profil',
                    tabBarIcon: ({ focused }) => (
                        <Text>{focused ? '👤' : '🙋'}</Text>
                    )
                }}
            />
        </Tabs>
    );
}
import { Header } from '@/components/Header';
import { MenuItem } from '@/components/MenuItem';
import { ProfileSection } from '@/components/ProfileSection';
import { SectionCard } from '@/components/SectionCard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const dangerColor = '#FF3B30';

  const handleBackPress = () => {
    router.back();
  };

  const handleProfilePress = () => {
    router.push('/(profil)/index');
  };

  const handleMenuItemPress = (item) => {
    switch (item) {
      case 'mobile-money':
        Alert.alert('Mobile Money', 'Cette section sera disponible bientôt.');
        return;
      case 'notifications':
        router.push('/(profil)/notifications');
        return;
      case 'security':
        Alert.alert('Sécurité', 'Les options de sécurité seront gérées ici.');
        return;
      case 'language':
        Alert.alert('Langue', 'La sélection de la langue sera disponible bientôt.');
        return;
      case 'help-support':
        router.push('/(profil)/support-client');
        return;
      case 'about':
        Alert.alert('À propos', 'Payflex v1.0.0');
        return;
      default:
        return;
    }
  };

  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
  };

  const handleLogout = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Header 
        title="Paramètres" 
        onBackPress={handleBackPress}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={handleProfilePress}
        >
          <ProfileSection
            name="Amara Koné"
            phone="+225 01 02 03 04 05"
            showEditIcon={false}
          />
          <Ionicons name="chevron-forward" size={20} color={textColor} style={styles.profileArrow} />
        </TouchableOpacity>

        <SectionCard title="GESTION DU COMPTE">
          <MenuItem
            icon="card-outline"
            title="Mobile Money"
            onPress={() => handleMenuItemPress('mobile-money')}
          />
          
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            showToggle={true}
            toggleValue={notificationsEnabled}
            onToggleChange={handleNotificationToggle}
            onPress={() => handleMenuItemPress('notifications')}
          />
          
          <MenuItem
            icon="shield-checkmark-outline"
            title="Sécurité"
            onPress={() => handleMenuItemPress('security')}
          />
          
          <MenuItem
            icon="globe-outline"
            title="Langue"
            subtitle="Français"
            onPress={() => handleMenuItemPress('language')}
          />
        </SectionCard>

        <SectionCard title="SUPPORT & LÉGAL">
          <MenuItem
            icon="help-circle-outline"
            title="Aide et Support"
            onPress={() => handleMenuItemPress('help-support')}
          />
          
          <MenuItem
            icon="information-circle-outline"
            title="À propos"
            onPress={() => handleMenuItemPress('about')}
          />
        </SectionCard>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: dangerColor }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: textColor }]}>
          Version de l&apos;application 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileArrow: {
    position: 'absolute',
    right: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
    paddingBottom: 20,
  },
});

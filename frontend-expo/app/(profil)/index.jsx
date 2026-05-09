import { DraggableBottomSheet } from "@/components/DraggableBottomSheet";
import { Header } from "@/components/Header";
import { MenuItem } from "@/components/MenuItem";
import { ProfileSection } from "@/components/ProfileSection";
import { SectionCard } from "@/components/SectionCard";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({ light: true }, "background");
  const textColor = useThemeColor({ light: true }, "text");
  const borderColor = useThemeColor({ light: true }, "border");
  const dangerColor = "#FF3B30";
  const { profile, isLoading, error, updateBiometric } = useUserProfile();
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleNotificationPress = () => {
    router.push("/(profil)/notifications");
  };

  const handleEditProfile = () => {
    setEditSheetOpen(true);
  };

  const handleMenuItemPress = (item) => {
    switch (item) {
      case "personal-info":
        router.push("/(profil)/settings");
        return;
      case "notification-prefs":
        router.push("/(profil)/notifications");
        return;
      case "language-currency":
        router.push("/(profil)/settings");
        return;
      case "change-password":
        router.push("/(profil)/settings");
        return;
      case "connected-devices":
        router.push("/(profil)/settings");
        return;
      case "full-history":
        router.push("/transaction/history");
        return;
      default:
        router.push("/(profil)/settings");
    }
  };

  const handleBiometricToggle = (value) => {
    updateBiometric(value);
  };

  const handleLogout = () => {
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: "#FFFFFF" }}>
      <Header
        title="Profil"
        onBackPress={handleBackPress}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : error ? (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>Erreur: {error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => router.replace("/(profil)/index")}
            >
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ProfileSection
            name={profile?.name ?? "—"}
            phone={profile?.phone ?? "—"}
            onEditPress={handleEditProfile}
          />
        )}

        <SectionCard title="Gestion du compte">
          <MenuItem
            icon="person-outline"
            title="Informations personnelles"
            onPress={() => handleMenuItemPress("personal-info")}
          />
          <MenuItem
            icon="notifications-outline"
            title="Préférences de notification"
            onPress={() => handleMenuItemPress("notification-prefs")}
          />
          <MenuItem
            icon="language-outline"
            title="Langue et devise"
            onPress={() => handleMenuItemPress("language-currency")}
          />
        </SectionCard>

        <SectionCard title="Sécurité">
          <MenuItem
            icon="lock-closed-outline"
            title="Changer le mot de passe"
            onPress={() => handleMenuItemPress("change-password")}
          />
          <MenuItem
            icon="finger-print-outline"
            title="Authentification biométrique"
            showToggle={true}
            toggleValue={profile?.biometricEnabled ?? false}
            onToggleChange={handleBiometricToggle}
          />
          <MenuItem
            icon="phone-portrait-outline"
            title="Appareils connectés"
            onPress={() => handleMenuItemPress("connected-devices")}
          />
        </SectionCard>

        <SectionCard title="Résumé de l'activité">
          <View style={[styles.activityCard, { backgroundColor, borderColor }]}>
            <View style={styles.activityHeader}>
              <Text style={[styles.activityTitle, { color: textColor }]}>
                Dernière transaction
              </Text>
              <Text style={[styles.activityAmount, { color: dangerColor }]}>
                -15.00€
              </Text>
            </View>
            <Text style={[styles.activityDescription, { color: textColor }]}>
              Achat sur Amazon.com
            </Text>
          </View>

          <TouchableOpacity
            style={{ backgroundColor: "#4169E1", ...styles.logoutButton }}
            onPress={handleLogout}
          >
            <Text style={{ ...styles.logoutText, color: "#FFFFFF" }}>
              Voir l&apos;historique complet
            </Text>
          </TouchableOpacity>
        </SectionCard>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF5733" />
          <Text style={{ ...styles.logoutText, color: "#FF5733" }}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <DraggableBottomSheet
        open={editSheetOpen}
        onClose={() => setEditSheetOpen(false)}
        snapPoints={["40%", "70%", "90%"]}
      >
        <View style={styles.sheetInner}>
          <Text style={styles.sheetTitle}>Modifier le profil</Text>
          <Text style={styles.sheetBody}>
            Ici vous brancherez le formulaire (nom, téléphone, etc.) sur
            l&apos;API.
          </Text>

          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => {
              setEditSheetOpen(false);
              Alert.alert("Formulaire", "Action de modification à brancher.");
            }}
          >
            <Text style={styles.primaryActionText}>Ouvrir le formulaire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => setEditSheetOpen(false)}
          >
            <Text style={styles.secondaryActionText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </DraggableBottomSheet>
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
  activityCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  activityDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    padding: 20,
    opacity: 0.7,
  },
  errorRow: {
    padding: 10,
    gap: 12,
  },
  errorText: {
    opacity: 0.8,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#0a7ea4",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  sheetInner: {
    gap: 12,
    paddingTop: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  sheetBody: {
    opacity: 0.85,
    lineHeight: 20,
  },
  primaryAction: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#0a7ea4",
    marginTop: 6,
  },
  primaryActionText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
  },
  secondaryAction: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  secondaryActionText: {
    fontWeight: "700",
    textAlign: "center",
    opacity: 0.8,
  },
});

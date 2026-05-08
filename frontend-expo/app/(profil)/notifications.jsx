import { DraggableBottomSheet } from "@/components/DraggableBottomSheet";
import { Header } from "@/components/Header";
import { NotificationCard } from "@/components/NotificationCard";
import { SectionCard } from "@/components/SectionCard";
import { TabSelector } from "@/components/TabSelector";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useNotifications } from "@/hooks/useNotifications";
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

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("Tous");
  const tabs = ["Tous", "Transactions", "Sécurité"];

  const backgroundColor = useThemeColor({}, "background");

  const { data: notifications, isLoading, error, refetch } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const isSheetOpen = !!selectedNotification;

  const handleBackPress = () => {
    router.back();
  };

  const handleNotificationPress = () => {
    // Already on notifications; keeping it consistent with the header.
    Alert.alert(
      "Notifications",
      "Vous êtes déjà sur la page des notifications.",
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNotificationCardPress = (notification) => {
    setSelectedNotification(notification);
  };

  const currentNotifications =
    activeTab === "Tous"
      ? notifications
      : activeTab === "Transactions"
        ? notifications.filter((n) => n.kind === "payment")
        : notifications.filter((n) => n.kind === "security");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Header
        title="Notifications"
        onBackPress={handleBackPress}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
      />

      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SectionCard style={{ marginHorizontal: 2 }}>
          {isLoading ? (
            <Text style={styles.loadingText}>Chargement...</Text>
          ) : error ? (
            <View style={styles.errorRow}>
              <Text style={styles.errorText}>Erreur: {error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {currentNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  icon={notification.icon}
                  iconColor={notification.iconColor}
                  title={notification.title}
                  description={notification.description}
                  timestamp={notification.timestamp}
                  isUnread={notification.isUnread}
                  onPress={() => handleNotificationCardPress(notification)}
                />
              ))}
            </View>
          )}
        </SectionCard>
      </ScrollView>

      <DraggableBottomSheet
        open={isSheetOpen}
        onClose={() => setSelectedNotification(null)}
        snapPoints={["25%", "50%", "85%"]}
      >
        {selectedNotification ? (
          <View style={styles.sheetInner}>
            <Text style={styles.sheetTitle}>{selectedNotification.title}</Text>
            <Text style={styles.sheetTimestamp}>
              {selectedNotification.timestamp}
            </Text>
            <Text style={styles.sheetBody}>
              {selectedNotification.description}
            </Text>

            <View style={styles.sheetActions}>
              {selectedNotification.kind === "payment" ? (
                <TouchableOpacity
                  style={styles.primaryAction}
                  onPress={() => {
                    setSelectedNotification(null);
                    router.push("/transaction/history");
                  }}
                >
                  <Text style={styles.primaryActionText}>
                    Voir l&apos;historique
                  </Text>
                </TouchableOpacity>
              ) : null}

              {selectedNotification.kind === "security" ? (
                <TouchableOpacity
                  style={styles.primaryAction}
                  onPress={() => {
                    setSelectedNotification(null);
                    router.push("/(profil)/settings");
                  }}
                >
                  <Text style={styles.primaryActionText}>Ouvrir Sécurité</Text>
                </TouchableOpacity>
              ) : null}

              {selectedNotification.kind === "info" ? (
                <TouchableOpacity
                  style={styles.primaryAction}
                  onPress={() => {
                    setSelectedNotification(null);
                    router.push("/(profil)/support-client");
                  }}
                >
                  <Text style={styles.primaryActionText}>
                    Contacter le support
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.secondaryAction}
                onPress={() => setSelectedNotification(null)}
              >
                <Text style={styles.secondaryActionText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
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
    paddingTop: 0,
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
    gap: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  sheetTimestamp: {
    opacity: 0.6,
  },
  sheetBody: {
    opacity: 0.9,
    lineHeight: 20,
    marginTop: 6,
  },
  sheetActions: {
    gap: 12,
    marginTop: 16,
  },
  primaryAction: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#0a7ea4",
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

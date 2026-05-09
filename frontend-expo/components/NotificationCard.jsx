import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const NotificationCard = ({
  icon,
  iconColor,
  title,
  description,
  timestamp,
  isUnread = false,
  onPress,
}) => {
  const scheme = useColorScheme() ?? "light";
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const unreadColor = useThemeColor({}, "tint");
  // Subtle "card" background independent of theme tint format.
  const cardBackground =
    scheme === "light" ? "rgba(10,126,164,0.06)" : "rgba(255,255,255,0.04)";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: cardBackground, borderColor },
      ]}
      onPress={onPress}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text
          style={[styles.description, { color: textColor }]}
          numberOfLines={2}
        >
          {description}
        </Text>
        <Text style={[styles.timestamp, { color: textColor }]}>
          {timestamp}
        </Text>
      </View>

      {isUnread && (
        <View style={[styles.unreadDot, { backgroundColor: unreadColor }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 0,
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
});

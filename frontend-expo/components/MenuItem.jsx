import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showToggle = false,
  toggleValue = false,
  onToggleChange,
  rightComponent = null,
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
      disabled={showToggle}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: "#F0F8FF" }]}>
          <Ionicons name={icon} size={20} color="#4169E1" />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textColor }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightContent}>
        {rightComponent}
        {showToggle ? (
          <Switch value={toggleValue} onValueChange={onToggleChange} />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});

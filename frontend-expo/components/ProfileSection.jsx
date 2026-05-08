import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DEFAULT_AVATAR_URI =
  "https://as2.ftcdn.net/v2/jpg/01/18/63/09/1000_F_118630957_MvuK2rw0Avyp3HwlARVQWx7M3edlC4oO.jpg";

export const ProfileSection = ({
  name,
  phone,
  onEditPress,
  showEditIcon = true,
  avatarUri = DEFAULT_AVATAR_URI,
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          {showEditIcon && (
            <TouchableOpacity style={styles.editIcon} onPress={onEditPress}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: textColor }]}>{name}</Text>
          <Text style={[styles.phone, { color: textColor }]}>{phone}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: "#FF69B4",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    textColor: "#FFFFFF",
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
  },
  phone: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 5,
  },
});

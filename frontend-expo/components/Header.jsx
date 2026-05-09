import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Header = ({ title, onBackPress, showNotification = false, onNotificationPress }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: Math.max(insets.top, 16) + (Platform.OS === 'ios' ? 4 : 2),
        },
      ]}
    >
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={iconColor} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      
      {showNotification && (
        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      )}
      
      {!showNotification && <View style={styles.placeholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  },
});

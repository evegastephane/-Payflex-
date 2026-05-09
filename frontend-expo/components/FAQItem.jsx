import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FAQItem = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={[styles.container, { backgroundColor, borderBottomColor: borderColor }]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={[styles.question, { color: textColor }]}>{question}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={iconColor} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          <Text style={[styles.answer, { color: textColor }]}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});

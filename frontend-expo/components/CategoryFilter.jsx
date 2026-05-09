import { useThemeColor } from '@/hooks/use-theme-color';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const activeColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.category,
            { 
              backgroundColor: activeCategory === category ? activeColor : `${textColor}10`,
              borderColor: activeCategory === category ? activeColor : borderColor
            }
          ]}
          onPress={() => onCategoryChange(category)}
        >
          <Text 
            style={[
              styles.categoryText, 
              { color: activeCategory === category ? '#ffffff' : textColor }
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

import { CategoryFilter } from '@/components/CategoryFilter';
import { FAQItem } from '@/components/FAQItem';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { SectionCard } from '@/components/SectionCard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSupportFaq } from '@/hooks/useSupportFaq';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DraggableBottomSheet } from '@/components/DraggableBottomSheet';

export default function SupportClientScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const categories = ['Tous', 'Gestion du Compte', 'Paiements', 'Sécurité'];
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'tint');

  const { data: faqData, isLoading, error, refetch } = useSupportFaq();

  const [contactSheetOpen, setContactSheetOpen] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleContactSupport = () => {
    setContactSheetOpen(true);
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'Tous' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Header 
        title="Support Client" 
        onBackPress={handleBackPress}
      />
      
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder="Rechercher une question..."
      />
      
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SectionCard title="Questions fréquentes">
          {isLoading ? (
            <Text style={styles.loadingText}>Chargement...</Text>
          ) : error ? (
            <View style={styles.errorRow}>
              <Text style={styles.errorText}>Erreur: {error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : filteredFAQ.length === 0 ? (
            <Text style={[styles.loadingText, { opacity: 0.7 }]}>Aucune réponse trouvée.</Text>
          ) : (
            filteredFAQ.map((item) => (
              <FAQItem
                key={item.id}
                question={item.question}
                answer={item.answer}
              />
            ))
          )}
        </SectionCard>

        <View style={[styles.contactSection, { backgroundColor, borderColor }]}>
          <Text style={[styles.contactTitle, { color: textColor }]}>Contactez le Support</Text>
          <Text style={[styles.contactDescription, { color: textColor }]}>
            Notre équipe d&apos;assistance est disponible 24/7 pour vous aider
          </Text>
          
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: primaryColor }]} 
            onPress={handleContactSupport}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#ffffff" />
            <Text style={styles.contactButtonText}>Discuter avec un agent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DraggableBottomSheet
        open={contactSheetOpen}
        onClose={() => setContactSheetOpen(false)}
        snapPoints={['30%', '60%', '90%']}
      >
        <View style={styles.sheetInner}>
          <Text style={styles.sheetTitle}>Par où souhaitez-vous être aidé ?</Text>
          <Text style={styles.sheetBody}>
            Vous pourrez connecter un chat (ou un appel) dès que la fonctionnalité est prête côté backend.
          </Text>

          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => {
              setContactSheetOpen(false);
              Alert.alert('Chat', 'Ouverture du chat avec un agent (à brancher à l’API).');
            }}
          >
            <Text style={styles.primaryActionText}>Ouvrir le chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => {
              setContactSheetOpen(false);
              Alert.alert('Appel', 'Ouverture d’un appel (à brancher à l’API).');
            }}
          >
            <Text style={styles.secondaryActionText}>Demander un rappel</Text>
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
  contactSection: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#0a7ea4',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  sheetInner: {
    gap: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sheetBody: {
    opacity: 0.85,
    lineHeight: 20,
  },
  primaryAction: {
    marginTop: 6,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#0a7ea4',
  },
  primaryActionText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
  secondaryAction: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  secondaryActionText: {
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.8,
  },
});

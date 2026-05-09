import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'react-native';
import { Logo } from '@/constants/images';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = (): void => {
    console.log('Email:', email, 'Password:', password);
  };

  // Fonction pour rediriger vers la page Mot de passe oublié
  const handleForgotPassword = (): void => {
    router.push('/(auth)/Forgot');
  };

  // Fonction pour rediriger vers la page d'inscription
  const handleSignUp = (): void => {
    router.push('/(auth)/sign-up');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8EBF5" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Logo */}
          <View style={styles.logoCircle}>
            <Image source={Logo} style={styles.logoImage} />
          </View>

          {/* ── Titre + Sous-titre ── */}
          <Text style={styles.brandName}>Connectez-vous à votre compte</Text>
          <Text style={styles.tagline}>Bienvenue, veuillez entrer vos informations.</Text>

          {/* ── Carte blanche formulaire ── */}
          <View style={styles.card}>

            {/* Champ Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Adresse e-mail</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Text style={[styles.inputIcon, emailFocused && styles.inputIconFocused]}>@</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="name@payflex.com"
                  placeholderTextColor="#B0B8CC"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Champ Password avec lien Mot de passe oublié */}
            <View style={styles.fieldGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.fieldLabel}>Mot de passe</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Mot de passe oublié?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Text style={[styles.inputIcon, passwordFocused && styles.inputIconFocused]}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#B0B8CC"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  activeOpacity={0.6}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stay logged in */}
            <TouchableOpacity
              style={styles.stayLoggedRow}
              onPress={() => setStayLoggedIn(prev => !prev)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, stayLoggedIn && styles.checkboxActive]}>
                {stayLoggedIn && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.stayLoggedText}>Se souvenir de moi</Text>
            </TouchableOpacity>

            {/* Bouton Se Connecter */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={(handleLogin)=>router.push('(tabs)/wallet')}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
              >
                <Text style={styles.loginButtonText}>Se Connecter</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Séparateur */}
            <View style={styles.separator} />

            {/* Lien S'inscrire */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Vous n'avez pas de compte ? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={handleSignUp}>
                <Text style={styles.signupLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#E8EBF5' },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9BA3BF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  logoImage: { width: 50, height: 50, resizeMode: 'contain' },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D2E',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.1,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: '#9BA3BF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 28,
  },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotText: { fontSize: 10, fontWeight: '700', color: '#2B4EFF', letterSpacing: 1.2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F8',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: '#2B4EFF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2B4EFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: { fontSize: 16, color: '#9CA3AF', marginRight: 10, width: 20, textAlign: 'center' },
  inputIconFocused: { color: '#2B4EFF' },
  textInput: { flex: 1, fontSize: 15, color: '#1A1D2E', height: '100%', paddingVertical: 0 },
  eyeButton: { padding: 4, marginLeft: 8 },
  eyeIcon: { fontSize: 16, color: '#9CA3AF' },
  stayLoggedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: { backgroundColor: '#2B4EFF', borderColor: '#2B4EFF' },
  checkmark: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },
  stayLoggedText: { fontSize: 14, color: '#6B7280' },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#0D68F8',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0D68F8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.40,
    shadowRadius: 18,
    elevation: 10,
    marginBottom: 24,
  },
  loginButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  separator: { width: '100%', height: 1, backgroundColor: '#F0F1F5', marginBottom: 20 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 0 },
  signupText: { fontSize: 14, color: '#6B7280' },
  signupLink: { fontSize: 14, color: '#2B4EFF', fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerIcon: { fontSize: 12, marginRight: 5 },
  footerText: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', letterSpacing: 1.0 },
  footerDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#9CA3AF', marginHorizontal: 12 },
});
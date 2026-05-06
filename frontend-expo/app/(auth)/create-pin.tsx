import { Logo } from '@/constants/images';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Vibration,
} from 'react-native';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');

// ─── Taille des touches adaptée à l'écran ────────────────────────────────────
const KEY_SIZE = Math.min(width * 0.22, 80); // max 80px sur grand écran

// ─── Types ───────────────────────────────────────────────────────────────────

type KeyType = '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'0'|'bio'|'del';

interface KeyPadKey {
  value: KeyType;
  label: string;
  sub?: string;
}

// ─── Données clavier ─────────────────────────────────────────────────────────

const KEYS: KeyPadKey[][] = [
  [
    { value: '1', label: '1', sub: '' },
    { value: '2', label: '2', sub: 'ABC' },
    { value: '3', label: '3', sub: 'DEF' },
  ],
  [
    { value: '4', label: '4', sub: 'GHI' },
    { value: '5', label: '5', sub: 'JKL' },
    { value: '6', label: '6', sub: 'MNO' },
  ],
  [
    { value: '7', label: '7', sub: 'PQRS' },
    { value: '8', label: '8', sub: 'TUV' },
    { value: '9', label: '9', sub: 'WXYZ' },
  ],
  [
    { value: 'bio', label: '☻', sub: '' },
    { value: '0',   label: '0', sub: '' },
    { value: 'del', label: '⌫', sub: '' },
  ],
];

const PIN_LENGTH = 6;

// ─── Point PIN ───────────────────────────────────────────────────────────────

const PinDot: React.FC<{ filled: boolean; active: boolean }> = ({ filled, active }) => (
  <View
    style={[
      dotStyles.dot,
      filled  && dotStyles.dotFilled,
      active  && dotStyles.dotActive,
    ]}
  />
);

// ─── Touche clavier ───────────────────────────────────────────────────────────

const KeyButton: React.FC<{
  keyData: KeyPadKey;
  onPress: (val: KeyType) => void;
}> = ({ keyData, onPress }) => {
  const isSpecial = keyData.value === 'bio' || keyData.value === 'del';

  return (
    <TouchableOpacity
      onPress={() => onPress(keyData.value)}
      activeOpacity={0.7}
      style={keyStyles.wrapper}
    >
      <View style={[keyStyles.key, isSpecial && keyStyles.keySpecial]}>
        {keyData.value === 'bio' ? (
            <MaterialIcons name='fingerprint' size={28} color="#2B4EFF" />
        ) : keyData.value === 'del' ? (
            <MaterialIcons name="backspace" size={24} color="#6B7280" />
        ) : (
          <>
            <Text style={keyStyles.keyNumber}>{keyData.label}</Text>
            {keyData.sub ? (
              <Text style={keyStyles.keySub}>{keyData.sub}</Text>
            ) : null}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Écran principal ──────────────────────────────────────────────────────────

const PinLoginScreen: React.FC = () => {
  const [pin, setPin] = useState<string>('');

  const handleKey = (val: KeyType): void => {
    if (val === 'bio') {
      console.log('Biométrie');
      return;
    }
    if (val === 'del') {
      setPin(prev => prev.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + val;
    setPin(newPin);

    if (newPin.length === PIN_LENGTH) {
      setTimeout(() => {
        if (newPin === '123456') {
          console.log('✅ PIN correct');
          // navigation.navigate('Home');
        } else {
          Vibration.vibrate([0, 80, 80, 80, 80]);
          setPin('');
        }
      }, 200);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2FA" />

      {/* ── Corps ── */}
      <View style={styles.body}>

        {/* Logo */}
        <View style={styles.logoCircle}>
            <Image source={Logo} style={styles.logoImage} />
        </View>

        {/* Textes */}
        <Text style={styles.welcomeTitle}>Welcome back, Julian</Text>
        <Text style={styles.welcomeSub}>Enter your PIN to access your vault</Text>

        {/* Points PIN */}
        <View style={styles.dotsRow}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <PinDot
              key={i}
              filled={i < pin.length}
              active={i === pin.length - 1 && pin.length > 0}
            />
          ))}
        </View>

      </View>

      {/* ── Clavier ── */}
      <View style={styles.keypad}>
        {KEYS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map(key => (
              <KeyButton key={key.value} keyData={key} onPress={handleKey} />
            ))}
          </View>
        ))}
      </View>

      {/* ── Forgot PIN ── */}
      <TouchableOpacity style={styles.forgotButton} activeOpacity={0.7}>
        <Link href='/(auth)/forgot-password'><Text style={styles.forgotText}>Forgot PIN?</Text></Link>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default PinLoginScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2FA',
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 4,
  },
  headerIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B4EFF',
    letterSpacing: 0.2,
  },

  // Corps
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    width: '100%',
    gap: 16
  },

  // Logo
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#9BA3BF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'contain',
  },

  // Textes
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1D2E',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },

  // Points PIN — marginHorizontal à la place de gap
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Clavier — paddingHorizontal fixe à la place de gap/flex
  keypad: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 8,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // Forgot
  forgotButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  forgotText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2B4EFF',
    letterSpacing: 0.1,
  },
});

// ─── Points PIN ───────────────────────────────────────────────────────────────

const dotStyles = StyleSheet.create({
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: 'transparent',
    marginHorizontal: 8,   // ← remplace gap
  },
  dotFilled: {
    backgroundColor: '#2B4EFF',
    borderColor: '#2B4EFF',
  },
  dotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

// ─── Clavier ─────────────────────────────────────────────────────────────────

const keyStyles = StyleSheet.create({

  // wrapper prend 1/3 de la largeur
  wrapper: {
    width: KEY_SIZE + 16,
    alignItems: 'center',
  },

  // cercle fixe — plus de aspectRatio
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9BA3BF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  keySpecial: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyNumber: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1A1D2E',
  },
  keySub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  bioIcon: {
    fontSize: 26,
    color: '#2B4EFF',
  },
  delIcon: {
    fontSize: 22,
    color: '#6B7280',
  },
});
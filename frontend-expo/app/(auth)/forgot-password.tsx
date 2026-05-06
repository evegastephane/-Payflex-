import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Vibration,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BOX_SIZE  = Math.min((width - 48 - 50) / 6, 52);
const CODE_LENGTH   = 6;
const RESEND_SECONDS = 45;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  navigation?: any;
  route?: { params?: { email?: string } };
}

// ─── Composant case OTP ───────────────────────────────────────────────────────

const OtpBox: React.FC<{
  char: string;
  filled: boolean;
  active: boolean;
  error: boolean;
}> = ({ char, filled, active, error }) => (
  <View
    style={[
      otpStyles.box,
      filled  && otpStyles.boxFilled,
      active  && otpStyles.boxActive,
      error   && otpStyles.boxError,
    ]}
  >
    {filled ? (
      <Text style={otpStyles.digit}>{char}</Text>
    ) : (
      <View style={[otpStyles.dot, error && otpStyles.dotError]} />
    )}
  </View>
);

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function VerificationScreen({ navigation, route }: Props) {
  const email = route?.params?.email ?? 'marie.akamba@gmail.com';

  const [code, setCode]           = useState<string>('');
  const [timer, setTimer]         = useState<number>(RESEND_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [error, setError]         = useState<boolean>(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Compte à rebours ──────────────────────────────────────────────────────
  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Shake + reset en cas d'erreur ─────────────────────────────────────────
  const triggerShake = (): void => {
    Vibration.vibrate([0, 60, 60, 60]);
    setError(true);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => { setCode(''); setError(false); }, 400);
    });
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validateCode = (entered: string): void => {
    if (entered === '123456') {
      navigation?.navigate('PinLogin');
    } else {
      triggerShake();
    }
  };

  // ── Appui sur une touche du clavier intégré ───────────────────────────────
  const handleKey = (val: string): void => {
    setError(false);
    if (val === 'del') { setCode(prev => prev.slice(0, -1)); return; }
    if (code.length >= CODE_LENGTH) return;
    const next = code + val;
    setCode(next);
    if (next.length === CODE_LENGTH) setTimeout(() => validateCode(next), 250);
  };

  // ── Renvoi du code ────────────────────────────────────────────────────────
  const handleResend = (): void => {
    if (!canResend) return;
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setCode('');
    setError(false);
    console.log('Code renvoyé à', email);
  };

  const formatTimer = (s: number): string =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ── Clavier numérique ─────────────────────────────────────────────────────
  const KEYS = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    ['del','0','ok'],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2FA" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#2B4EFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Corps ── */}
      <View style={styles.body}>

        {/* Icône bouclier avec cadenas */}
        <View style={styles.logoCircle}>
          <MaterialIcons name="shield" size={44} color="#2B4EFF" />
          <View style={styles.lockBadge}>
            <MaterialIcons name="lock" size={14} color="#FFFFFF" />
          </View>
        </View>

        {/* Titre */}
        <Text style={styles.textTitle}>Confirm Identity</Text>
        <Text style={styles.textSub}>Enter the 6-digit code sent to</Text>
        <Text style={[styles.textSub, styles.textEmail]}>{email}</Text>

        {/* Cases OTP avec animation shake */}
        <Animated.View
          style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}
        >
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <OtpBox
              key={i}
              char={code[i] ?? ''}
              filled={i < code.length}
              active={i === code.length && !error}
              error={error}
            />
          ))}
        </Animated.View>

        {/* Message erreur */}
        {error && (
          <Text style={styles.errorMsg}>Code incorrect. Réessayez.</Text>
        )}

        {/* Resend */}
        <TouchableOpacity onPress={handleResend} activeOpacity={canResend ? 0.7 : 1}>
          <Text style={[styles.resendText, !canResend && styles.resendDisabled]}>
            Resend Code
          </Text>
        </TouchableOpacity>
        {!canResend && (
          <Text style={styles.timerText}>RESEND IN {formatTimer(timer)}</Text>
        )}

        {/* Bouton Verify — visible dès que 6 chiffres saisis */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            code.length < CODE_LENGTH && styles.verifyButtonDisabled,
          ]}
          onPress={() => code.length === CODE_LENGTH && validateCode(code)}
          activeOpacity={0.85}
          disabled={code.length < CODE_LENGTH}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

      </View>

      {/* ── Clavier numérique ── */}
      <View style={styles.keypad}>
        {KEYS.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.keyRow}>
            {row.map(k => {
              const isAction = k === 'del' || k === 'ok';
              return (
                <TouchableOpacity
                  key={k}
                  style={[keyStyles.key, isAction && keyStyles.keyAction]}
                  onPress={() => handleKey(k)}
                  activeOpacity={0.6}
                >
                  {k === 'del' ? (
                    <MaterialIcons name="backspace" size={22} color="#6B7280" />
                  ) : k === 'ok' ? (
                    <MaterialIcons name="check" size={22} color="#2B4EFF" />
                  ) : (
                    <Text style={keyStyles.keyLabel}>{k}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

    </SafeAreaView>
  );
}

// ─── Styles principaux ────────────────────────────────────────────────────────

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
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1D2E',
  },

  // Corps
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
    width: '100%',
  },

  // Logo bouclier
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#9BA3BF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Textes
  textTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1D2E',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  textSub: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  textEmail: {
    color: '#1A1D2E',
    fontWeight: '600',
    marginBottom: 28,
  },

  // OTP row
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  // Erreur
  errorMsg: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 10,
    fontWeight: '500',
  },

  // Resend
  resendText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2B4EFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  resendDisabled: {
    color: '#9CA3AF',
  },
  timerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginBottom: 24,
  },

  // Bouton Verify
  verifyButton: {
    width: width - 48,
    height: 56,
    backgroundColor: '#2B4EFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2B4EFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
  verifyButtonDisabled: {
    backgroundColor: '#93A8FF',
    shadowOpacity: 0.12,
    elevation: 2,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Clavier
  keypad: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

// ─── Styles cases OTP ─────────────────────────────────────────────────────────

const otpStyles = StyleSheet.create({
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: BOX_SIZE / 2,   // cercle comme dans le design
    backgroundColor: '#E8EBF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  boxFilled: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#9BA3BF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  boxActive: {
    borderWidth: 2,
    borderColor: '#2B4EFF',
    backgroundColor: '#FFFFFF',
  },
  boxError: {
    borderWidth: 2,
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  digit: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B0B8CC',
  },
  dotError: {
    backgroundColor: '#EF4444',
  },
});

// ─── Styles clavier ───────────────────────────────────────────────────────────

const KEY_SIZE = Math.min(width * 0.20, 70);

const keyStyles = StyleSheet.create({
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9BA3BF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  keyAction: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyLabel: {
    fontSize: 24,
    fontWeight: '300',
    color: '#1A1D2E',
  },
});
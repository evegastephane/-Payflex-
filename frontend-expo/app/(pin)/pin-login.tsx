import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Vibration,
    Platform,
    ActivityIndicator,
    Animated,
} from 'react-native';


const API_BASE_URL = 'http://192.168.1.116:8080';
interface PinSuccessResponse {
    success: true;
    token: string;
    utilisateur: { id: string; nom: string; email: string };
}

interface PinErrorDetail {
    code: 'WRONG_PIN' | 'ACCOUNT_LOCKED';
    message: string;
    tentatives_restantes?: number;
    secondes_restantes?: number;
}

const apiVerifyPIN = async (pin: string): Promise<PinSuccessResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
    });

    const data = await response.json();

    if (!response.ok) {
        // FastAPI retourne { detail: { code, message, ... } }
        const detail: PinErrorDetail = data.detail ?? { code: 'WRONG_PIN', message: 'Erreur inconnue' };
        throw detail;
    }

    return data as PinSuccessResponse;
};


type PinState = 'idle' | 'loading' | 'success' | 'error' | 'locked';

const PIN_LENGTH = 4;


const BoltIcon = () => <Text style={{ fontSize: 28, color: '#2563EB' }}>⚡</Text>;
const FingerprintIcon = () => <Text style={{ fontSize: 28, color: '#2563EB' }}>👆</Text>;
const BackspaceIcon = () => <Text style={{ fontSize: 20, color: '#374151' }}>⌫</Text>;

interface PinDotProps { filled: boolean; state: PinState }

const PinDot: React.FC<PinDotProps> = ({ filled, state }) => (
    <View style={[
        styles.dot,
        filled && styles.dotFilled,
        filled && state === 'error'   && styles.dotError,
        filled && state === 'locked'  && styles.dotLocked,
        filled && state === 'success' && styles.dotSuccess,
    ]} />
);


interface KeypadButtonProps {
    value: string;
    sub?: string;
    onPress: (val: string) => void;
    special?: 'fingerprint' | 'backspace';
    disabled?: boolean;
}

const KeypadButton: React.FC<KeypadButtonProps> = ({ value, sub, onPress, special, disabled = false }) => {
    const handlePress = () => {
        if (disabled) return;
        if (Platform.OS === 'android') Vibration.vibrate(30);
        onPress(value);
    };

    if (special === 'fingerprint') {
        return (
            <TouchableOpacity style={[styles.keypadSpecial, disabled && styles.keypadDisabled]} onPress={handlePress} activeOpacity={0.6} disabled={disabled}>
                <FingerprintIcon />
            </TouchableOpacity>
        );
    }

    if (special === 'backspace') {
        return (
            <TouchableOpacity style={[styles.keypadSpecial, disabled && styles.keypadDisabled]} onPress={handlePress} activeOpacity={0.6} disabled={disabled}>
                <BackspaceIcon />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={[styles.keypadButton, disabled && styles.keypadDisabled]} onPress={handlePress} activeOpacity={0.7} disabled={disabled}>
            <Text style={[styles.keypadNumber, disabled && styles.textDisabled]}>{value}</Text>
            {sub ? <Text style={[styles.keypadSub, disabled && styles.textDisabled]}>{sub}</Text> : null}
        </TouchableOpacity>
    );
};


const SecurePINLogin: React.FC = () => {
    const [pin, setPin] = useState('');
    const [pinState, setPinState] = useState<PinState>('idle');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [countdown, setCountdown] = useState(0);


    const shakeX = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setPinState('idle');
                    setFeedbackMessage('');
                    setPin('');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const shake = () => {
        shakeX.setValue(0);
        Animated.sequence([
            Animated.timing(shakeX, { toValue: 12,  duration: 55, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: -12, duration: 55, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 8,   duration: 55, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: -8,  duration: 55, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 0,   duration: 55, useNativeDriver: true }),
        ]).start();
    };

    const resetToIdle = (delay = 1400) => {
        setTimeout(() => {
            setPin('');
            setPinState('idle');
            setFeedbackMessage('');
        }, delay);
    };

    const handleKey = async (val: string) => {
        if (pinState === 'loading' || pinState === 'locked' || pinState === 'success') return;

        if (val === 'DEL') {
            if (pinState === 'error') { setPinState('idle'); setFeedbackMessage(''); }
            setPin(prev => prev.slice(0, -1));
            return;
        }

        if (val === 'FP') {
            // TODO : intégrer react-native-biometrics
            return;
        }

        if (pin.length < PIN_LENGTH) {
            const next = pin + val;
            setPin(next);
            if (next.length === PIN_LENGTH) {
                await submitPIN(next);
            }
        }
    };

    const submitPIN = async (enteredPin: string) => {
        setPinState('loading');
        setFeedbackMessage('');

        try {
            const result = await apiVerifyPIN(enteredPin);


            setPinState('success');
            setFeedbackMessage(`Bienvenue, ${result.utilisateur.nom} !`);
            // TODO: stocker result.token (AsyncStorage / SecureStore)
            // TODO: navigation.replace('Home')

        } catch (err: any) {
            const detail = err as PinErrorDetail;

            if (detail.code === 'ACCOUNT_LOCKED') {

                setPinState('locked');
                setCountdown(detail.secondes_restantes ?? 300);
                setFeedbackMessage(detail.message);
                setPin('');
                if (Platform.OS === 'android') Vibration.vibrate([0, 80, 60, 80]);

            } else if (detail.code === 'WRONG_PIN') {

                setPinState('error');
                shake();
                const restantes = detail.tentatives_restantes ?? 0;
                setFeedbackMessage(
                    restantes > 0
                        ? `PIN incorrect — ${restantes} tentative${restantes > 1 ? 's' : ''} restante${restantes > 1 ? 's' : ''}`
                        : detail.message
                );
                if (Platform.OS === 'android') Vibration.vibrate(200);
                resetToIdle();

            } else {

                setPinState('error');
                shake();
                setFeedbackMessage('Erreur de connexion. Vérifiez votre réseau.');
                if (Platform.OS === 'android') Vibration.vibrate(200);
                resetToIdle();
            }
        }
    };

    const isKeypadDisabled = pinState === 'loading' || pinState === 'locked' || pinState === 'success';

    const keyRows = [
        [{ value: '1', sub: '' }, { value: '2', sub: 'ABC' }, { value: '3', sub: 'DEF' }],
        [{ value: '4', sub: 'GHI' }, { value: '5', sub: 'JKL' }, { value: '6', sub: 'MNO' }],
        [{ value: '7', sub: 'PQRS' }, { value: '8', sub: 'TUV' }, { value: '9', sub: 'WXYZ' }],
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F8" />


            <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                    <BoltIcon />
                </View>
            </View>


            <Text style={styles.welcomeTitle}>Welcome back, Julian</Text>
            <Text style={styles.welcomeSubtitle}>Enter your PIN to access your vault</Text>

            {/* Dots + animation secousse */}
            <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeX }] }]}>
                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                    <PinDot key={i} filled={i < pin.length} state={pinState} />
                ))}
            </Animated.View>

            {/* Message de feedback */}
            <View style={styles.feedbackContainer}>
                {pinState === 'loading' ? (
                    <ActivityIndicator size="small" color="#2563EB" />
                ) : feedbackMessage ? (
                    <Text style={[
                        styles.feedbackText,
                        pinState === 'success'                        && styles.feedbackSuccess,
                        (pinState === 'error' || pinState === 'locked') && styles.feedbackError,
                    ]}>
                        {pinState === 'locked' ? ` ${feedbackMessage} (${countdown}s)` : feedbackMessage}
                    </Text>
                ) : null}
            </View>

            {/* Keypad */}
            <View style={styles.keypad}>
                {keyRows.map((row, rowIdx) => (
                    <View key={rowIdx} style={styles.keypadRow}>
                        {row.map(key => (
                            <KeypadButton key={key.value} value={key.value} sub={key.sub} onPress={handleKey} disabled={isKeypadDisabled} />
                        ))}
                    </View>
                ))}
                <View style={styles.keypadRow}>
                    <KeypadButton value="FP"  onPress={handleKey} special="fingerprint" disabled={isKeypadDisabled} />
                    <KeypadButton value="0"   onPress={handleKey} disabled={isKeypadDisabled} />
                    <KeypadButton value="DEL" onPress={handleKey} special="backspace"   disabled={isKeypadDisabled} />
                </View>
            </View>

            {/* Forgot PIN */}
            <TouchableOpacity style={styles.forgotContainer} activeOpacity={0.7} disabled={isKeypadDisabled}>
                <Text style={[styles.forgotText, isKeypadDisabled && { opacity: 0.4 }]}>Forgot PIN?</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const BLUE    = '#2563EB';
const BG      = '#F3F4F8';
const CARD_BG = '#FFFFFF';
const TEXT_DARK  = '#111827';
const TEXT_MUTED = '#6B7280';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG, alignItems: 'center' },

    avatarContainer: { marginTop: 40, marginBottom: 24 },
    avatarCircle: {
        width: 72, height: 72, borderRadius: 36, backgroundColor: CARD_BG,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },

    welcomeTitle: { fontSize: 26, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', letterSpacing: -0.5 },
    welcomeSubtitle: { fontSize: 14, color: TEXT_MUTED, marginTop: 6, textAlign: 'center' },

    dotsContainer: { flexDirection: 'row', gap: 16, marginTop: 32, marginBottom: 8 },
    dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: 'transparent' },
    dotFilled:  { backgroundColor: BLUE,      borderColor: BLUE },
    dotError:   { backgroundColor: '#DC2626', borderColor: '#DC2626' },
    dotSuccess: { backgroundColor: '#16A34A', borderColor: '#16A34A' },
    dotLocked:  { backgroundColor: '#9CA3AF', borderColor: '#9CA3AF' },

    feedbackContainer: { height: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16, paddingHorizontal: 24 },
    feedbackText:    { fontSize: 13, fontWeight: '600', color: TEXT_MUTED, textAlign: 'center' },
    feedbackError:   { color: '#DC2626' },
    feedbackSuccess: { color: '#16A34A' },

    keypad:    { width: '100%', paddingHorizontal: 24, gap: 12 },
    keypadRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    keypadButton: {
        flex: 1, aspectRatio: 1.4, backgroundColor: CARD_BG, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    },
    keypadSpecial: { flex: 1, aspectRatio: 1.4, alignItems: 'center', justifyContent: 'center' },
    keypadDisabled: { opacity: 0.35 },
    keypadNumber: { fontSize: 22, fontWeight: '500', color: TEXT_DARK, lineHeight: 28 },
    keypadSub:    { fontSize: 9, fontWeight: '600', color: TEXT_MUTED, letterSpacing: 1, marginTop: 1 },
    textDisabled: { color: '#9CA3AF' },

    forgotContainer: { marginTop: 28 },
    forgotText: { fontSize: 14, fontWeight: '700', color: BLUE },
});

export default SecurePINLogin;
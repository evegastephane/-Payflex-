import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type TabType = 'DETAILS' | 'IDENTITY' | 'REVIEW';
type StatusType = 'idle' | 'scanning' | 'success' | 'error';

// ─── Composant CameraFrame ────────────────────────────────────────────────────

const CameraFrame: React.FC<{ status: StatusType }> = ({ status }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (status === 'scanning') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [status]);

  const frameColor =
    status === 'success' ? '#2B4EFF' :
    status === 'error'   ? '#EF4444' :
    status === 'scanning'? '#2B4EFF' : '#D1D5DB';

  return (
    <View style={cameraStyles.wrapper}>
      {/* Fond gris clair de la zone caméra */}
      <View style={cameraStyles.background}>

        {/* Cadre animé */}
        <Animated.View
          style={[
            cameraStyles.frame,
            { borderColor: frameColor, transform: [{ scale: pulseAnim }] },
          ]}
        >
          {/* Coins bleus aux 4 angles */}
          <View style={[cameraStyles.corner, cameraStyles.cornerTL, { borderColor: frameColor }]} />
          <View style={[cameraStyles.corner, cameraStyles.cornerTR, { borderColor: frameColor }]} />
          <View style={[cameraStyles.corner, cameraStyles.cornerBL, { borderColor: frameColor }]} />
          <View style={[cameraStyles.corner, cameraStyles.cornerBR, { borderColor: frameColor }]} />

          {/* Oval pointillé au centre (visage) */}
          <View style={cameraStyles.ovalContainer}>
            <View style={[cameraStyles.oval, { borderColor: frameColor }]} />
          </View>

          {/* Placeholder visage */}
          <View style={cameraStyles.facePlaceholder}>
            <Text style={cameraStyles.faceEmoji}>👤</Text>
          </View>
        </Animated.View>

        {/* Badge statut en bas */}
        {status === 'success' && (
          <View style={cameraStyles.badge}>
            <Text style={cameraStyles.badgeIcon}>✓</Text>
            <Text style={cameraStyles.badgeText}>Optimal Lighting{'\n'}Detected</Text>
          </View>
        )}

        {status === 'scanning' && (
          <View style={[cameraStyles.badge, cameraStyles.badgeScanning]}>
            <Text style={cameraStyles.badgeIcon}>⟳</Text>
            <Text style={cameraStyles.badgeText}>Scanning...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Composant Tab ────────────────────────────────────────────────────────────

const StepTab: React.FC<{
  label: TabType;
  active: boolean;
  completed: boolean;
}> = ({ label, active, completed }) => (
  <View style={tabStyles.container}>
    <Text
      style={[
        tabStyles.label,
        active && tabStyles.labelActive,
        completed && tabStyles.labelCompleted,
      ]}
    >
      {label}
    </Text>
    <View
      style={[
        tabStyles.underline,
        active && tabStyles.underlineActive,
        completed && tabStyles.underlineCompleted,
      ]}
    />
  </View>
);

// ─── Écran principal ──────────────────────────────────────────────────────────

const SelfieVerificationScreen: React.FC = () => {
  const [cameraStatus, setCameraStatus] = useState<StatusType>('success');
  const [lightingOk] = useState<boolean>(true);
  const [positionOk] = useState<boolean>(true);

  const handleTakePhoto = (): void => {
    setCameraStatus('scanning');
    setTimeout(() => setCameraStatus('success'), 2000);
  };

  const handleUploadGallery = (): void => {
    console.log('Upload from gallery');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
          <Text style={styles.helpIcon}>?</Text>
        </TouchableOpacity>
      </View>

      {/* ── Étapes (tabs) ── */}
      <View style={styles.tabsRow}>
        <StepTab label="DETAILS"  active={false} completed={true}  />
        <StepTab label="IDENTITY" active={true}  completed={false} />
        <StepTab label="REVIEW"   active={false} completed={false} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Titre ── */}
        <Text style={styles.title}>Selfie Verification</Text>
        <Text style={styles.subtitle}>
          We need to match your face with your document{'\n'}
          photo to ensure your account security.
        </Text>

        {/* ── Zone caméra ── */}
        <CameraFrame status={cameraStatus} />

        {/* ── Indicateurs Lighting / Position ── */}
        <View style={styles.indicatorsRow}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorIcon}>☀</Text>
            <Text style={[styles.indicatorLabel, lightingOk && styles.indicatorLabelActive]}>
              LIGHTING
            </Text>
            <View style={[styles.indicatorBar, lightingOk && styles.indicatorBarActive]} />
          </View>

          <View style={styles.indicatorDivider} />

          <View style={styles.indicator}>
            <Text style={styles.indicatorIcon}>⊙</Text>
            <Text style={[styles.indicatorLabel, positionOk && styles.indicatorLabelActive]}>
              POSITION
            </Text>
            <View style={[styles.indicatorBar, positionOk && styles.indicatorBarActive]} />
          </View>
        </View>

        {/* ── Conseils ── */}
        <View style={styles.tipsBlock}>
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>👁</Text>
            <Text style={styles.tipText}>
              Ensure your eyes are visible and look directly{'\n'}into the camera lens.
            </Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>🚫</Text>
            <Text style={styles.tipText}>
              Remove glasses, hats, or masks before taking{'\n'}the photo.
            </Text>
          </View>
        </View>

        {/* ── Bouton Take Photo ── */}
        <TouchableOpacity
          style={styles.takePhotoButton}
          onPress={handleTakePhoto}
          activeOpacity={0.85}
        >
          <Text style={styles.takePhotoText}>Take Photo</Text>
        </TouchableOpacity>

        {/* ── Lien Upload ── */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadGallery}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadText}>Upload from Gallery</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SelfieVerificationScreen;

// ─── Styles principaux ────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#2B4EFF',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1D2E',
    letterSpacing: 0.1,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },

  // ── Tabs ─────────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },

  // ── Contenu ───────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1D2E',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },

  // ── Indicateurs ───────────────────────────────────────────────────────────
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
  },
  indicatorIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#6B7280',
  },
  indicatorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  indicatorLabelActive: {
    color: '#2B4EFF',
  },
  indicatorBar: {
    width: '80%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  indicatorBarActive: {
    backgroundColor: '#2B4EFF',
  },
  indicatorDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },

  // ── Tips ──────────────────────────────────────────────────────────────────
  tipsBlock: {
    marginBottom: 28,
    gap: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 1,
    color: '#6B7280',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },

  // ── Boutons ───────────────────────────────────────────────────────────────
  takePhotoButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#2B4EFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2B4EFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
  takePhotoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  uploadButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

// ─── Styles CameraFrame ───────────────────────────────────────────────────────

const cameraStyles = StyleSheet.create({

  wrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  background: {
    width: width - 40,
    height: width - 40,
    backgroundColor: '#F0F2F8',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // Cadre principal
  frame: {
    width: (width - 40) * 0.82,
    height: (width - 40) * 0.82,
    borderWidth: 2,
    borderColor: '#2B4EFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // Coins
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#2B4EFF',
    borderWidth: 3,
  },
  cornerTL: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },

  // Oval pointillé
  ovalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  oval: {
    width: '75%',
    height: '88%',
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#2B4EFF',
  },

  // Visage placeholder
  facePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceEmoji: {
    fontSize: 90,
    opacity: 0.25,
  },

  // Badge
  badge: {
    position: 'absolute',
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeScanning: {
    backgroundColor: '#FFF8E1',
  },
  badgeIcon: {
    fontSize: 14,
    color: '#2B4EFF',
    marginRight: 8,
    fontWeight: '700',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1D2E',
    lineHeight: 17,
  },
});

// ─── Styles Tabs ──────────────────────────────────────────────────────────────

const tabStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1.0,
    marginBottom: 8,
  },
  labelActive: {
    color: '#2B4EFF',
  },
  labelCompleted: {
    color: '#6B7280',
  },
  underline: {
    width: '80%',
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: '#2B4EFF',
  },
  underlineCompleted: {
    backgroundColor: '#D1D5DB',
  },
});
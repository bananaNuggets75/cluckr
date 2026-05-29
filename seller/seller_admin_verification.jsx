// AdminVerificationScreen.js
// Shown after phone verification while the seller's account awaits admin approval.
//
// This screen has TWO states driven by polling:
//   "pending"  → Shows a waiting UI with a progress animation
//   "approved" → Shows a success state with a CTA to continue
//
// Polling interval: every 10 seconds (replace pollApprovalStatus with your API).
// The seller can also leave the app and come back; the Login screen re-routes them here
// as long as adminApproved === false.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Mock API ────────────────────────────────────────────────────────────────
// Replace with a real endpoint: GET /sellers/me/status
// Returns { approved: boolean }

let _mockCallCount = 0;
async function pollApprovalStatus() {
  _mockCallCount++;
  return new Promise((resolve) =>
    setTimeout(() => {
      // Demo: approves after 3rd poll (~30 s) so you can watch the transition.
      resolve({ approved: _mockCallCount >= 3 });
    }, 600)
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Account created', done: true },
  { id: 2, label: 'Phone verified', done: true },
  { id: 3, label: 'Admin review', done: false, active: true },
  { id: 4, label: 'Choose a plan', done: false },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminVerificationScreen({ navigation }) {
  const [approved, setApproved] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  // Pulse animation for the pending icon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    startPulse();
    const interval = setInterval(checkStatus, 10_000);
    // Also check immediately on mount
    checkStatus();
    return () => {
      clearInterval(interval);
      pulseLoop.current?.stop();
    };
  }, []);

  const startPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  };

  const checkStatus = async () => {
    try {
      const result = await pollApprovalStatus();
      setPollCount((c) => c + 1);
      if (result.approved) {
        setApproved(true);
        pulseLoop.current?.stop();
        pulseAnim.setValue(1);
      }
    } catch {
      // Silent fail — next poll will retry
    }
  };

  const handleContinue = () => {
    navigation.navigate('Subscription');
  };

  // ── Pending state
  if (!approved) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* ── Animated icon ── */}
          <Animated.View style={[styles.iconRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.iconInner}>
              <Text style={styles.iconEmoji}>🔍</Text>
            </View>
          </Animated.View>

          <Text style={styles.badge}>UNDER REVIEW</Text>
          <Text style={styles.title}>Your account is{'\n'}being reviewed.</Text>
          <Text style={styles.subtitle}>
            Our team is verifying your seller profile. This typically takes{' '}
            <Text style={styles.accentText}>1–2 business days.</Text>
            {'\n\n'}
            You'll receive an email and SMS once approved. You can safely close this app.
          </Text>

          {/* ── Progress Steps ── */}
          <View style={styles.stepsCard}>
            {STEPS.map((step, i) => (
              <View key={step.id} style={styles.stepRow}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <View style={[styles.connector, step.done && styles.connectorDone]} />
                )}
                {/* Dot */}
                <View
                  style={[
                    styles.dot,
                    step.done && styles.dotDone,
                    step.active && styles.dotActive,
                  ]}
                >
                  {step.done ? (
                    <Text style={styles.dotCheck}>✓</Text>
                  ) : step.active ? (
                    <View style={styles.dotPulse} />
                  ) : null}
                </View>
                {/* Label */}
                <Text
                  style={[
                    styles.stepLabel,
                    step.done && styles.stepDone,
                    step.active && styles.stepActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Poll indicator ── */}
          <Text style={styles.pollText}>Checking status… ({pollCount} check{pollCount !== 1 ? 's' : ''})</Text>

          {/* ── Manual refresh (for demo) ── */}
          <TouchableOpacity style={styles.refreshBtn} onPress={checkStatus}>
            <Text style={styles.refreshText}>Check Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Approved state
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.approvedIcon}>
          <Text style={styles.approvedEmoji}>✅</Text>
        </View>

        <Text style={styles.approvedBadge}>APPROVED</Text>
        <Text style={styles.title}>You're verified!{'\n'}Welcome, Seller.</Text>
        <Text style={styles.subtitle}>
          Your account has been approved by our admin team. You're now ready to choose a listing
          plan and start selling.
        </Text>

        <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.btnText}>Choose a Plan →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const ACCENT = '#F5C518';
const BG = '#0D0D0D';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const TEXT = '#F0F0F0';
const MUTED = '#888';
const GREEN = '#3ECF8E';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },

  // Pending icon
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A1500',
    borderWidth: 2,
    borderColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#252000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 32 },

  badge: { color: ACCENT, fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 12 },
  title: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 14,
  },
  subtitle: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  accentText: { color: ACCENT, fontWeight: '700' },

  // Steps
  stepsCard: {
    width: '100%',
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    marginBottom: 24,
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    left: 15,
    top: '50%',
    width: 2,
    height: '100%',
    backgroundColor: BORDER,
    zIndex: 0,
  },
  connectorDone: { backgroundColor: GREEN },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    zIndex: 1,
  },
  dotDone: { backgroundColor: GREEN, borderColor: GREEN },
  dotActive: { backgroundColor: '#252000', borderColor: ACCENT },
  dotCheck: { color: '#0D0D0D', fontSize: 13, fontWeight: '900' },
  dotPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ACCENT,
  },
  stepLabel: { color: MUTED, fontSize: 14 },
  stepDone: { color: TEXT, fontWeight: '600' },
  stepActive: { color: ACCENT, fontWeight: '700' },

  pollText: { color: MUTED, fontSize: 12, marginBottom: 16 },

  refreshBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  refreshText: { color: TEXT, fontSize: 13, fontWeight: '600' },

  // Approved state
  approvedIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0D2A1A',
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  approvedEmoji: { fontSize: 40 },
  approvedBadge: { color: GREEN, fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 12 },

  btn: {
    width: '100%',
    backgroundColor: ACCENT,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnText: { color: '#0D0D0D', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});
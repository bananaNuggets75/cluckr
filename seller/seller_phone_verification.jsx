// PhoneVerificationScreen.js
// Seller phone number verification via OTP (One-Time Password).
// Receives `phone` from route params (passed by SignUp or Login).
//
// Flow:
//  1. Screen loads → auto-triggers sendOtp()
//  2. Seller enters 6-digit OTP
//  3. On verify → navigates to AdminVerification
//  4. Resend available after 60s cooldown
//
// Replace sendOtp() and verifyOtp() with your SMS provider
// (e.g. Firebase Phone Auth, Twilio Verify, or your own backend).

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Mock API ────────────────────────────────────────────────────────────────

async function sendOtp(phone) {
  console.log(`[OTP] Sending to ${phone}`);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
}

async function verifyOtp(phone, code) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: code === '123456' }), 1000)
    // Demo: correct code is 123456
  );
}

// ─── OTP Input Cell ──────────────────────────────────────────────────────────

function OtpCell({ value, focused }) {
  return (
    <View style={[styles.otpCell, focused && styles.otpCellFocused, value && styles.otpCellFilled]}>
      <Text style={styles.otpText}>{value || ''}</Text>
      {focused && !value && <View style={styles.cursor} />}
    </View>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function PhoneVerificationScreen({ route, navigation }) {
  const phone = route?.params?.phone || '+639171234567';

  const [otp, setOtp] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [otpSent, setOtpSent] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-send OTP on mount
  useEffect(() => {
    handleSendOtp();
    return () => clearInterval(timerRef.current);
  }, []);

  // Countdown timer
  const startCountdown = () => {
    setCountdown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setSending(true);
    try {
      await sendOtp(phone);
      setOtpSent(true);
      startCountdown();
    } catch {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Handle digit input from hidden TextInput
  const handleOtpChange = (text) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setOtp(digits);
    setFocusedIndex(Math.min(digits.length, OTP_LENGTH - 1));
    if (digits.length === OTP_LENGTH) {
      Keyboard.dismiss();
      handleVerify(digits);
    }
  };

  const handleVerify = async (code = otp) => {
    if (code.length < OTP_LENGTH) {
      Alert.alert('Incomplete', 'Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    try {
      const result = await verifyOtp(phone, code);
      if (result.success) {
        navigation.navigate('AdminVerification');
      } else {
        Alert.alert('Incorrect Code', 'The OTP you entered is wrong. Please try again.');
        setOtp('');
        setFocusedIndex(0);
        inputRef.current?.focus();
      }
    } catch {
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mask phone number for display: +639** *** 7890
  const maskedPhone = phone.replace(/(\+?\d{3})\d+(\d{4})/, '$1•••••$2');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ── Back ── */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* ── Icon ── */}
        <View style={styles.iconWrap}>
          <Text style={styles.iconEmoji}>📱</Text>
        </View>

        {/* ── Header ── */}
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          {otpSent
            ? `We sent a 6-digit code to\n${maskedPhone}`
            : 'Sending verification code…'}
        </Text>

        {/* ── OTP Cells (visual) ── */}
        <TouchableOpacity
          style={styles.otpRow}
          onPress={() => inputRef.current?.focus()}
          activeOpacity={1}
        >
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <OtpCell
              key={i}
              value={otp[i]}
              focused={!loading && focusedIndex === i && otp.length === i}
            />
          ))}
        </TouchableOpacity>

        {/* Hidden real input */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          caretHidden
          autoFocus
        />

        {/* ── Verify Button ── */}
        <TouchableOpacity
          style={[styles.btn, (loading || otp.length < OTP_LENGTH) && styles.btnDisabled]}
          onPress={() => handleVerify()}
          disabled={loading || otp.length < OTP_LENGTH}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#0D0D0D" />
          ) : (
            <Text style={styles.btnText}>Verify & Continue →</Text>
          )}
        </TouchableOpacity>

        {/* ── Resend ── */}
        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={styles.resendMuted}>
              Resend code in{' '}
              <Text style={styles.resendTimer}>{countdown}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleSendOtp} disabled={sending}>
              <Text style={styles.resendLink}>
                {sending ? 'Sending…' : "Didn't get it? Resend"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Demo hint ── */}
        <View style={styles.hint}>
          <Text style={styles.hintText}>🔑 Demo OTP: 123456</Text>
        </View>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },

  back: { marginBottom: 32 },
  backText: { color: ACCENT, fontSize: 15, fontWeight: '600' },

  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: { fontSize: 34 },

  title: { color: TEXT, fontSize: 28, fontWeight: '800', marginBottom: 10 },
  subtitle: { color: MUTED, fontSize: 15, lineHeight: 22, marginBottom: 40 },

  // OTP cells
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 36,
  },
  otpCell: {
    width: 48,
    height: 60,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCellFocused: {
    borderColor: ACCENT,
  },
  otpCellFilled: {
    borderColor: '#3A3A3A',
    backgroundColor: '#1E1E1E',
  },
  otpText: { color: TEXT, fontSize: 22, fontWeight: '800' },
  cursor: {
    width: 2,
    height: 24,
    backgroundColor: ACCENT,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },

  // Button
  btn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#0D0D0D', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  // Resend
  resendRow: { alignItems: 'center', marginBottom: 24 },
  resendMuted: { color: MUTED, fontSize: 14 },
  resendTimer: { color: ACCENT, fontWeight: '700' },
  resendLink: { color: ACCENT, fontSize: 14, fontWeight: '700' },

  // Hint
  hint: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: '#1A1A00',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#3A3A00',
  },
  hintText: { color: ACCENT, fontSize: 12, fontWeight: '600' },
});
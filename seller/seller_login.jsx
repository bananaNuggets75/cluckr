// LoginScreen.js
// Seller login screen.
// Collects: Email, Password.
// On success → checks seller status:
//   - Needs phone verification  → PhoneVerification
//   - Needs admin approval      → AdminVerification
//   - Needs subscription        → Subscription
//   - Fully onboarded           → Dashboard
//
// Replace the mock `loginSeller()` with your real auth API.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Mock API ────────────────────────────────────────────────────────────────
// Simulates different seller states for routing logic.
// Replace with your actual auth endpoint.
//
// Expected response shape:
// {
//   success: boolean,
//   message?: string,
//   seller: {
//     id: string,
//     fullName: string,
//     phone: string,
//     phoneVerified: boolean,     // true after OTP confirmed
//     adminApproved: boolean,     // true after admin approves account
//     subscriptionActive: boolean // true after they've picked a plan
//   }
// }

async function loginSeller({ email, password }) {
  return new Promise((resolve) =>
    setTimeout(() => {
      // Demo: returns a seller who has just registered (not yet phone-verified)
      resolve({
        success: true,
        seller: {
          id: 'seller_001',
          fullName: 'Juan dela Cruz',
          phone: '+639171234567',
          phoneVerified: false,
          adminApproved: false,
          subscriptionActive: false,
        },
      });
    }, 1100)
  );
}

// ─── Route logic ─────────────────────────────────────────────────────────────

function getNextScreen(seller) {
  if (!seller.phoneVerified) return { screen: 'PhoneVerification', params: { phone: seller.phone } };
  if (!seller.adminApproved) return { screen: 'AdminVerification', params: {} };
  if (!seller.subscriptionActive) return { screen: 'Subscription', params: {} };
  return { screen: 'Dashboard', params: {} };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await loginSeller({ email, password });
      if (result.success) {
        const { screen, params } = getNextScreen(result.seller);
        navigation.navigate(screen, params);
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid email or password.');
      }
    } catch {
      Alert.alert('Error', 'Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand mark ── */}
          <View style={styles.logoArea}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={styles.logoLabel}>Marketplace</Text>
          </View>

          {/* ── Header ── */}
          <Text style={styles.title}>Welcome back,{'\n'}Seller.</Text>
          <Text style={styles.subtitle}>Sign in to manage your listings.</Text>

          {/* ── Email ── */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="you@example.com"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* ── Password ── */}
          <View style={styles.fieldWrapper}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputRow, errors.password && styles.inputError]}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Your password"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0D0D0D" />
            ) : (
              <Text style={styles.btnText}>Sign In →</Text>
            )}
          </TouchableOpacity>

          {/* ── Divider ── */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>New here?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Sign up ── */}
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.85}
          >
            <Text style={styles.outlineBtnText}>Create Seller Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scroll: { padding: 24, paddingBottom: 48, justifyContent: 'center', flexGrow: 1 },

  // Logo
  logoArea: { alignItems: 'center', marginBottom: 40, gap: 8 },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 30, fontWeight: '900', color: '#0D0D0D' },
  logoLabel: { color: TEXT, fontSize: 13, fontWeight: '700', letterSpacing: 2 },

  // Header
  title: {
    color: TEXT,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: { color: MUTED, fontSize: 14, marginBottom: 32 },

  // Fields
  fieldWrapper: { marginBottom: 18, gap: 6 },
  label: { color: TEXT, fontSize: 13, fontWeight: '600', letterSpacing: 0.4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { color: ACCENT, fontSize: 13, fontWeight: '600' },

  input: {
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    height: 52,
    paddingHorizontal: 16,
    color: TEXT,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
  },
  inputFlex: { flex: 1, height: 52, color: TEXT, fontSize: 15 },
  inputError: { borderColor: '#E05252' },
  errorText: { color: '#E05252', fontSize: 12 },
  eyeBtn: { paddingLeft: 8 },
  eyeText: { fontSize: 18 },

  // Buttons
  btn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#0D0D0D', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  outlineBtn: {
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  outlineBtnText: { color: TEXT, fontSize: 15, fontWeight: '600' },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { color: MUTED, fontSize: 13 },
});
// SignUpScreen.js
// Seller registration screen.
// Collects: Full Name, Email, Phone Number, Password, Confirm Password.
// On success → navigates to PhoneVerification.
//
// Dependencies (all standard RN + community):
//   npm install react-native-safe-area-context

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Helpers ────────────────────────────────────────────────────────────────

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, ''));

// ─── Mock API ────────────────────────────────────────────────────────────────
// Replace this with your real API call (e.g. Firebase, Supabase, custom backend).

async function registerSeller({ fullName, email, phone, password }) {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1200));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Field updater
  const update = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ── Validation
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address.';
    if (!validatePhone(form.phone)) e.phone = 'Enter a valid phone number (e.g. +639171234567).';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit
  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await registerSeller(form);
      if (result.success) {
        // Pass phone number to the verification screen
        navigation.navigate('PhoneVerification', { phone: form.phone });
      } else {
        Alert.alert('Registration Failed', result.message || 'Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render field helper
  const renderField = ({ label, field, placeholder, keyboardType, secureEntry, autoCapitalize }) => (
    <View style={styles.fieldWrapper} key={field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, errors[field] && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#555"
          value={form[field]}
          onChangeText={update(field)}
          keyboardType={keyboardType || 'default'}
          secureTextEntry={secureEntry && !showPassword}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
        />
        {secureEntry && (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
    </View>
  );

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
          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.badge}>SELLER PORTAL</Text>
            <Text style={styles.title}>Create Your{'\n'}Seller Account</Text>
            <Text style={styles.subtitle}>
              Start selling in minutes. Fill in your details below.
            </Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            {renderField({
              label: 'Full Name',
              field: 'fullName',
              placeholder: 'e.g. Juan dela Cruz',
              autoCapitalize: 'words',
            })}
            {renderField({
              label: 'Email Address',
              field: 'email',
              placeholder: 'you@example.com',
              keyboardType: 'email-address',
            })}
            {renderField({
              label: 'Phone Number',
              field: 'phone',
              placeholder: '+63 917 123 4567',
              keyboardType: 'phone-pad',
            })}
            {renderField({
              label: 'Password',
              field: 'password',
              placeholder: 'Min. 8 characters',
              secureEntry: true,
            })}
            {renderField({
              label: 'Confirm Password',
              field: 'confirmPassword',
              placeholder: 'Re-enter your password',
              secureEntry: true,
            })}
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0D0D0D" />
            ) : (
              <Text style={styles.btnText}>Create Account →</Text>
            )}
          </TouchableOpacity>

          {/* ── Login link ── */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkAccent}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const ACCENT = '#F5C518';   // Warm amber — premium marketplace feel
const BG = '#0D0D0D';
const CARD = '#181818';
const BORDER = '#2A2A2A';
const TEXT = '#F0F0F0';
const MUTED = '#888';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },

  // Header
  header: {
    marginBottom: 32,
    paddingTop: 16,
  },
  badge: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 12,
  },
  title: {
    color: TEXT,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 10,
  },
  subtitle: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
  },

  // Form
  form: {
    marginBottom: 24,
    gap: 18,
  },
  fieldWrapper: {
    gap: 6,
  },
  label: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
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
  input: {
    flex: 1,
    height: 52,
    color: TEXT,
    fontSize: 15,
  },
  inputError: {
    borderColor: '#E05252',
  },
  errorText: {
    color: '#E05252',
    fontSize: 12,
    marginTop: 2,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  eyeText: {
    fontSize: 18,
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
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Link
  linkRow: {
    alignItems: 'center',
  },
  linkText: {
    color: MUTED,
    fontSize: 14,
  },
  linkAccent: {
    color: ACCENT,
    fontWeight: '700',
  },
});
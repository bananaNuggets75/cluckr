// screens/SignUpScreen.js
// -----------------------------------------------------------
// HOW TO CONNECT TO YOUR DATABASE:
//   Replace the `sellerService.registerSeller(formData)` call
//   with your actual API/Supabase/Firebase call (see services/sellerService.js)
// -----------------------------------------------------------
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Image, Alert, ActivityIndicator, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // npm install expo-image-picker
import { sellerService } from '../services/sellerService';

const MUNICIPALITIES = [
  'Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay',
  'Danao', 'Toledo', 'Carcar', 'Bogo'
];

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: '',
    farmName: '',
    achievements: '',
    municipality: '',
    contactNumber: '',
    email: '',
    password: '',
    description: '',
    farmPhoto: null,   // will hold { uri, base64 }
  });
  const [loading, setLoading] = useState(false);

  // ── Pick a photo from the device ──────────────────────────
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to upload a farm picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,   // remove if using cloud storage upload instead
    });
    if (!result.canceled) {
      setForm(prev => ({ ...prev, farmPhoto: result.assets[0] }));
    }
  };

  // ── Validate inputs before submitting ────────────────────
  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!form.municipality)    return 'Please select your municipality.';
    if (!/^(\+63|09)\d{9,10}$/.test(form.contactNumber.replace(/\s/g, '')))
      return 'Enter a valid Philippine mobile number.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 8)          return 'Password must be at least 8 characters.';
    return null;
  };

  // ── Submit registration ───────────────────────────────────
  const handleSignUp = async () => {
    const error = validate();
    if (error) { Alert.alert('Validation Error', error); return; }

    setLoading(true);
    try {
      // ✅ THIS IS WHERE YOU CALL YOUR DATABASE
      // The sellerService abstracts your backend (Supabase / Firebase / REST API)
      // See services/sellerService.js for implementation details
      const result = await sellerService.registerSeller({
        fullName:      form.fullName,
        farmName:      form.farmName,
        achievements:  form.achievements,
        municipality:  form.municipality,
        contactNumber: form.contactNumber,
        email:         form.email,
        password:      form.password,
        description:   form.description,
        farmPhotoBase64: form.farmPhoto?.base64 ?? null,
      });

      // ✅ Navigate to OTP screen and pass the phone number
      navigation.navigate('OTP', {
        contactNumber: form.contactNumber,
        sellerId: result.sellerId,
      });
    } catch (err) {
      Alert.alert('Sign Up Failed', err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Seller Account</Text>
        <Text style={styles.headerSub}>Join our poultry marketplace</Text>
        <StepIndicator current={0} total={4} />
      </View>

      <View style={styles.content}>
        {/* Farm Photo */}
        <TouchableOpacity style={styles.avatarUpload} onPress={pickImage}>
          {form.farmPhoto
            ? <Image source={{ uri: form.farmPhoto.uri }} style={styles.avatarImg} />
            : <Text style={styles.avatarIcon}>📷</Text>
          }
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Upload farm photo</Text>

        <Field label="Full Name" value={form.fullName}
          onChangeText={v => update('fullName', v)} placeholder="Juan dela Cruz" />

        <Field label="Farm / Business Name" value={form.farmName}
          onChangeText={v => update('farmName', v)} placeholder="Dela Cruz Poultry Farm" />

        <Field label="Achievements / Awards" value={form.achievements}
          onChangeText={v => update('achievements', v)}
          placeholder="e.g. Regional Best Farmer 2023" />

        {/* Municipality Picker */}
        <Text style={styles.label}>Municipality</Text>
        <View style={styles.pickerWrapper}>
          {/* Replace with a real Picker: npm install @react-native-picker/picker */}
          {MUNICIPALITIES.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.pickerOption, form.municipality === m && styles.pickerSelected]}
              onPress={() => update('municipality', m)}
            >
              <Text style={form.municipality === m ? styles.pickerTextSelected : styles.pickerText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field label="Contact Number" value={form.contactNumber}
          onChangeText={v => update('contactNumber', v)}
          placeholder="+63 9XX XXX XXXX" keyboardType="phone-pad" />

        <Field label="Email Address" value={form.email}
          onChangeText={v => update('email', v)}
          placeholder="juan@farm.com" keyboardType="email-address" autoCapitalize="none" />

        <Field label="Password" value={form.password}
          onChangeText={v => update('password', v)}
          placeholder="Min. 8 characters" secureTextEntry />

        <Field label="Description" value={form.description}
          onChangeText={v => update('description', v)}
          placeholder="Tell buyers about your farm..."
          multiline numberOfLines={4} />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleSignUp} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnPrimaryText}>Continue to Phone Verification →</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnSecondaryText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ── Reusable field component ──────────────────────────────────
function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, props.multiline && { height: 90, textAlignVertical: 'top' }]} {...props} />
    </View>
  );
}

// ── Step indicator ────────────────────────────────────────────
function StepIndicator({ current, total }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[
          styles.stepDot,
          i < current && styles.stepDone,
          i === current && styles.stepActive,
        ]} />
      ))}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f0' },
  header: { backgroundColor: '#1a3a1a', padding: 20, paddingBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
  content: { padding: 16 },
  avatarUpload: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#e8f0e8', borderWidth: 2,
    borderColor: '#2d6a2d', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginTop: 16, overflow: 'hidden',
  },
  avatarImg: { width: 80, height: 80 },
  avatarIcon: { fontSize: 28 },
  avatarHint: { textAlign: 'center', fontSize: 12, color: '#888', marginTop: 6, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '500', color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ddd',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#1a1a1a',
  },
  pickerWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  pickerOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5, borderColor: '#ccc', backgroundColor: '#fff' },
  pickerSelected: { backgroundColor: '#e8f0e8', borderColor: '#2d6a2d' },
  pickerText: { fontSize: 13, color: '#555' },
  pickerTextSelected: { fontSize: 13, color: '#1a3a1a', fontWeight: '500' },
  btnPrimary: {
    backgroundColor: '#1a3a1a', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnSecondary: {
    borderWidth: 1, borderColor: '#1a3a1a', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 30,
  },
  btnSecondaryText: { color: '#1a3a1a', fontSize: 15, fontWeight: '500' },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  stepActive: { width: 24, borderRadius: 4, backgroundColor: '#fff' },
  stepDone: { backgroundColor: 'rgba(255,255,255,0.7)' },
});
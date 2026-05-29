// SubscriptionScreen.js
// Seller listing subscription plan selector.
// Seller chooses how many items they can list per month.
//
// Plans are structured as:
//   { id, name, itemLimit, price, billingCycle, features, popular }
//
// On "Subscribe" → call your payment/subscription API, then navigate to Dashboard.
// Replace subscribeToPlan() with Stripe, PayMongo, GCash, or your own billing.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Plans ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    itemLimit: 5,
    price: 0,
    billingCycle: 'Free forever',
    features: ['Up to 5 active listings', 'Basic analytics', 'Email support'],
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    itemLimit: 25,
    price: 299,
    billingCycle: '/ month',
    features: [
      'Up to 25 active listings',
      'Priority placement',
      'Full analytics dashboard',
      'Chat support',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    itemLimit: 100,
    price: 799,
    billingCycle: '/ month',
    features: [
      'Up to 100 active listings',
      'Featured seller badge',
      'Advanced analytics',
      'Dedicated account manager',
      'API access',
    ],
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    itemLimit: Infinity,
    price: null, // Custom pricing
    billingCycle: 'Custom pricing',
    features: [
      'Unlimited listings',
      'Custom integrations',
      'SLA guarantee',
      'White-glove onboarding',
    ],
    popular: false,
  },
];

// ─── Mock API ────────────────────────────────────────────────────────────────

async function subscribeToPlan(planId) {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1200));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SubscriptionScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState('growth'); // Default: most popular
  const [loading, setLoading] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === selectedId);

  const handleSubscribe = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const result = await subscribeToPlan(selectedId);
      if (result.success) {
        navigation.navigate('Dashboard', { plan: selectedPlan });
      } else {
        Alert.alert('Failed', 'Could not activate subscription. Please try again.');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (plan) => {
    if (plan.price === null) return 'Contact Us';
    if (plan.price === 0) return 'Free';
    return `₱${plan.price.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Text style={styles.badge}>STEP 4 OF 4</Text>
        <Text style={styles.title}>Choose Your{'\n'}Listing Plan</Text>
        <Text style={styles.subtitle}>
          Pick how many items you want to list. You can upgrade anytime.
        </Text>

        {/* ── Plan Cards ── */}
        <View style={styles.plansGrid}>
          {PLANS.map((plan) => {
            const isSelected = selectedId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  plan.popular && !isSelected && styles.cardPopular,
                ]}
                onPress={() => setSelectedId(plan.id)}
                activeOpacity={0.85}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}

                {/* Plan header */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
                      {plan.name}
                    </Text>
                    <Text style={styles.itemLimit}>
                      {plan.itemLimit === Infinity ? 'Unlimited' : `${plan.itemLimit} items`}
                    </Text>
                  </View>
                  <View style={styles.priceBlock}>
                    <Text style={[styles.price, isSelected && styles.priceSelected]}>
                      {formatPrice(plan)}
                    </Text>
                    {plan.price !== null && plan.price > 0 && (
                      <Text style={styles.billing}>{plan.billingCycle}</Text>
                    )}
                    {plan.price === null && (
                      <Text style={styles.billing}>{plan.billingCycle}</Text>
                    )}
                  </View>
                </View>

                {/* Features */}
                <View style={styles.featureList}>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Text style={[styles.featureDot, isSelected && styles.featureDotSelected]}>
                        ✓
                      </Text>
                      <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Selection indicator */}
                <View style={[styles.selectIndicator, isSelected && styles.selectIndicatorActive]}>
                  <Text style={[styles.selectIndicatorText, isSelected && styles.selectIndicatorTextActive]}>
                    {isSelected ? '● Selected' : '○ Select'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Summary ── */}
        {selectedPlan && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Selection</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{selectedPlan.name} Plan</Text>
              <Text style={styles.summaryValue}>{formatPrice(selectedPlan)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Listing Limit</Text>
              <Text style={styles.summaryValue}>
                {selectedPlan.itemLimit === Infinity ? 'Unlimited' : `${selectedPlan.itemLimit} items`}
              </Text>
            </View>
          </View>
        )}

        {/* ── CTA ── */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#0D0D0D" />
          ) : (
            <Text style={styles.btnText}>
              Activate{' '}
              {selectedPlan
                ? selectedPlan.price === 0
                  ? 'Free Plan'
                  : selectedPlan.price === null
                  ? '& Contact Us'
                  : `₱${selectedPlan.price}/mo Plan`
                : 'Plan'}{' '}
              →
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing you agree to our Terms of Service and Seller Agreement.
          Subscriptions renew monthly. Cancel anytime.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const ACCENT = '#F5C518';
const BG = '#0D0D0D';
const CARD = '#181818';
const CARD_SEL = '#1C1800';
const BORDER = '#2A2A2A';
const BORDER_SEL = '#F5C518';
const TEXT = '#F0F0F0';
const MUTED = '#888';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { padding: 24, paddingBottom: 48 },

  badge: { color: ACCENT, fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 12 },
  title: { color: TEXT, fontSize: 30, fontWeight: '800', lineHeight: 36, marginBottom: 10 },
  subtitle: { color: MUTED, fontSize: 14, lineHeight: 20, marginBottom: 28 },

  plansGrid: { gap: 14, marginBottom: 20 },

  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BORDER,
    padding: 18,
  },
  cardSelected: {
    backgroundColor: CARD_SEL,
    borderColor: BORDER_SEL,
  },
  cardPopular: {
    borderColor: '#3A3A00',
  },

  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ACCENT,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  popularBadgeText: { color: '#0D0D0D', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  planName: { color: MUTED, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  planNameSelected: { color: ACCENT },
  itemLimit: { color: TEXT, fontSize: 13 },

  priceBlock: { alignItems: 'flex-end' },
  price: { color: TEXT, fontSize: 22, fontWeight: '900' },
  priceSelected: { color: ACCENT },
  billing: { color: MUTED, fontSize: 12, marginTop: 2 },

  featureList: { gap: 7, marginBottom: 14 },
  featureRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  featureDot: { color: MUTED, fontSize: 13, fontWeight: '700', width: 16 },
  featureDotSelected: { color: ACCENT },
  featureText: { color: MUTED, fontSize: 13, flex: 1 },
  featureTextSelected: { color: TEXT },

  selectIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  selectIndicatorActive: { borderColor: ACCENT, backgroundColor: '#252000' },
  selectIndicatorText: { color: MUTED, fontSize: 12, fontWeight: '600' },
  selectIndicatorTextActive: { color: ACCENT },

  // Summary
  summaryCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  summaryTitle: { color: TEXT, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: MUTED, fontSize: 14 },
  summaryValue: { color: TEXT, fontSize: 14, fontWeight: '700' },

  // Button
  btn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#0D0D0D', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  terms: { color: MUTED, fontSize: 11, textAlign: 'center', lineHeight: 17 },
});
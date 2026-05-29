// DashboardScreen.js
// Seller's main dashboard after full onboarding.
// Features:
//   - Stats bar: total listings, active, sold, views
//   - Add new item (modal form)
//   - Item list with status toggle (active / paused) and delete
//   - Listing limit progress bar based on subscription plan
//   - Settings / logout
//
// Replace the mock data and API calls with your real backend.

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_SELLER = {
  name: 'Juan dela Cruz',
  plan: 'Growth',
  itemLimit: 25,
};

const INITIAL_ITEMS = [
  { id: '1', title: 'Vintage Leather Bag', price: 1500, category: 'Fashion', status: 'active', views: 142 },
  { id: '2', title: 'Mechanical Keyboard', price: 3200, category: 'Electronics', status: 'active', views: 87 },
  { id: '3', title: 'Potted Succulent Set', price: 350, category: 'Home & Garden', status: 'paused', views: 31 },
];

const CATEGORIES = ['Fashion', 'Electronics', 'Home & Garden', 'Sports', 'Books', 'Other'];

// ─── Mock API ─────────────────────────────────────────────────────────────────

async function addItem(item) {
  return new Promise((res) => setTimeout(() => res({ success: true, item: { ...item, id: Date.now().toString(), views: 0 } }), 800));
}

async function deleteItem(id) {
  return new Promise((res) => setTimeout(() => res({ success: true }), 500));
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, accent }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, accent && { color: ACCENT }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ItemCard({ item, onToggle, onDelete }) {
  const isActive = item.status === 'active';
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemLeft}>
        <View style={[styles.itemDot, isActive ? styles.itemDotActive : styles.itemDotPaused]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemViews}>👁 {item.views}</Text>
          </View>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemPrice}>₱{item.price.toLocaleString()}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onToggle}>
            <Text style={styles.actionText}>{isActive ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDelete]} onPress={onDelete}>
            <Text style={styles.actionText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardScreen({ route, navigation }) {
  const plan = route?.params?.plan || MOCK_SELLER;
  const itemLimit = plan?.itemLimit ?? MOCK_SELLER.itemLimit;
  const planName = plan?.name ?? MOCK_SELLER.plan;

  const [items, setItems] = useState(INITIAL_ITEMS);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all'); // all | active | paused

  // New item form state
  const [form, setForm] = useState({ title: '', price: '', category: CATEGORIES[0], description: '' });
  const [formErrors, setFormErrors] = useState({});

  const slideAnim = useRef(new Animated.Value(300)).current;

  // Stats
  const activeCount = items.filter((i) => i.status === 'active').length;
  const pausedCount = items.filter((i) => i.status === 'paused').length;
  const totalViews = items.reduce((s, i) => s + i.views, 0);
  const usagePercent = Math.min((items.length / itemLimit) * 100, 100);

  // Filtered items
  const visibleItems = filter === 'all' ? items : items.filter((i) => i.status === filter);

  // ── Modal open/close
  const openModal = () => {
    setShowModal(true);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
  };
  const closeModal = () => {
    Animated.timing(slideAnim, { toValue: 300, duration: 220, useNativeDriver: true }).start(() => {
      setShowModal(false);
      setForm({ title: '', price: '', category: CATEGORIES[0], description: '' });
      setFormErrors({});
    });
  };

  // ── Validate
  const validateForm = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price.';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Add item
  const handleAddItem = async () => {
    if (!validateForm()) return;
    if (items.length >= itemLimit) {
      Alert.alert('Limit Reached', `Your ${planName} plan allows ${itemLimit} items. Upgrade to add more.`);
      return;
    }
    setSaving(true);
    try {
      const result = await addItem({ ...form, price: Number(form.price), status: 'active' });
      if (result.success) {
        setItems((prev) => [result.item, ...prev]);
        closeModal();
      }
    } catch {
      Alert.alert('Error', 'Could not add item. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle status
  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === 'active' ? 'paused' : 'active' } : item
      )
    );
  };

  // ── Delete
  const handleDelete = (id) => {
    Alert.alert('Delete Item', 'Remove this listing?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteItem(id);
          setItems((prev) => prev.filter((i) => i.id !== id));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.sellerName}>{MOCK_SELLER.name}</Text>
        </View>
        <View style={styles.planPill}>
          <Text style={styles.planPillText}>{planName}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <StatCard label="Total Listed" value={items.length} />
          <StatCard label="Active" value={activeCount} accent />
          <StatCard label="Paused" value={pausedCount} />
          <StatCard label="Total Views" value={totalViews} />
        </View>

        {/* ── Usage bar ── */}
        <View style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <Text style={styles.usageLabel}>Listing Usage</Text>
            <Text style={styles.usageCount}>
              <Text style={{ color: ACCENT }}>{items.length}</Text> / {itemLimit === Infinity ? '∞' : itemLimit}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${usagePercent}%`, backgroundColor: usagePercent > 80 ? '#E05252' : ACCENT }]} />
          </View>
          {usagePercent >= 80 && (
            <Text style={styles.usageWarning}>⚠ Nearing limit — consider upgrading your plan.</Text>
          )}
        </View>

        {/* ── Items header ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Listings</Text>
          <TouchableOpacity
            style={[styles.addBtn, items.length >= itemLimit && styles.addBtnDisabled]}
            onPress={openModal}
          >
            <Text style={styles.addBtnText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* ── Filter tabs ── */}
        <View style={styles.filterRow}>
          {['all', 'active', 'paused'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Item list ── */}
        <View style={styles.itemList}>
          {visibleItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyText}>No {filter === 'all' ? '' : filter} listings yet.</Text>
              <Text style={styles.emptySubtext}>Tap "+ Add Item" to create your first listing.</Text>
            </View>
          ) : (
            visibleItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={() => handleToggle(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))
          )}
        </View>

        {/* ── Bottom spacer ── */}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Add Item Modal ── */}
      <Modal visible={showModal} transparent animationType="none" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} activeOpacity={1} />
          <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Listing</Text>

            {/* Title */}
            <Text style={styles.fieldLabel}>Item Title</Text>
            <TextInput
              style={[styles.fieldInput, formErrors.title && styles.fieldInputError]}
              placeholder="e.g. Vintage Leather Bag"
              placeholderTextColor="#555"
              value={form.title}
              onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
              autoCapitalize="words"
            />
            {formErrors.title ? <Text style={styles.fieldError}>{formErrors.title}</Text> : null}

            {/* Price */}
            <Text style={styles.fieldLabel}>Price (₱)</Text>
            <TextInput
              style={[styles.fieldInput, formErrors.price && styles.fieldInputError]}
              placeholder="e.g. 1500"
              placeholderTextColor="#555"
              value={form.price}
              onChangeText={(v) => setForm((p) => ({ ...p, price: v }))}
              keyboardType="numeric"
            />
            {formErrors.price ? <Text style={styles.fieldError}>{formErrors.price}</Text> : null}

            {/* Category */}
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, form.category === cat && styles.catChipActive]}
                  onPress={() => setForm((p) => ({ ...p, category: cat }))}
                >
                  <Text style={[styles.catChipText, form.category === cat && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Description */}
            <Text style={styles.fieldLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.fieldInput, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
              placeholder="Describe your item…"
              placeholderTextColor="#555"
              value={form.description}
              onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
              multiline
            />

            {/* Submit */}
            <TouchableOpacity
              style={[styles.modalBtn, saving && styles.modalBtnDisabled]}
              onPress={handleAddItem}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#0D0D0D" />
              ) : (
                <Text style={styles.modalBtnText}>Publish Listing →</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
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

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  greeting: { color: MUTED, fontSize: 13 },
  sellerName: { color: TEXT, fontSize: 18, fontWeight: '800', marginTop: 2 },
  planPill: {
    backgroundColor: '#1C1800',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#3A3200',
  },
  planPillText: { color: ACCENT, fontSize: 12, fontWeight: '700' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { color: TEXT, fontSize: 20, fontWeight: '900' },
  statLabel: { color: MUTED, fontSize: 10, marginTop: 3, textAlign: 'center' },

  // Usage
  usageCard: {
    marginHorizontal: 16,
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 20,
  },
  usageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  usageLabel: { color: TEXT, fontSize: 13, fontWeight: '600' },
  usageCount: { color: MUTED, fontSize: 13 },
  progressTrack: { height: 6, backgroundColor: '#252525', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  usageWarning: { color: '#E05252', fontSize: 12, marginTop: 8 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { color: TEXT, fontSize: 17, fontWeight: '800' },
  addBtn: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: '#0D0D0D', fontSize: 13, fontWeight: '800' },

  // Filter tabs
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
  },
  filterTabActive: { backgroundColor: '#1C1800', borderColor: ACCENT },
  filterTabText: { color: MUTED, fontSize: 13 },
  filterTabTextActive: { color: ACCENT, fontWeight: '700' },

  // Item list
  itemList: { paddingHorizontal: 16, gap: 10 },
  itemCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10, marginRight: 10 },
  itemDot: { width: 8, height: 8, borderRadius: 4 },
  itemDotActive: { backgroundColor: '#3ECF8E' },
  itemDotPaused: { backgroundColor: MUTED },
  itemTitle: { color: TEXT, fontSize: 14, fontWeight: '700' },
  itemMeta: { flexDirection: 'row', gap: 10, marginTop: 3 },
  itemCategory: { color: MUTED, fontSize: 12 },
  itemViews: { color: MUTED, fontSize: 12 },
  itemRight: { alignItems: 'flex-end', gap: 8 },
  itemPrice: { color: ACCENT, fontSize: 15, fontWeight: '900' },
  itemActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDelete: { backgroundColor: '#2A0D0D' },
  actionText: { fontSize: 14 },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { color: TEXT, fontSize: 16, fontWeight: '700' },
  emptySubtext: { color: MUTED, fontSize: 13 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  modalSheet: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: BORDER,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { color: TEXT, fontSize: 20, fontWeight: '800', marginBottom: 20 },
  fieldLabel: { color: TEXT, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  fieldInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    height: 48,
    paddingHorizontal: 14,
    color: TEXT,
    fontSize: 14,
    marginBottom: 14,
  },
  fieldInputError: { borderColor: '#E05252' },
  fieldError: { color: '#E05252', fontSize: 12, marginTop: -10, marginBottom: 10 },
  catScroll: { marginBottom: 16 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#1E1E1E',
    marginRight: 8,
  },
  catChipActive: { backgroundColor: '#1C1800', borderColor: ACCENT },
  catChipText: { color: MUTED, fontSize: 13 },
  catChipTextActive: { color: ACCENT, fontWeight: '700' },
  modalBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalBtnDisabled: { opacity: 0.6 },
  modalBtnText: { color: '#0D0D0D', fontSize: 15, fontWeight: '800' },
});
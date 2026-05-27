// TanikaláFarm – Iloilo Poultry Marketplace
// React Native Home Screen
//
// Required packages:
//   npm install @react-navigation/native @react-navigation/bottom-tabs
//   npm install react-native-vector-icons
//   npm install react-native-modal
//   npm install react-native-image-zoom-viewer  (optional for zoom)
//
// For Linking (call/facebook):
//   import { Linking } from 'react-native'  ← built-in, no install needed

import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Image, Modal, Dimensions,
  Animated, StatusBar, Pressable, Linking, SafeAreaView,
  Platform,
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  green:    '#1e6b2e',
  greenDk:  '#144d20',
  greenLt:  '#2e8a42',
  gold:     '#e8a020',
  goldLt:   '#f5c842',
  rust:     '#c1440e',
  cream:    '#fdf8f2',
  creamDk:  '#f0e9dc',
  brown:    '#3b2008',
  brownLt:  '#7a4e2d',
  white:    '#ffffff',
  border:   '#ddd5c5',
  fb:       '#1877f2',
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const ADS = [
  { id:'a1', emoji:'🌾', title:'Bag-o nga Seller?', sub:'Unang buwan libre!', bg:[C.greenDk, C.greenLt] },
  { id:'a2', emoji:'🐔', title:'Broiler Sale!', sub:'₱185/kilo ngayong Mayo', bg:['#7a3800','#c1440e'] },
  { id:'a3', emoji:'💊', title:'Bitamina 20% OFF', sub:'May 27–31 lang', bg:['#5a6e00','#8aac00'] },
];

const CATEGORIES = [
  { id:'all', label:'Tanan', icon:'🏪' },
  { id:'broiler', label:'Broiler', icon:'🐔' },
  { id:'native', label:'Native', icon:'🐓' },
  { id:'layer', label:'Layer', icon:'🥚' },
  { id:'feeds', label:'Feeds', icon:'🌾' },
  { id:'meds', label:'Gamot', icon:'💊' },
  { id:'supplies', label:'Supplies', icon:'🏠' },
];

const SELLERS = [
  {
    id:'s1',
    name:'Mang Ernesto Bacolod',
    farm:'Bacolod Poultry Farm',
    location:'Pavia, Iloilo',
    rating:4.9, reviews:132,
    years:3, plan:'Premium',
    phone:'09171234567',
    facebook:'https://facebook.com',
    avatar:'https://randomuser.me/api/portraits/men/65.jpg',
    listings:[
      {
        id:'l1', type:'Broiler', name:'Live Broiler Chicken',
        detail:'5–6 wks · ~2.5kg avg', price:'₱185', unit:'/kilo',
        qty:'500 available', stock:'high', featured:true,
        images:[
          'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=70',
          'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=400&q=70',
          'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&q=70',
        ],
      },
      {
        id:'l2', type:'Feeds', name:'Broiler Starter 50kg',
        detail:'Brand: FarmBest', price:'₱1,250', unit:'',
        qty:'80 bags', stock:'high', featured:false,
        images:[
          'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=70',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
        ],
      },
      {
        id:'l3', type:'Layer', name:'Native Itlog (Trays)',
        detail:'30 pcs/tray · Fresh', price:'₱220', unit:'/tray',
        qty:'30 trays', stock:'med', featured:false,
        images:[
          'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=70',
        ],
      },
    ],
  },
  {
    id:'s2',
    name:'Nana Felisa Ranario',
    farm:'Felisa\'s Native Poultry',
    location:'Santa Barbara, Iloilo',
    rating:4.8, reviews:87,
    years:2, plan:'Standard',
    phone:'09281234567',
    facebook:'https://facebook.com',
    avatar:'https://randomuser.me/api/portraits/women/68.jpg',
    listings:[
      {
        id:'l4', type:'Native', name:'Bisaya Manok (Buhay)',
        detail:'3–4 months · Free-range', price:'₱320', unit:'/kilo',
        qty:'60 heads', stock:'high', featured:true,
        images:[
          'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=70',
          'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=400&q=70',
        ],
      },
      {
        id:'l5', type:'Feeds', name:'Layer Mash 50kg',
        detail:'High Calcium · Bag', price:'₱1,320', unit:'',
        qty:'45 bags', stock:'high', featured:false,
        images:[
          'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=70',
        ],
      },
      {
        id:'l6', type:'Gamot', name:'Poultry Vitamins 500g',
        detail:'Multi-vitamin · Powder', price:'₱285', unit:'',
        qty:'200 packs', stock:'high', featured:false,
        images:[
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=70',
        ],
      },
    ],
  },
];

// ─── AD BANNER ────────────────────────────────────────────────────────────────
function AdBanner() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (SW - 32));
    setActive(idx);
  };

  return (
    <View style={s.adWrap}>
      <ScrollView
        ref={scrollRef}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={onScroll} scrollEventThrottle={16}
        style={{ borderRadius: 14 }}
      >
        {ADS.map(ad => (
          <View key={ad.id} style={[s.adSlide, { backgroundColor: ad.bg[0] }]}>
            <View>
              <View style={s.adTagRow}>
                <View style={s.adTag}><Text style={s.adTagTxt}>🔥 Espesyal</Text></View>
              </View>
              <Text style={s.adTitle}>{ad.title}</Text>
              <Text style={s.adSub}>{ad.sub}</Text>
            </View>
            <Text style={s.adEmoji}>{ad.emoji}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={s.dotRow}>
        {ADS.map((_, i) => (
          <View key={i} style={[s.dot, active === i && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ─── IMAGE VIEWER MODAL (e-commerce carousel) ─────────────────────────────────
function ImageViewerModal({ images, visible, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex || 0);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setCurrent(idx);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.imgModalBg}>
        <TouchableOpacity style={s.imgModalClose} onPress={onClose}>
          <Text style={s.imgModalCloseTxt}>✕</Text>
        </TouchableOpacity>
        <Text style={s.imgModalCounter}>{current + 1} / {images.length}</Text>
        <ScrollView
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onScroll={onScroll} scrollEventThrottle={16}
          contentOffset={{ x: (initialIndex || 0) * SW, y: 0 }}
        >
          {images.map((img, i) => (
            <View key={i} style={s.imgModalSlide}>
              <Image
                source={{ uri: img }}
                style={s.imgModalImg}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
        <View style={s.imgModalDots}>
          {images.map((_, i) => (
            <View key={i} style={[s.dot, { backgroundColor: current === i ? C.gold : 'rgba(255,255,255,0.4)' }]} />
          ))}
        </View>
      </View>
    </Modal>
  );
}

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
function ListingCard({ item }) {
  const [imgModal, setImgModal] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgActive, setImgActive] = useState(0);

  const stockColor = item.stock === 'high' ? '#2e7d32' : item.stock === 'med' ? '#f57c00' : '#c62828';

  const onImgScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (SW * 0.52));
    setImgActive(idx);
  };

  const openViewer = (idx) => { setImgIndex(idx); setImgModal(true); };

  return (
    <View style={s.listingCard}>
      {item.featured && (
        <View style={s.featuredBadge}><Text style={s.featuredTxt}>⭐ Featured</Text></View>
      )}

      {/* Image carousel */}
      <ScrollView
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={onImgScroll} scrollEventThrottle={16}
        style={s.listingImgScroll}
      >
        {item.images.map((img, i) => (
          <TouchableOpacity key={i} activeOpacity={0.92} onPress={() => openViewer(i)}>
            <Image source={{ uri: img }} style={s.listingImg} resizeMode="cover" />
            <View style={s.imgZoomHint}><Text style={s.imgZoomTxt}>🔍 Tap to expand</Text></View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {item.images.length > 1 && (
        <View style={[s.dotRow, { marginTop: 4, marginBottom: 0 }]}>
          {item.images.map((_, i) => (
            <View key={i} style={[s.dot, imgActive === i && s.dotActive]} />
          ))}
        </View>
      )}

      <View style={s.listingBody}>
        <View style={s.listingTypeRow}>
          <Text style={s.listingType}>{item.type}</Text>
          <View style={[s.stockDot, { backgroundColor: stockColor }]} />
          <Text style={[s.stockTxt, { color: stockColor }]}>{item.qty}</Text>
        </View>
        <Text style={s.listingName}>{item.name}</Text>
        <Text style={s.listingDetail}>{item.detail}</Text>
        <View style={s.listingBottom}>
          <Text style={s.listingPrice}>{item.price}<Text style={s.listingUnit}>{item.unit}</Text></Text>
          <TouchableOpacity style={s.orderBtn}>
            <Text style={s.orderBtnTxt}>🛒 Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ImageViewerModal
        images={item.images}
        visible={imgModal}
        initialIndex={imgIndex}
        onClose={() => setImgModal(false)}
      />
    </View>
  );
}

// ─── SELLER CARD ──────────────────────────────────────────────────────────────
const PLAN_COLORS = {
  Premium:  { bg: C.gold,    text: C.brown },
  Standard: { bg: '#90a4ae', text: C.white },
  Basic:    { bg: '#bdbdbd', text: C.white },
};

function SellerCard({ seller }) {
  const [expanded, setExpanded] = useState(true);
  const plan = PLAN_COLORS[seller.plan] || PLAN_COLORS.Basic;

  const handleCall = () => Linking.openURL(`tel:${seller.phone}`);
  const handleFacebook = () => Linking.openURL(seller.facebook);
  const handleChat = () => {
    // In production: navigate to in-app chat screen
    Linking.openURL(`https://m.me/`);
  };

  const stars = '★'.repeat(Math.floor(seller.rating)) + (seller.rating % 1 >= 0.5 ? '½' : '');

  return (
    <View style={s.sellerCard}>
      {/* ── SELLER HEADER ── */}
      <View style={s.sellerHeader}>
        <Image source={{ uri: seller.avatar }} style={s.avatar} />
        <View style={s.sellerInfo}>
          <View style={s.sellerNameRow}>
            <Text style={s.sellerName}>{seller.name}</Text>
            <View style={s.verifiedBadge}><Text style={s.verifiedTxt}>✅ Verified</Text></View>
          </View>
          <Text style={s.farmName}>{seller.farm}</Text>
          <Text style={s.sellerLoc}>📍 {seller.location}</Text>
          <View style={s.ratingRow}>
            <Text style={s.stars}>{stars}</Text>
            <Text style={s.ratingNum}>{seller.rating}</Text>
            <Text style={s.reviewCnt}>({seller.reviews} reviews)</Text>
            <View style={[s.planBadge, { backgroundColor: plan.bg }]}>
              <Text style={[s.planTxt, { color: plan.text }]}>{seller.plan}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── ACTION BUTTONS (Call, Facebook, Chat) ── */}
      <View style={s.actionRow}>
        <TouchableOpacity style={[s.actionBtn, s.callBtn]} onPress={handleCall} activeOpacity={0.8}>
          <Text style={s.actionBtnIcon}>📞</Text>
          <Text style={s.actionBtnTxt}>Tawag</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.actionBtn, s.fbBtn]} onPress={handleFacebook} activeOpacity={0.8}>
          <Text style={s.actionBtnIcon}>f</Text>
          <Text style={s.actionBtnTxt}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.actionBtn, s.chatBtn]} onPress={handleChat} activeOpacity={0.8}>
          <Text style={s.actionBtnIcon}>💬</Text>
          <Text style={s.actionBtnTxt}>Mensahe</Text>
        </TouchableOpacity>
      </View>

      {/* ── DIVIDER + TOGGLE ── */}
      <TouchableOpacity style={s.listingsToggle} onPress={() => setExpanded(!expanded)}>
        <Text style={s.listingsToggleTxt}>
          {expanded ? '▲' : '▼'}  {seller.listings.length} Listings
        </Text>
      </TouchableOpacity>

      {/* ── LISTING CARDS (horizontal scroll like e-commerce) ── */}
      {expanded && (
        <FlatList
          data={seller.listings}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={s.listingsList}
          renderItem={({ item }) => <ListingCard item={item} />}
          snapToInterval={SW * 0.56}
          decelerationRate="fast"
        />
      )}
    </View>
  );
}

// ─── CATEGORY BAR ─────────────────────────────────────────────────────────────
function CategoryBar({ selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catBar} contentContainerStyle={s.catContent}>
      {CATEGORIES.map(c => (
        <TouchableOpacity
          key={c.id}
          style={[s.catItem, selected === c.id && s.catItemActive]}
          onPress={() => onSelect(c.id)}
        >
          <Text style={s.catIcon}>{c.icon}</Text>
          <Text style={[s.catLabel, selected === c.id && s.catLabelActive]}>{c.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function MarketplaceHomeScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.greenDk} />

      {/* ── NAVBAR ── */}
      <View style={s.navbar}>
        <View style={s.navLogo}>
          <Text style={s.navLogoIcon}>🐓</Text>
          <View>
            <Text style={s.navLogoName}>TanikaláFarm</Text>
            <Text style={s.navLogoSub}>ILOILO POULTRY MARKET</Text>
          </View>
        </View>
        <TouchableOpacity style={s.cartBtn}>
          <Text style={s.cartTxt}>🛒</Text>
        </TouchableOpacity>
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={s.searchBar}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Hanapin ang manok, feeds..."
          placeholderTextColor={C.brownLt}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: C.brownLt, fontSize: 18, paddingHorizontal: 8 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── CATEGORY BAR ── */}
      <CategoryBar selected={category} onSelect={setCategory} />

      {/* ── MAIN SCROLL ── */}
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* AD BANNER */}
        <View style={s.section}>
          <AdBanner />
        </View>

        {/* SMALL ADS */}
        <View style={s.smallAdsRow}>
          <View style={[s.smallAd, { backgroundColor: '#e8f5e9', borderColor: '#a5d6a7' }]}>
            <Text style={s.smallAdIcon}>🚚</Text>
            <Text style={[s.smallAdTxt, { color: C.greenDk }]}>Libre Delivery ₱3k+</Text>
          </View>
          <View style={[s.smallAd, { backgroundColor: '#fff8e1', borderColor: '#ffe082' }]}>
            <Text style={s.smallAdIcon}>💊</Text>
            <Text style={[s.smallAdTxt, { color: '#7a5800' }]}>Bitamina 20% OFF</Text>
          </View>
        </View>

        {/* SECTION HEADER */}
        <View style={s.secHeader}>
          <View style={s.secAccent} />
          <Text style={s.secTitle}>Mga Seller sa Iloilo</Text>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <Text style={s.secLink}>Tan-awa Tanan →</Text>
          </TouchableOpacity>
        </View>

        {/* SORT BAR */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.sortBar} contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}>
          {['Pinaka-Popular','Pinakabago','Presyo: Mababaw','Top Rated'].map((t, i) => (
            <TouchableOpacity key={i} style={[s.sortPill, i === 0 && s.sortPillActive]}>
              <Text style={[s.sortPillTxt, i === 0 && s.sortPillTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SELLER CARDS */}
        <View style={s.sellersList}>
          {SELLERS.map(s2 => <SellerCard key={s2.id} seller={s2} />)}
        </View>

        {/* LOAD MORE */}
        <TouchableOpacity style={s.loadMore}>
          <Text style={s.loadMoreTxt}>Ipakita ang Dugang nga Sellers ↓</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── BOTTOM TAB BAR ── */}
      <View style={s.bottomTab}>
        {[
          { icon:'🏪', label:'Home', active:true },
          { icon:'🔍', label:'Hanapin', active:false },
          { icon:'🛒', label:'Cart', active:false },
          { icon:'🔔', label:'Abiso', active:false },
          { icon:'👤', label:'Profile', active:false },
        ].map((t, i) => (
          <TouchableOpacity key={i} style={s.tabItem}>
            <Text style={s.tabIcon}>{t.icon}</Text>
            <Text style={[s.tabLabel, t.active && { color: C.green, fontWeight:'800' }]}>{t.label}</Text>
            {t.active && <View style={s.tabDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:             { flex:1, backgroundColor: C.greenDk },
  scroll:           { flex:1, backgroundColor:'#f0ebe3' },

  // Navbar
  navbar:           { flexDirection:'row', alignItems:'center', backgroundColor: C.green,
                      paddingHorizontal:16, paddingVertical:10, justifyContent:'space-between' },
  navLogo:          { flexDirection:'row', alignItems:'center', gap:10 },
  navLogoIcon:      { fontSize:28 },
  navLogoName:      { fontWeight:'800', fontSize:17, color: C.gold, letterSpacing:0.3 },
  navLogoSub:       { fontSize:9, color:'rgba(255,255,255,0.55)', letterSpacing:1.2, marginTop:1 },
  cartBtn:          { padding:6 },
  cartTxt:          { fontSize:24 },

  // Search
  searchBar:        { flexDirection:'row', alignItems:'center', backgroundColor: C.white,
                      margin:10, marginTop:8, borderRadius:10, paddingHorizontal:12,
                      borderWidth:1.5, borderColor: C.border },
  searchIcon:       { fontSize:18, marginRight:6 },
  searchInput:      { flex:1, fontSize:15, color: C.brown, paddingVertical:11,
                      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },

  // Categories
  catBar:           { backgroundColor: C.white, borderBottomWidth:1.5, borderBottomColor: C.border },
  catContent:       { paddingHorizontal:8, paddingVertical:6, gap:4 },
  catItem:          { alignItems:'center', paddingHorizontal:12, paddingVertical:7,
                      borderRadius:20, borderWidth:1.5, borderColor:'transparent', marginHorizontal:2 },
  catItemActive:    { backgroundColor:'#e8f5e9', borderColor: C.green },
  catIcon:          { fontSize:18 },
  catLabel:         { fontSize:11, fontWeight:'700', color: C.brownLt, marginTop:2 },
  catLabelActive:   { color: C.green },

  // Sections
  section:          { paddingHorizontal:14, paddingTop:14 },
  secHeader:        { flexDirection:'row', alignItems:'center', paddingHorizontal:14,
                      paddingTop:16, paddingBottom:8, gap:8 },
  secAccent:        { width:4, height:22, backgroundColor: C.gold, borderRadius:2 },
  secTitle:         { fontSize:18, fontWeight:'900', color: C.green },
  secLink:          { fontSize:13, fontWeight:'700', color: C.green },

  // Ad Banner
  adWrap:           { borderRadius:14, overflow:'hidden' },
  adSlide:          { width: SW - 28, height:120, flexDirection:'row',
                      alignItems:'center', justifyContent:'space-between',
                      paddingHorizontal:22, borderRadius:14 },
  adTagRow:         { marginBottom:6 },
  adTag:            { backgroundColor: C.gold, paddingHorizontal:10, paddingVertical:3,
                      borderRadius:20, alignSelf:'flex-start' },
  adTagTxt:         { fontSize:10, fontWeight:'800', color: C.brown, letterSpacing:0.5 },
  adTitle:          { fontSize:20, fontWeight:'900', color:'#fff', lineHeight:24 },
  adSub:            { fontSize:12, color:'rgba(255,255,255,0.8)', marginTop:3 },
  adEmoji:          { fontSize:44, opacity:0.7 },

  // Dots
  dotRow:           { flexDirection:'row', justifyContent:'center', gap:5, marginTop:8 },
  dot:              { width:7, height:7, borderRadius:4, backgroundColor:'rgba(0,0,0,0.15)' },
  dotActive:        { backgroundColor: C.gold, width:18, borderRadius:4 },

  // Small ads
  smallAdsRow:      { flexDirection:'row', gap:10, paddingHorizontal:14, paddingTop:10 },
  smallAd:          { flex:1, flexDirection:'row', alignItems:'center', gap:8,
                      padding:10, borderRadius:10, borderWidth:1.5 },
  smallAdIcon:      { fontSize:20 },
  smallAdTxt:       { fontSize:12, fontWeight:'800', flex:1, lineHeight:16 },

  // Sort bar
  sortBar:          { marginBottom:4 },
  sortPill:         { paddingHorizontal:14, paddingVertical:7, borderRadius:20,
                      borderWidth:1.5, borderColor: C.border, backgroundColor: C.white },
  sortPillActive:   { backgroundColor: C.green, borderColor: C.green },
  sortPillTxt:      { fontSize:12, fontWeight:'700', color: C.brownLt },
  sortPillTxtActive:{ color: C.white },

  // Seller card
  sellersList:      { paddingHorizontal:12, gap:14, marginTop:4 },
  sellerCard:       { backgroundColor: C.white, borderRadius:16,
                      borderWidth:1.5, borderColor: C.border,
                      shadowColor:'#000', shadowOffset:{width:0,height:3},
                      shadowOpacity:0.08, shadowRadius:8, elevation:4,
                      overflow:'hidden', marginBottom:4 },
  sellerHeader:     { flexDirection:'row', padding:14, gap:12, alignItems:'flex-start' },
  avatar:           { width:68, height:68, borderRadius:34, borderWidth:2.5, borderColor: C.gold },
  sellerInfo:       { flex:1 },
  sellerNameRow:    { flexDirection:'row', alignItems:'center', gap:8, flexWrap:'wrap' },
  sellerName:       { fontSize:16, fontWeight:'900', color: C.brown },
  verifiedBadge:    { backgroundColor:'#e8f5e9', paddingHorizontal:8, paddingVertical:2,
                      borderRadius:20, borderWidth:1, borderColor:'#a5d6a7' },
  verifiedTxt:      { fontSize:10, fontWeight:'700', color: C.green },
  farmName:         { fontSize:13, fontWeight:'700', color: C.brownLt, marginTop:2 },
  sellerLoc:        { fontSize:12, color: C.brownLt, marginTop:2 },
  ratingRow:        { flexDirection:'row', alignItems:'center', gap:5, marginTop:5, flexWrap:'wrap' },
  stars:            { color: C.gold, fontSize:14, letterSpacing:1 },
  ratingNum:        { fontSize:13, fontWeight:'800', color: C.brown },
  reviewCnt:        { fontSize:11, color: C.brownLt },
  planBadge:        { paddingHorizontal:9, paddingVertical:2, borderRadius:20 },
  planTxt:          { fontSize:10, fontWeight:'800' },

  // Action buttons
  actionRow:        { flexDirection:'row', gap:8, paddingHorizontal:14, paddingBottom:12 },
  actionBtn:        { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center',
                      gap:5, paddingVertical:11, borderRadius:10 },
  actionBtnIcon:    { fontSize:16 },
  actionBtnTxt:     { fontSize:14, fontWeight:'800', color: C.white },
  callBtn:          { backgroundColor: C.green },
  fbBtn:            { backgroundColor: C.fb },
  chatBtn:          { backgroundColor: C.brown },

  // Listings toggle
  listingsToggle:   { paddingHorizontal:14, paddingVertical:9,
                      borderTopWidth:1.5, borderTopColor: C.creamDk,
                      backgroundColor:'#f9f5ef' },
  listingsToggleTxt:{ fontSize:13, fontWeight:'800', color: C.green },

  // Listing cards
  listingsList:     { paddingHorizontal:12, paddingVertical:12, gap:10 },
  listingCard:      { width: SW * 0.52, backgroundColor: C.cream,
                      borderRadius:12, borderWidth:1.5, borderColor: C.border,
                      overflow:'hidden',
                      shadowColor:'#000', shadowOffset:{width:0,height:2},
                      shadowOpacity:0.07, shadowRadius:6, elevation:3 },
  featuredBadge:    { position:'absolute', top:8, left:0, zIndex:10,
                      backgroundColor: C.gold, paddingHorizontal:9,
                      paddingVertical:3, borderRadius:0,
                      borderTopRightRadius:6, borderBottomRightRadius:6 },
  featuredTxt:      { fontSize:10, fontWeight:'800', color: C.brown },
  listingImgScroll: { width:'100%' },
  listingImg:       { width: SW * 0.52, height:130 },
  imgZoomHint:      { position:'absolute', bottom:6, right:6,
                      backgroundColor:'rgba(0,0,0,0.45)', paddingHorizontal:7,
                      paddingVertical:2, borderRadius:8 },
  imgZoomTxt:       { color:'#fff', fontSize:9, fontWeight:'700' },
  listingBody:      { padding:10 },
  listingTypeRow:   { flexDirection:'row', alignItems:'center', gap:5, marginBottom:3 },
  listingType:      { fontSize:10, fontWeight:'800', color: C.rust,
                      textTransform:'uppercase', letterSpacing:0.6 },
  stockDot:         { width:6, height:6, borderRadius:3 },
  stockTxt:         { fontSize:10, fontWeight:'600', flex:1 },
  listingName:      { fontSize:13, fontWeight:'900', color: C.brown, lineHeight:18 },
  listingDetail:    { fontSize:11, color: C.brownLt, marginTop:2, marginBottom:6 },
  listingBottom:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  listingPrice:     { fontSize:17, fontWeight:'900', color: C.green },
  listingUnit:      { fontSize:11, color: C.brownLt, fontWeight:'600' },
  orderBtn:         { backgroundColor: C.gold, paddingHorizontal:10, paddingVertical:6,
                      borderRadius:7 },
  orderBtnTxt:      { fontSize:12, fontWeight:'800', color: C.brown },

  // Image viewer modal
  imgModalBg:       { flex:1, backgroundColor:'rgba(0,0,0,0.95)', justifyContent:'center' },
  imgModalClose:    { position:'absolute', top:50, right:20, zIndex:10,
                      backgroundColor:'rgba(255,255,255,0.15)', width:40, height:40,
                      borderRadius:20, alignItems:'center', justifyContent:'center' },
  imgModalCloseTxt: { color:'#fff', fontSize:18, fontWeight:'800' },
  imgModalCounter:  { position:'absolute', top:55, alignSelf:'center', zIndex:10,
                      color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:'700' },
  imgModalSlide:    { width: SW, justifyContent:'center', alignItems:'center' },
  imgModalImg:      { width: SW, height: SH * 0.65 },
  imgModalDots:     { flexDirection:'row', justifyContent:'center', gap:6,
                      position:'absolute', bottom:60 },

  // Load more
  loadMore:         { margin:16, padding:14, backgroundColor: C.white,
                      borderRadius:10, borderWidth:2, borderColor: C.green,
                      alignItems:'center' },
  loadMoreTxt:      { fontSize:14, fontWeight:'800', color: C.green },

  // Bottom tabs
  bottomTab:        { flexDirection:'row', backgroundColor: C.white,
                      borderTopWidth:1.5, borderTopColor: C.border,
                      paddingBottom: Platform.OS === 'ios' ? 20 : 6, paddingTop:6 },
  tabItem:          { flex:1, alignItems:'center', position:'relative' },
  tabIcon:          { fontSize:22 },
  tabLabel:         { fontSize:10, fontWeight:'700', color: C.brownLt, marginTop:1 },
  tabDot:           { position:'absolute', bottom:-4, width:20, height:3,
                      backgroundColor: C.green, borderRadius:2 },
});
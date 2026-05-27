// TanikaláFarm – Iloilo Poultry Marketplace
// React Native · Black & White Minimalist · Carousell-inspired
//
// Required:
//   npm install @react-navigation/native
//   (Linking, Modal, ScrollView, FlatList are all built-in RN)

import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Image, Modal, Dimensions,
  StatusBar, Linking, SafeAreaView, Platform,
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── BLACK & WHITE MINIMALIST THEME ─────────────────────────────────────────
const C = {
  black:    '#111111',
  blackSoft:'#222222',
  gray1:    '#444444',
  gray2:    '#888888',
  gray3:    '#bbbbbb',
  gray4:    '#dedede',
  gray5:    '#f2f2f2',
  white:    '#ffffff',
  offWhite: '#fafafa',
  accent:   '#111111',   // primary action = black
  accentInv:'#ffffff',   // text on black
  gold:     '#c9a84c',   // only subtle warm accent
  fb:       '#1877f2',
  red:      '#e53935',
  green:    '#2e7d32',
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const PREMIUM_SELLER = {
  name:    'Ernesto Bacolod',
  farm:    'Bacolod Poultry Farm',
  tagline: "Iloilo's #1 Rated Broiler Supplier",
  location:'Pavia, Iloilo',
  rating:  4.9, reviews: 132, years: 6,
  phone:   '09171234567',
  facebook:'https://facebook.com',
  avatar:  'https://randomuser.me/api/portraits/men/65.jpg',
  cover:   'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80',
  highlights: ['500+ Broilers Ready', 'Free Delivery ₱3k+', 'DA Accredited'],
};

const ADS = [
  {
    id:'ad1',
    label:'SPONSORED',
    title:'First Month Free',
    sub:'New sellers — subscribe now and list for free your first month.',
    cta:'Sign Up',
    bg: C.black,
    emoji:'🐓',
  },
  {
    id:'ad2',
    label:'PROMO',
    title:'Broiler Sale',
    sub:'₱185/kilo — Limited stocks this May only.',
    cta:'View Deals',
    bg: C.blackSoft,
    emoji:'🌾',
  },
  {
    id:'ad3',
    label:'NEW',
    title:'Verified Sellers',
    sub:'Buy with confidence — all listings are DA-verified.',
    cta:'Browse Now',
    bg: C.gray1,
    emoji:'✅',
  },
];

const CHICKEN_CATEGORIES = [
  { id:'broiler',  label:'Broiler',       icon:'🐔', count:'240+ listings' },
  { id:'native',   label:'Native',        icon:'🐓', count:'180+ listings' },
  { id:'layer',    label:'Layer',         icon:'🥚', count:'95+ listings'  },
  { id:'fighting', label:'Fighting Cock', icon:'🏆', count:'60+ listings'  },
  { id:'chicks',   label:'Day-Old Chicks',icon:'🐣', count:'120+ listings' },
];

const SELLERS = [
  {
    id:'s1',
    name:'Ernesto Bacolod',
    farm:'Bacolod Poultry Farm',
    location:'Pavia, Iloilo',
    rating:4.9, reviews:132, years:3, plan:'Premium',
    phone:'09171234567',
    facebook:'https://facebook.com',
    avatar:'https://randomuser.me/api/portraits/men/65.jpg',
    listings:[
      {
        id:'l1', type:'Broiler', name:'Live Broiler Chicken',
        detail:'5–6 weeks · ~2.5 kg avg', price:'₱185', unit:'/kilo',
        qty:'500 heads', stock:'high', featured:true,
        images:[
          'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&q=75',
          'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=500&q=75',
          'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&q=75',
        ],
      },
      {
        id:'l2', type:'Native', name:'Native Free-Range Chicken',
        detail:'4–5 months · Free-range', price:'₱310', unit:'/kilo',
        qty:'80 heads', stock:'high', featured:false,
        images:[
          'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=500&q=75',
          'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&q=75',
        ],
      },
      {
        id:'l3', type:'Chicks', name:'Day-Old Broiler Chicks',
        detail:'Vaccinated · Per head', price:'₱42', unit:'/head',
        qty:'300 heads', stock:'high', featured:false,
        images:[
          'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&q=75',
        ],
      },
    ],
  },
  {
    id:'s2',
    name:'Felisa Ranario',
    farm:"Felisa's Native Poultry",
    location:'Santa Barbara, Iloilo',
    rating:4.8, reviews:87, years:2, plan:'Standard',
    phone:'09281234567',
    facebook:'https://facebook.com',
    avatar:'https://randomuser.me/api/portraits/women/68.jpg',
    listings:[
      {
        id:'l4', type:'Native', name:'Native Chicken (Live)',
        detail:'3–4 months · Free-range', price:'₱320', unit:'/kilo',
        qty:'60 heads', stock:'high', featured:true,
        images:[
          'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&q=75',
          'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=500&q=75',
        ],
      },
      {
        id:'l5', type:'Layer', name:'Layer Chicken (Laying)',
        detail:'6 months old · Active layers', price:'₱280', unit:'/head',
        qty:'45 heads', stock:'med', featured:false,
        images:[
          'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=500&q=75',
        ],
      },
    ],
  },
];

// ─── IMAGE VIEWER MODAL ──────────────────────────────────────────────────────
function ImageViewerModal({ images, visible, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex || 0);
  const onScroll = e => setCurrent(Math.round(e.nativeEvent.contentOffset.x / SW));
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
              <Image source={{ uri: img }} style={s.imgModalImg} resizeMode="contain" />
            </View>
          ))}
        </ScrollView>
        <View style={s.imgModalDots}>
          {images.map((_, i) => (
            <View key={i} style={[s.dot, { backgroundColor: i === current ? C.white : 'rgba(255,255,255,0.3)', width: i === current ? 18 : 7 }]} />
          ))}
        </View>
      </View>
    </Modal>
  );
}

// ─── LISTING CARD with image carousel + semi-transparent nav arrows ──────────
function ListingCard({ item }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollRef = useRef(null);
  const CARD_W = SW * 0.54;

  const onImgScroll = e => setImgIdx(Math.round(e.nativeEvent.contentOffset.x / CARD_W));

  const goPrev = () => {
    if (imgIdx <= 0) return;
    scrollRef.current?.scrollTo({ x: (imgIdx - 1) * CARD_W, animated: true });
    setImgIdx(imgIdx - 1);
  };
  const goNext = () => {
    if (imgIdx >= item.images.length - 1) return;
    scrollRef.current?.scrollTo({ x: (imgIdx + 1) * CARD_W, animated: true });
    setImgIdx(imgIdx + 1);
  };

  const stockColor = item.stock === 'high' ? C.green : item.stock === 'med' ? '#e65100' : C.red;

  return (
    <View style={[s.listingCard, { width: CARD_W }]}>
      {item.featured && (
        <View style={s.featuredBadge}><Text style={s.featuredTxt}>FEATURED</Text></View>
      )}

      {/* ── IMAGE CAROUSEL ── */}
      <View style={{ position:'relative' }}>
        <ScrollView
          ref={scrollRef}
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onScroll={onImgScroll} scrollEventThrottle={16}
        >
          {item.images.map((img, i) => (
            <TouchableOpacity key={i} activeOpacity={0.95} onPress={() => { setImgIdx(i); setModalVisible(true); }}>
              <Image source={{ uri: img }} style={[s.listingImg, { width: CARD_W }]} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Semi-transparent prev/next arrows */}
        {item.images.length > 1 && imgIdx > 0 && (
          <TouchableOpacity style={[s.carouselArrow, s.carouselArrowLeft]} onPress={goPrev}>
            <Text style={s.carouselArrowTxt}>‹</Text>
          </TouchableOpacity>
        )}
        {item.images.length > 1 && imgIdx < item.images.length - 1 && (
          <TouchableOpacity style={[s.carouselArrow, s.carouselArrowRight]} onPress={goNext}>
            <Text style={s.carouselArrowTxt}>›</Text>
          </TouchableOpacity>
        )}

        {/* Image count badge */}
        {item.images.length > 1 && (
          <View style={s.imgCountBadge}>
            <Text style={s.imgCountTxt}>{imgIdx + 1}/{item.images.length}</Text>
          </View>
        )}
      </View>

      {/* Dot indicators */}
      {item.images.length > 1 && (
        <View style={[s.dotRow, { marginTop:5, marginBottom:0 }]}>
          {item.images.map((_, i) => (
            <View key={i} style={[s.dot, i === imgIdx && s.dotActive]} />
          ))}
        </View>
      )}

      {/* ── CARD BODY ── */}
      <View style={s.listingBody}>
        <View style={s.listingTypeRow}>
          <Text style={s.listingType}>{item.type.toUpperCase()}</Text>
          <View style={[s.stockPill, { borderColor: stockColor }]}>
            <View style={[s.stockDot, { backgroundColor: stockColor }]} />
            <Text style={[s.stockTxt, { color: stockColor }]}>{item.qty}</Text>
          </View>
        </View>
        <Text style={s.listingName}>{item.name}</Text>
        <Text style={s.listingDetail}>{item.detail}</Text>
        <View style={s.listingBottom}>
          <View>
            <Text style={s.listingPrice}>{item.price}</Text>
            {item.unit ? <Text style={s.listingUnit}>{item.unit}</Text> : null}
          </View>
          <TouchableOpacity style={s.orderBtn}>
            <Text style={s.orderBtnTxt}>Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ImageViewerModal
        images={item.images} visible={modalVisible}
        initialIndex={imgIdx} onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

// ─── SELLER CARD ─────────────────────────────────────────────────────────────
const PLAN_META = {
  Premium:  { label:'PREMIUM',  bg: C.black,   text: C.white },
  Standard: { label:'STANDARD', bg: C.gray2,   text: C.white },
  Basic:    { label:'BASIC',    bg: C.gray4,   text: C.black },
};

function SellerCard({ seller }) {
  const [expanded, setExpanded] = useState(true);
  const plan = PLAN_META[seller.plan] || PLAN_META.Basic;
  const stars = '★'.repeat(Math.floor(seller.rating)) + (seller.rating % 1 >= 0.5 ? '½' : '');

  return (
    <View style={s.sellerCard}>
      {/* HEADER */}
      <View style={s.sellerHeader}>
        <Image source={{ uri: seller.avatar }} style={s.avatar} />
        <View style={s.sellerInfo}>
          <View style={s.sellerNameRow}>
            <Text style={s.sellerName}>{seller.name}</Text>
            <View style={[s.planBadge, { backgroundColor: plan.bg }]}>
              <Text style={[s.planTxt, { color: plan.text }]}>{plan.label}</Text>
            </View>
          </View>
          <Text style={s.farmName}>{seller.farm}</Text>
          <Text style={s.sellerLoc}>📍 {seller.location}</Text>
          <View style={s.ratingRow}>
            <Text style={s.stars}>{stars}</Text>
            <Text style={s.ratingNum}>{seller.rating}</Text>
            <Text style={s.reviewCnt}>· {seller.reviews} reviews · {seller.years} yrs</Text>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={s.actionRow}>
        <TouchableOpacity
          style={[s.actionBtn, s.callBtn]}
          onPress={() => Linking.openURL(`tel:${seller.phone}`)}
        >
          <Text style={s.actionIcon}>📞</Text>
          <Text style={s.actionTxt}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.actionBtn, s.fbBtn]}
          onPress={() => Linking.openURL(seller.facebook)}
        >
          <Text style={[s.actionIcon, { color: C.white, fontWeight:'900', fontFamily: Platform.OS==='ios'?'Georgia':'serif' }]}>f</Text>
          <Text style={s.actionTxt}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.actionBtn, s.msgBtn]}
          onPress={() => Linking.openURL('https://m.me/')}
        >
          <Text style={s.actionIcon}>💬</Text>
          <Text style={[s.actionTxt, { color: C.black }]}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* TOGGLE */}
      <TouchableOpacity style={s.listingsToggle} onPress={() => setExpanded(!expanded)}>
        <Text style={s.listingsToggleTxt}>
          {expanded ? '▲' : '▼'}  {seller.listings.length} Chicken Listings
        </Text>
      </TouchableOpacity>

      {/* LISTING CAROUSEL */}
      {expanded && (
        <FlatList
          data={seller.listings}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={s.listingsList}
          renderItem={({ item }) => <ListingCard item={item} />}
          snapToInterval={SW * 0.54 + 10}
          decelerationRate="fast"
        />
      )}
    </View>
  );
}

// ─── PREMIUM SELLER HERO (top banner) ───────────────────────────────────────
function PremiumHero() {
  return (
    <View style={s.premiumHero}>
      <Image source={{ uri: PREMIUM_SELLER.cover }} style={s.premiumCoverImg} resizeMode="cover" />
      <View style={s.premiumOverlay} />
      <View style={s.premiumContent}>
        <View style={s.premiumTopRow}>
          <View style={s.premiumBadge}><Text style={s.premiumBadgeTxt}>⭐ PREMIUM SELLER</Text></View>
          <View style={s.premiumRating}>
            <Text style={s.premiumRatingTxt}>★ {PREMIUM_SELLER.rating}</Text>
          </View>
        </View>
        <View style={s.premiumAvatarRow}>
          <Image source={{ uri: PREMIUM_SELLER.avatar }} style={s.premiumAvatar} />
          <View style={{ flex:1 }}>
            <Text style={s.premiumName}>{PREMIUM_SELLER.name}</Text>
            <Text style={s.premiumFarm}>{PREMIUM_SELLER.farm}</Text>
            <Text style={s.premiumLoc}>📍 {PREMIUM_SELLER.location}</Text>
          </View>
        </View>
        <Text style={s.premiumTagline}>{PREMIUM_SELLER.tagline}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop:10 }}>
          {PREMIUM_SELLER.highlights.map((h, i) => (
            <View key={i} style={s.highlightChip}>
              <Text style={s.highlightTxt}>{h}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={s.premiumActions}>
          <TouchableOpacity style={s.premiumCallBtn} onPress={() => Linking.openURL(`tel:${PREMIUM_SELLER.phone}`)}>
            <Text style={s.premiumCallTxt}>📞  Call Seller</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.premiumFbBtn} onPress={() => Linking.openURL(PREMIUM_SELLER.facebook)}>
            <Text style={s.premiumFbTxt}>f  Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── AD BANNER ───────────────────────────────────────────────────────────────
function AdBanner() {
  const [active, setActive] = useState(0);
  const SLIDE_W = SW - 28;
  return (
    <View style={s.adWrap}>
      <ScrollView
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={e => setActive(Math.round(e.nativeEvent.contentOffset.x / SLIDE_W))}
        scrollEventThrottle={16}
      >
        {ADS.map(ad => (
          <View key={ad.id} style={[s.adSlide, { width: SLIDE_W, backgroundColor: ad.bg }]}>
            <View style={{ flex:1 }}>
              <View style={s.adLabelRow}>
                <Text style={s.adLabel}>{ad.label}</Text>
              </View>
              <Text style={s.adTitle}>{ad.title}</Text>
              <Text style={s.adSub}>{ad.sub}</Text>
              <TouchableOpacity style={s.adCta}><Text style={s.adCtaTxt}>{ad.cta} →</Text></TouchableOpacity>
            </View>
            <Text style={s.adEmoji}>{ad.emoji}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={s.dotRow}>
        {ADS.map((_, i) => (
          <View key={i} style={[s.dot, i === active && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ─── CHICKEN CATEGORIES ──────────────────────────────────────────────────────
function ChickenCategories({ selected, onSelect }) {
  return (
    <View style={s.catSection}>
      <View style={s.catSectionHeader}>
        <Text style={s.catSectionTitle}>Chicken</Text>
        <TouchableOpacity><Text style={s.catSectionLink}>View all →</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
        {CHICKEN_CATEGORIES.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[s.catCard, selected === c.id && s.catCardActive]}
            onPress={() => onSelect(c.id)}
          >
            <Text style={s.catCardIcon}>{c.icon}</Text>
            <Text style={[s.catCardLabel, selected === c.id && s.catCardLabelActive]}>{c.label}</Text>
            <Text style={[s.catCardCount, selected === c.id && { color: C.white }]}>{c.count}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function MarketplaceHomeScreen() {
  const [search, setSearch] = useState('');
  const [chickenCat, setChickenCat] = useState('broiler');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* NAVBAR */}
      <View style={s.navbar}>
        <View style={s.navLogo}>
          <Text style={s.navLogoIcon}>🐓</Text>
          <View>
            <Text style={s.navLogoName}>TanikaláFarm</Text>
            <Text style={s.navLogoSub}>ILOILO POULTRY MARKET</Text>
          </View>
        </View>
        <View style={s.navRight}>
          <TouchableOpacity style={s.navIconBtn}><Text style={s.navIconTxt}>🔔</Text></TouchableOpacity>
          <TouchableOpacity style={s.navIconBtn}><Text style={s.navIconTxt}>🛒</Text></TouchableOpacity>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search chicken listings in Iloilo..."
            placeholderTextColor={C.gray3}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color:C.gray3, fontSize:17, paddingHorizontal:6 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MAIN SCROLL */}
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── TOP: PREMIUM SELLER HERO ── */}
        <PremiumHero />

        {/* ── ADS BANNER ── */}
        <View style={s.adSection}>
          <View style={s.adSectionHeader}>
            <Text style={s.adSectionLabel}>ADVERTISEMENTS</Text>
          </View>
          <AdBanner />
        </View>

        {/* ── CHICKEN CATEGORY TILES ── */}
        <ChickenCategories selected={chickenCat} onSelect={setChickenCat} />

        {/* DIVIDER */}
        <View style={s.dividerFull} />

        {/* ── SELLERS SECTION ── */}
        <View style={s.secHeader}>
          <View style={s.secAccent} />
          <Text style={s.secTitle}>Chicken Sellers</Text>
          <TouchableOpacity style={{ marginLeft:'auto' }}>
            <Text style={s.secLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        {/* SORT PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal:14, gap:8, paddingBottom:10 }}>
          {['Most Popular','Newest','Price: Low','Top Rated'].map((t, i) => (
            <TouchableOpacity key={i} style={[s.sortPill, i===0 && s.sortPillActive]}>
              <Text style={[s.sortPillTxt, i===0 && s.sortPillTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SELLER CARDS */}
        <View style={s.sellersList}>
          {SELLERS.map(seller => <SellerCard key={seller.id} seller={seller} />)}
        </View>

        {/* LOAD MORE */}
        <TouchableOpacity style={s.loadMore}>
          <Text style={s.loadMoreTxt}>Show More Sellers ↓</Text>
        </TouchableOpacity>

        <View style={{ height:30 }} />
      </ScrollView>

      {/* BOTTOM TABS */}
      <View style={s.bottomTab}>
        {[
          { icon:'🏪', label:'Home',    active:true  },
          { icon:'🔍', label:'Search',  active:false },
          { icon:'🛒', label:'Cart',    active:false },
          { icon:'🔔', label:'Alerts',  active:false },
          { icon:'👤', label:'Profile', active:false },
        ].map((t, i) => (
          <TouchableOpacity key={i} style={s.tabItem}>
            <Text style={s.tabIcon}>{t.icon}</Text>
            <Text style={[s.tabLabel, t.active && s.tabLabelActive]}>{t.label}</Text>
            {t.active && <View style={s.tabDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex:1, backgroundColor: C.white },
  scroll: { flex:1, backgroundColor: C.gray5 },

  // Navbar
  navbar:       { flexDirection:'row', alignItems:'center', backgroundColor: C.white,
                  paddingHorizontal:16, paddingVertical:10,
                  borderBottomWidth:1, borderBottomColor: C.gray4,
                  justifyContent:'space-between' },
  navLogo:      { flexDirection:'row', alignItems:'center', gap:10 },
  navLogoIcon:  { fontSize:26 },
  navLogoName:  { fontWeight:'900', fontSize:17, color: C.black, letterSpacing:-0.3 },
  navLogoSub:   { fontSize:8, color: C.gray2, letterSpacing:1.5, marginTop:1 },
  navRight:     { flexDirection:'row', gap:4 },
  navIconBtn:   { padding:6 },
  navIconTxt:   { fontSize:22 },

  // Search
  searchWrap:   { backgroundColor: C.white, paddingHorizontal:14, paddingVertical:8,
                  borderBottomWidth:1, borderBottomColor: C.gray4 },
  searchBar:    { flexDirection:'row', alignItems:'center', backgroundColor: C.gray5,
                  borderRadius:10, paddingHorizontal:12,
                  borderWidth:1.5, borderColor: C.gray4 },
  searchIcon:   { fontSize:16, marginRight:6 },
  searchInput:  { flex:1, fontSize:15, color: C.black, paddingVertical:11 },

  // ── PREMIUM HERO ──
  premiumHero:     { margin:14, borderRadius:16, overflow:'hidden',
                     shadowColor:'#000', shadowOffset:{width:0,height:4},
                     shadowOpacity:0.18, shadowRadius:14, elevation:6 },
  premiumCoverImg: { width:'100%', height:220, position:'absolute', top:0, left:0 },
  premiumOverlay:  { ...StyleSheet.absoluteFillObject,
                     backgroundColor:'rgba(0,0,0,0.62)' },
  premiumContent:  { padding:18 },
  premiumTopRow:   { flexDirection:'row', justifyContent:'space-between', marginBottom:12 },
  premiumBadge:    { backgroundColor:'rgba(255,255,255,0.18)',
                     borderWidth:1, borderColor:'rgba(255,255,255,0.4)',
                     paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  premiumBadgeTxt: { color: C.white, fontSize:10, fontWeight:'900', letterSpacing:1 },
  premiumRating:   { backgroundColor: C.gold, paddingHorizontal:10,
                     paddingVertical:4, borderRadius:20 },
  premiumRatingTxt:{ color: C.white, fontSize:11, fontWeight:'900' },
  premiumAvatarRow:{ flexDirection:'row', alignItems:'center', gap:12, marginBottom:10 },
  premiumAvatar:   { width:56, height:56, borderRadius:28,
                     borderWidth:2.5, borderColor: C.white },
  premiumName:     { fontSize:18, fontWeight:'900', color: C.white },
  premiumFarm:     { fontSize:13, fontWeight:'700', color:'rgba(255,255,255,0.8)', marginTop:1 },
  premiumLoc:      { fontSize:12, color:'rgba(255,255,255,0.65)', marginTop:2 },
  premiumTagline:  { fontSize:13, color:'rgba(255,255,255,0.85)',
                     fontStyle:'italic', marginBottom:6 },
  highlightChip:   { backgroundColor:'rgba(255,255,255,0.15)',
                     borderWidth:1, borderColor:'rgba(255,255,255,0.3)',
                     paddingHorizontal:12, paddingVertical:5,
                     borderRadius:20, marginRight:8 },
  highlightTxt:    { color: C.white, fontSize:11, fontWeight:'700' },
  premiumActions:  { flexDirection:'row', gap:10, marginTop:14 },
  premiumCallBtn:  { flex:1, backgroundColor: C.white, paddingVertical:12,
                     borderRadius:10, alignItems:'center' },
  premiumCallTxt:  { color: C.black, fontWeight:'900', fontSize:14 },
  premiumFbBtn:    { flex:1, backgroundColor: C.fb, paddingVertical:12,
                     borderRadius:10, alignItems:'center' },
  premiumFbTxt:    { color: C.white, fontWeight:'900', fontSize:14 },

  // ── ADS ──
  adSection:       { paddingHorizontal:14, paddingTop:6 },
  adSectionHeader: { marginBottom:8 },
  adSectionLabel:  { fontSize:20, fontWeight:'900', color: C.gray2,
                     letterSpacing:2, textTransform:'uppercase' },
  adWrap:          { borderRadius:12, overflow:'hidden' },
  adSlide:         { height:100, flexDirection:'row', alignItems:'center',
                     justifyContent:'space-between', paddingHorizontal:20,
                     borderRadius:12 },
  adLabelRow:      { marginBottom:5 },
  adLabel:         { fontSize:9, fontWeight:'900', color:'rgba(255,255,255,0.6)',
                     letterSpacing:2 },
  adTitle:         { fontSize:18, fontWeight:'900', color: C.white, lineHeight:22 },
  adSub:           { fontSize:11, color:'rgba(255,255,255,0.75)', marginTop:3 },
  adCta:           { marginTop:7, alignSelf:'flex-start',
                     borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.6)' },
  adCtaTxt:        { fontSize:11, fontWeight:'800', color: C.white },
  adEmoji:         { fontSize:40, opacity:0.55, marginLeft:10 },

  dotRow:          { flexDirection:'row', justifyContent:'center', gap:5, marginTop:8 },
  dot:             { width:7, height:7, borderRadius:4, backgroundColor: C.gray3 },
  dotActive:       { backgroundColor: C.black, width:18, borderRadius:4 },

  // ── CHICKEN CATEGORIES ──
  catSection:       { backgroundColor: C.white, paddingVertical:16, marginTop:10 },
  catSectionHeader: { flexDirection:'row', justifyContent:'space-between',
                      alignItems:'center', paddingHorizontal:14, marginBottom:12 },
  catSectionTitle:  { fontSize:18, fontWeight:'900', color: C.black },
  catSectionLink:   { fontSize:13, fontWeight:'700', color: C.gray2 },
  catRow:           { paddingHorizontal:12, gap:10 },
  catCard:          { width:100, backgroundColor: C.gray5, borderRadius:12,
                      padding:12, alignItems:'center', gap:4,
                      borderWidth:1.5, borderColor: C.gray4 },
  catCardActive:    { backgroundColor: C.black, borderColor: C.black },
  catCardIcon:      { fontSize:24 },
  catCardLabel:     { fontSize:13, fontWeight:'800', color: C.black, textAlign:'center' },
  catCardLabelActive:{ color: C.white },
  catCardCount:     { fontSize:10, color: C.gray2, textAlign:'center' },

  dividerFull:      { height:1, backgroundColor: C.gray4, marginVertical:10 },

  // ── SECTION HEADER ──
  secHeader:  { flexDirection:'row', alignItems:'center', paddingHorizontal:14,
                paddingTop:14, paddingBottom:6, gap:8 },
  secAccent:  { width:3, height:20, backgroundColor: C.black, borderRadius:2 },
  secTitle:   { fontSize:18, fontWeight:'900', color: C.black },
  secLink:    { fontSize:13, fontWeight:'700', color: C.gray2 },

  // Sort pills
  sortPill:        { paddingHorizontal:14, paddingVertical:7, borderRadius:20,
                     borderWidth:1.5, borderColor: C.gray4, backgroundColor: C.white },
  sortPillActive:  { backgroundColor: C.black, borderColor: C.black },
  sortPillTxt:     { fontSize:12, fontWeight:'700', color: C.gray2 },
  sortPillTxtActive:{ color: C.white },

  // ── SELLER CARD ──
  sellersList:  { paddingHorizontal:12, gap:14 },
  sellerCard:   { backgroundColor: C.white, borderRadius:16,
                  borderWidth:1, borderColor: C.gray4,
                  shadowColor:'#000', shadowOffset:{width:0,height:2},
                  shadowOpacity:0.07, shadowRadius:8, elevation:3,
                  overflow:'hidden', marginBottom:4 },
  sellerHeader: { flexDirection:'row', padding:14, gap:12, alignItems:'flex-start' },
  avatar:       { width:62, height:62, borderRadius:31,
                  borderWidth:2, borderColor: C.black },
  sellerInfo:   { flex:1 },
  sellerNameRow:{ flexDirection:'row', alignItems:'center', gap:8, flexWrap:'wrap' },
  sellerName:   { fontSize:15, fontWeight:'900', color: C.black },
  planBadge:    { paddingHorizontal:8, paddingVertical:2, borderRadius:4 },
  planTxt:      { fontSize:9, fontWeight:'900', letterSpacing:0.8 },
  farmName:     { fontSize:12, fontWeight:'700', color: C.gray1, marginTop:2 },
  sellerLoc:    { fontSize:11, color: C.gray2, marginTop:2 },
  ratingRow:    { flexDirection:'row', alignItems:'center', gap:4, marginTop:5 },
  stars:        { color: C.gold, fontSize:13, letterSpacing:1 },
  ratingNum:    { fontSize:13, fontWeight:'900', color: C.black },
  reviewCnt:    { fontSize:11, color: C.gray2 },

  // Action buttons
  actionRow:    { flexDirection:'row', gap:8, paddingHorizontal:14, paddingBottom:12 },
  actionBtn:    { flex:1, flexDirection:'row', alignItems:'center',
                  justifyContent:'center', gap:5,
                  paddingVertical:11, borderRadius:10 },
  actionIcon:   { fontSize:15 },
  actionTxt:    { fontSize:13, fontWeight:'800', color: C.white },
  callBtn:      { backgroundColor: C.black },
  fbBtn:        { backgroundColor: C.fb },
  msgBtn:       { backgroundColor: C.gray5, borderWidth:1.5, borderColor: C.gray4 },

  // Listings
  listingsToggle:    { paddingHorizontal:14, paddingVertical:9,
                       borderTopWidth:1, borderTopColor: C.gray4,
                       backgroundColor: C.gray5 },
  listingsToggleTxt: { fontSize:12, fontWeight:'900', color: C.black,
                       letterSpacing:0.3, textTransform:'uppercase' },
  listingsList:      { paddingHorizontal:12, paddingVertical:12, gap:10 },

  // Listing card
  listingCard:       { backgroundColor: C.white, borderRadius:12,
                       borderWidth:1, borderColor: C.gray4, overflow:'hidden',
                       shadowColor:'#000', shadowOffset:{width:0,height:1},
                       shadowOpacity:0.06, shadowRadius:4, elevation:2 },
  featuredBadge:     { position:'absolute', top:8, left:0, zIndex:10,
                       backgroundColor: C.black,
                       paddingHorizontal:9, paddingVertical:3,
                       borderTopRightRadius:5, borderBottomRightRadius:5 },
  featuredTxt:       { fontSize:9, fontWeight:'900', color: C.white, letterSpacing:1 },
  listingImg:        { height:130 },

  // Carousel arrows
  carouselArrow:     { position:'absolute', top:'50%', marginTop:-18,
                       width:32, height:32, borderRadius:16,
                       backgroundColor:'rgba(0,0,0,0.35)',
                       alignItems:'center', justifyContent:'center', zIndex:10 },
  carouselArrowLeft: { left:6 },
  carouselArrowRight:{ right:6 },
  carouselArrowTxt:  { color: C.white, fontSize:22, fontWeight:'300', marginTop:-2 },
  imgCountBadge:     { position:'absolute', bottom:6, right:6, zIndex:10,
                       backgroundColor:'rgba(0,0,0,0.45)',
                       paddingHorizontal:8, paddingVertical:2, borderRadius:10 },
  imgCountTxt:       { color: C.white, fontSize:10, fontWeight:'700' },

  listingBody:       { padding:10 },
  listingTypeRow:    { flexDirection:'row', alignItems:'center',
                       justifyContent:'space-between', marginBottom:4 },
  listingType:       { fontSize:9, fontWeight:'900', color: C.black,
                       letterSpacing:1.2 },
  stockPill:         { flexDirection:'row', alignItems:'center', gap:3,
                       borderWidth:1, borderRadius:10,
                       paddingHorizontal:6, paddingVertical:2 },
  stockDot:          { width:5, height:5, borderRadius:3 },
  stockTxt:          { fontSize:9, fontWeight:'700' },
  listingName:       { fontSize:13, fontWeight:'900', color: C.black, lineHeight:18 },
  listingDetail:     { fontSize:11, color: C.gray2, marginTop:2, marginBottom:8 },
  listingBottom:     { flexDirection:'row', alignItems:'flex-end',
                       justifyContent:'space-between' },
  listingPrice:      { fontSize:18, fontWeight:'900', color: C.black },
  listingUnit:       { fontSize:10, color: C.gray2, fontWeight:'600' },
  orderBtn:          { backgroundColor: C.black,
                       paddingHorizontal:14, paddingVertical:8, borderRadius:8 },
  orderBtnTxt:       { fontSize:12, fontWeight:'900', color: C.white },

  // Image viewer modal
  imgModalBg:        { flex:1, backgroundColor:'rgba(0,0,0,0.97)',
                       justifyContent:'center' },
  imgModalClose:     { position:'absolute', top:50, right:20, zIndex:10,
                       backgroundColor:'rgba(255,255,255,0.12)', width:40, height:40,
                       borderRadius:20, alignItems:'center', justifyContent:'center' },
  imgModalCloseTxt:  { color: C.white, fontSize:18, fontWeight:'800' },
  imgModalCounter:   { position:'absolute', top:55, alignSelf:'center', zIndex:10,
                       color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:'700' },
  imgModalSlide:     { width: SW, justifyContent:'center', alignItems:'center' },
  imgModalImg:       { width: SW, height: SH * 0.65 },
  imgModalDots:      { flexDirection:'row', justifyContent:'center',
                       gap:6, position:'absolute', bottom:60 },

  // Load more
  loadMore:     { margin:16, padding:14, backgroundColor: C.white,
                  borderRadius:10, borderWidth:1.5, borderColor: C.black,
                  alignItems:'center' },
  loadMoreTxt:  { fontSize:14, fontWeight:'900', color: C.black },

  // Bottom tabs
  bottomTab:    { flexDirection:'row', backgroundColor: C.white,
                  borderTopWidth:1, borderTopColor: C.gray4,
                  paddingBottom: Platform.OS==='ios' ? 20 : 6, paddingTop:6 },
  tabItem:      { flex:1, alignItems:'center', position:'relative' },
  tabIcon:      { fontSize:22 },
  tabLabel:     { fontSize:10, fontWeight:'700', color: C.gray3, marginTop:1 },
  tabLabelActive:{ color: C.black, fontWeight:'900' },
  tabDot:       { position:'absolute', bottom:-4, width:20, height:2.5,
                  backgroundColor: C.black, borderRadius:2 },
});
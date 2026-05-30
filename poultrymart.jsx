import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

export default function PoultryMart() {
  const products = [
    {
      name: 'Broiler Chickens',
      price: '₱185/kg',
      image:
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Starter Feeds',
      price: '₱1,250 / sack',
      image:
        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Layer Feeds',
      price: '₱1,480 / sack',
      image:
        'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Background Glow */}
        <View style={styles.bgGlow} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>ManokMarketPlace</Text>
            <Text style={styles.brandTagline}>Fresh Chickens & Quality Feeds</Text>
          </View>
          <Pressable style={styles.SellerBtn}>
            <Text style={styles.shopBtnText}>Be a Seller</Text>
            {/* Link the seller page here*/}
          </Pressable>
          <Pressable style={styles.BuyerBtn}>
            <Text style={styles.shopBtnText}>Log - in</Text>
            {/* link the buyer page */}
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeText}>🐔 Trusted Poultry Supplier</Text>
          </View>

          <Text style={styles.heroTitle}>Fresh Chickens.</Text>
          <Text style={styles.heroTitleAccent}>Premium Feeds.</Text>

          <Text style={styles.heroBody}>
            Modern poultry shopping experience for farms, resellers, and
            households with fast delivery and premium products.
          </Text>

          <View style={styles.ctaRow}>
            <Pressable style={[styles.ctaBtn, styles.ctaBtnPrimary]}>
              <Text style={styles.ctaBtnPrimaryText}>Browse Products</Text>
            </Pressable>
            <Pressable style={[styles.ctaBtn, styles.ctaBtnSecondary]}>
              <Text style={styles.ctaBtnSecondaryText}>Learn More</Text>
            </Pressable>
          </View>

          {/* Hero Image */}
          <View style={styles.heroImageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1400&auto=format&fit=crop',
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroImageOverlay}>
              <View>
                <Text style={styles.overlayLabel}>Featured Product</Text>
                <Text style={styles.overlayTitle}>Farm Fresh Chickens</Text>
              </View>
              <Pressable style={styles.orderBtn}>
                <Text style={styles.orderBtnText}>Order</Text>
              </Pressable>
            </View>
          </View>

          {/* Stats */}
          
          </View>
       

        {/* Products */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionEyebrow}>Best Sellers</Text>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <Text style={styles.sectionBody}>
            High-quality poultry products and feeds for backyard and commercial
            farming.
          </Text>

          {products.map((product, index) => (
            <View key={index} style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <View style={styles.productInfoRow}>
                  <View>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                  </View>
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockBadgeText}>In Stock</Text>
                  </View>
                </View>
                <Pressable style={styles.addToCartBtn}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBannerWrapper}>
          <View style={styles.promoBanner}>
            <Text style={styles.promoEyebrow}>Weekly Deals</Text>
            <Text style={styles.promoTitle}>Bulk Orders Made Easy.</Text>
            <Text style={styles.promoBody}>
              Save more with wholesale pricing for farms, resellers, and local
              stores.
            </Text>
            <Pressable style={styles.quotationBtn}>
              <Text style={styles.quotationBtnText}>Request Quotation</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>ManokMarketPlace</Text>
          <Text style={styles.footerTagline}>
            Your trusted partner for fresh poultry products and premium feeds.
          </Text>
          <View style={styles.footerLinks}>
            <View>
              <Text style={styles.footerHeading}>Shop</Text>
              <Text style={styles.footerLink}>Live Chickens</Text>
              <Text style={styles.footerLink}>Feeds</Text>
              <Text style={styles.footerLink}>Accessories</Text>
            </View>
            <View>
              <Text style={styles.footerHeading}>Company</Text>
              <Text style={styles.footerLink}>About</Text>
              <Text style={styles.footerLink}>Support</Text>
              <Text style={styles.footerLink}>Contact</Text>
            </View>
            <View>
              <Text style={styles.footerHeading}>Socials</Text>
              <Text style={styles.footerLink}>Facebook</Text>
              <Text style={styles.footerLink}>Instagram</Text>
              <Text style={styles.footerLink}>TikTok</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const RED = '#dc2626';
const RED_LIGHT = '#fef2f2';
const RED_BORDER = '#fee2e2';
const RED_MUTED = '#fca5a5';
const ZINC_900 = '#18181b';
const ZINC_800 = '#27272a';
const ZINC_500 = '#71717a';
const ZINC_300 = '#d4d4d8';
const ZINC_200 = '#e4e4e7';
const WHITE = '#ffffff';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  bgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 288,
    height: 288,
    backgroundColor: '#fee2e2',
    borderRadius: 144,
    opacity: 0.6,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: RED,
  },
  brandTagline: {
    color: ZINC_500,
    marginTop: 4,
  },
  SellerBtn: {
    backgroundColor: RED,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
},
  BuyerBtn: {
    backgroundColor: RED,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  shopBtnText: {
    color: WHITE,
    fontWeight: '700',
  },

  // Hero
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
    backgroundColor: RED_LIGHT,
    borderWidth: 1,
    borderColor: RED_BORDER,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 24,
  },
  badgeText: {
    color: RED,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: ZINC_900,
    lineHeight: 52,
  },
  heroTitleAccent: {
    fontSize: 44,
    fontWeight: '900',
    color: RED,
    lineHeight: 52,
    marginBottom: 24,
  },
  heroBody: {
    color: ZINC_500,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 32,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  ctaBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaBtnPrimary: {
    backgroundColor: RED,
  },
  ctaBtnPrimaryText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 16,
  },
  ctaBtnSecondary: {
    borderWidth: 1,
    borderColor: ZINC_300,
    backgroundColor: WHITE,
  },
  ctaBtnSecondaryText: {
    fontWeight: '700',
    color: ZINC_800,
  },

  // Hero Image
  heroImageWrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 420,
  },
  heroImageOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overlayLabel: {
    color: ZINC_500,
    fontSize: 13,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ZINC_900,
  },
  orderBtn: {
    backgroundColor: RED,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  orderBtnText: {
    color: WHITE,
    fontWeight: '700',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  statItem: {},
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: RED,
  },
  statLabel: {
    color: ZINC_500,
    marginTop: 4,
  },

  // Products
  productsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionEyebrow: {
    color: RED,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: ZINC_900,
    marginBottom: 12,
  },
  sectionBody: {
    color: ZINC_500,
    lineHeight: 24,
    marginBottom: 32,
  },
  productCard: {
    backgroundColor: WHITE,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: ZINC_200,
  },
  productImage: {
    width: '100%',
    height: 256,
  },
  productInfo: {
    padding: 20,
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '900',
    color: ZINC_900,
    marginBottom: 4,
  },
  productPrice: {
    color: RED,
    fontWeight: '700',
    fontSize: 17,
  },
  stockBadge: {
    backgroundColor: RED_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  stockBadgeText: {
    color: RED,
    fontWeight: '600',
    fontSize: 12,
  },
  addToCartBtn: {
    backgroundColor: RED,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 16,
  },

  // Promo Banner
  promoBannerWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  promoBanner: {
    backgroundColor: RED,
    borderRadius: 36,
    padding: 32,
    overflow: 'hidden',
  },
  promoEyebrow: {
    color: RED_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  promoTitle: {
    color: WHITE,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    marginBottom: 20,
  },
  promoBody: {
    color: RED_MUTED,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 32,
  },
  quotationBtn: {
    backgroundColor: WHITE,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  quotationBtnText: {
    color: RED,
    fontWeight: '900',
    fontSize: 16,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderTopWidth: 1,
    borderTopColor: ZINC_200,
  },
  footerBrand: {
    fontSize: 28,
    fontWeight: '900',
    color: RED,
    marginBottom: 12,
  },
  footerTagline: {
    color: ZINC_500,
    lineHeight: 24,
    marginBottom: 32,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerHeading: {
    fontWeight: '900',
    color: ZINC_900,
    marginBottom: 12,
  },
  footerLink: {
    color: ZINC_500,
    marginBottom: 8,
  },
});
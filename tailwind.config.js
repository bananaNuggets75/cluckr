import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Background Glow */}
        <View className="absolute top-0 left-0 w-72 h-72 bg-red-100 rounded-full opacity-60" />

        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-black text-red-600">
              PoultryMart
            </Text>
            <Text className="text-zinc-500 mt-1">
              Fresh Chickens & Quality Feeds
            </Text>
          </View>

          <Pressable className="bg-red-600 px-5 py-3 rounded-2xl">
            <Text className="text-white font-bold">Shop</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View className="px-6 pt-8">
          <View className="self-start bg-red-50 border border-red-100 px-4 py-2 rounded-full mb-6">
            <Text className="text-red-600 font-semibold">
              🐔 Trusted Poultry Supplier
            </Text>
          </View>

          <Text className="text-5xl font-black text-zinc-900 leading-tight">
            Fresh Chickens.
          </Text>

          <Text className="text-5xl font-black text-red-600 leading-tight mb-6">
            Premium Feeds.
          </Text>

          <Text className="text-zinc-600 text-base leading-7 mb-8">
            Modern poultry shopping experience for farms, resellers, and
            households with fast delivery and premium products.
          </Text>

          <View className="flex-row gap-4 mb-10">
            <Pressable className="bg-red-600 px-6 py-4 rounded-2xl flex-1 items-center">
              <Text className="text-white font-bold text-base">
                Browse Products
              </Text>
            </Pressable>

            <Pressable className="border border-zinc-300 px-6 py-4 rounded-2xl flex-1 items-center bg-white">
              <Text className="font-bold text-zinc-800">
                Learn More
              </Text>
            </Pressable>
          </View>

          {/* Hero Image */}
          <View className="rounded-[32px] overflow-hidden bg-white shadow-xl mb-10">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1400&auto=format&fit=crop',
              }}
              className="w-full h-[420px]"
              resizeMode="cover"
            />

            <View className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-3xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-zinc-500 text-sm">
                  Featured Product
                </Text>
                <Text className="text-xl font-bold text-zinc-900">
                  Farm Fresh Chickens
                </Text>
              </View>

              <Pressable className="bg-red-600 px-5 py-3 rounded-2xl">
                <Text className="text-white font-bold">Order</Text>
              </Pressable>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mb-12">
            <View>
              <Text className="text-3xl font-black text-red-600">1K+</Text>
              <Text className="text-zinc-500 mt-1">Customers</Text>
            </View>

            <View>
              <Text className="text-3xl font-black text-red-600">24H</Text>
              <Text className="text-zinc-500 mt-1">Delivery</Text>
            </View>

            <View>
              <Text className="text-3xl font-black text-red-600">100%</Text>
              <Text className="text-zinc-500 mt-1">Fresh</Text>
            </View>
          </View>
        </View>

        {/* Products */}
        <View className="px-6 pb-10">
          <Text className="text-red-600 font-bold mb-2">
            Best Sellers
          </Text>

          <Text className="text-4xl font-black text-zinc-900 mb-3">
            Featured Products
          </Text>

          <Text className="text-zinc-500 leading-6 mb-8">
            High-quality poultry products and feeds for backyard and commercial
            farming.
          </Text>

          {products.map((product, index) => (
            <View
              key={index}
              className="bg-white rounded-[32px] overflow-hidden mb-8 border border-zinc-200"
            >
              <Image
                source={{ uri: product.image }}
                className="w-full h-64"
                resizeMode="cover"
              />

              <View className="p-5">
                <View className="flex-row items-start justify-between mb-4">
                  <View>
                    <Text className="text-2xl font-black text-zinc-900 mb-1">
                      {product.name}
                    </Text>

                    <Text className="text-red-600 font-bold text-lg">
                      {product.price}
                    </Text>
                  </View>

                  <View className="bg-red-50 px-3 py-2 rounded-xl">
                    <Text className="text-red-600 font-semibold text-xs">
                      In Stock
                    </Text>
                  </View>
                </View>

                <Pressable className="bg-red-600 py-4 rounded-2xl items-center">
                  <Text className="text-white font-bold text-base">
                    Add to Cart
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Banner */}
        <View className="px-6 pb-10">
          <View className="bg-red-600 rounded-[36px] p-8 overflow-hidden">
            <Text className="text-red-100 uppercase tracking-widest mb-4">
              Weekly Deals
            </Text>

            <Text className="text-white text-4xl font-black leading-tight mb-5">
              Bulk Orders Made Easy.
            </Text>

            <Text className="text-red-100 text-base leading-7 mb-8">
              Save more with wholesale pricing for farms, resellers, and local
              stores.
            </Text>

            <Pressable className="bg-white py-4 rounded-2xl items-center">
              <Text className="text-red-600 font-black text-base">
                Request Quotation
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 py-10 border-t border-zinc-200">
          <Text className="text-3xl font-black text-red-600 mb-3">
            PoultryMart
          </Text>

          <Text className="text-zinc-500 leading-6 mb-8">
            Your trusted partner for fresh poultry products and premium feeds.
          </Text>

          <View className="flex-row justify-between">
            <View>
              <Text className="font-black text-zinc-900 mb-3">Shop</Text>
              <Text className="text-zinc-500 mb-2">Live Chickens</Text>
              <Text className="text-zinc-500 mb-2">Feeds</Text>
              <Text className="text-zinc-500">Accessories</Text>
            </View>

            <View>
              <Text className="font-black text-zinc-900 mb-3">Company</Text>
              <Text className="text-zinc-500 mb-2">About</Text>
              <Text className="text-zinc-500 mb-2">Support</Text>
              <Text className="text-zinc-500">Contact</Text>
            </View>

            <View>
              <Text className="font-black text-zinc-900 mb-3">Socials</Text>
              <Text className="text-zinc-500 mb-2">Facebook</Text>
              <Text className="text-zinc-500 mb-2">Instagram</Text>
              <Text className="text-zinc-500">TikTok</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

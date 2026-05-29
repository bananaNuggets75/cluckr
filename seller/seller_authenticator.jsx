// AuthNavigator.js
// Main navigation stack for the Seller Marketplace flow.
// Install dependencies:
//   npm install @react-navigation/native @react-navigation/native-stack
//   npm install react-native-screens react-native-safe-area-context

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUpScreen from './seller_sign_up';
import LoginScreen from './seller_login';
import PhoneVerificationScreen from './seller_phone_verification';
import AdminVerificationScreen from './seller_admin_verification';
import SubscriptionScreen from './seller_subscription';
import DashboardScreen from './seller_dashboard';

const Stack = createNativeStackNavigator();

/**
 * AuthNavigator
 *
 * Screen flow:
 *  Login ──► SignUp ──► PhoneVerification ──► AdminVerification
 *                                                     │
 *                                                     ▼
 *                                              Subscription ──► Dashboard
 *
 * Each screen controls its own "next" navigation via props.navigation.navigate().
 */
export default function AuthNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,         // All screens use custom headers
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0D0D0D' },
        }}
      >
        {/* ── Auth ── */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* ── Verification ── */}
        <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
        <Stack.Screen name="AdminVerification" component={AdminVerificationScreen} />

        {/* ── Onboarding ── */}
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />

        {/* ── Main App ── */}
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ gestureEnabled: false }} // Prevent swipe-back from dashboard
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
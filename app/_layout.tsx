import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthContext, useAuthState } from '../lib/hooks/useAuth'

export default function RootLayout() {
  const auth = useAuthState()

  return (
    <AuthContext.Provider value={auth}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login/index" />
        <Stack.Screen name="auth/register/index" />
        <Stack.Screen name="auth/register/verify" />
        <Stack.Screen
          name="marketplace/[id]"
          options={{ headerShown: true, title: 'Listing', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="marketplace/page"
          options={{ headerShown: true, title: 'Marketplace', headerBackTitle: 'Back' }}
        />
      </Stack>
    </AuthContext.Provider>
  )
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MarketplaceHomeScreen from './MarketplaceHomeScreen';
import PoultryMart from './poultrymart';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#111111',
          tabBarInactiveTintColor: '#888888',
        }}
      >
        <Tab.Screen
          name="Marketplace"
          component={MarketplaceHomeScreen}
          options={{
            title: 'Marketplace',
          }}
        />
        <Tab.Screen
          name="PoultryMart"
          component={PoultryMart}
          options={{
            title: 'PoultryMart',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { HomeScreen } from '../screens/main/HomeScreen';
import { PlaceholderScreen } from '../screens/main/PlaceholderScreen';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Home: '🏠',
  Education: '📚',
  Progress: '📈',
  Community: '💬',
  Settings: '⚙️',
};

export function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
        tabBarIcon: () => null,
        tabBarLabel: `${TAB_ICONS[route.name as keyof MainTabParamList]} ${route.name}`,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Education">
        {() => (
          <PlaceholderScreen
            title="Education feed"
            description="Daily-unlock lesson cards are coming next, pulled from config/niche.ts."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Progress">
        {() => (
          <PlaceholderScreen
            title="Recovery timeline"
            description="A visual body/brain recovery timeline is coming next."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Community">
        {() => (
          <PlaceholderScreen
            title="Community feed"
            description="Anonymous streak-badge feed is coming next, backed by Supabase."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {() => (
          <PlaceholderScreen
            title="Settings"
            description="Quit date editing, notifications, subscription and account settings are coming next."
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

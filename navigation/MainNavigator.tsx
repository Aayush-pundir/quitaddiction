import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { HomeScreen } from '../screens/main/HomeScreen';
import { EducationScreen } from '../screens/main/EducationScreen';
import { ProgressScreen } from '../screens/main/ProgressScreen';
import { CommunityScreen } from '../screens/main/CommunityScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { SOSButton } from '../components/SOSButton';
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
    <View style={{ flex: 1 }}>
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
        <Tab.Screen name="Education" component={EducationScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <SOSButton />
    </View>
  );
}

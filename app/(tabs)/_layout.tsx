import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: '首页' }} />
      <Tabs.Screen name="explore" options={{ title: '探索' }} />
      <Tabs.Screen name="calendar" options={{ title: '日历' }} />  {/* 新增这一行 */}
    </Tabs>
  );
}

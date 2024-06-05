import { Tabs } from 'expo-router';
import React from 'react';
import { useBottomTabOptions } from '@/hooks/useBottomTabOptions';

export default function TabLayout() {
  const bottomTabOptions = useBottomTabOptions();

  return (
    <Tabs screenOptions={bottomTabOptions}>
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
        }}
      />
      <Tabs.Screen
        name="instructions"
        options={{
          title: 'Instructions',
        }}
      />
      <Tabs.Screen
        name="thanks"
        options={{
          title: 'Thanks',
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import React from 'react';
import { useBottomTabOptions } from '@/hooks/useBottomTabOptions';

export default function TabLayout() {
  const bottomTabOptions = useBottomTabOptions();

  return (
    <Tabs screenOptions={bottomTabOptions}>
      <Tabs.Screen
        name="hp"
        options={{
          title: 'Hornpipe',
        }}
      />
      <Tabs.Screen
        name="jig"
        options={{
          title: 'Jig',
        }}
      />
      <Tabs.Screen
        name="slowhp"
        options={{
          title: 'Slow HP',
        }}
      />
      <Tabs.Screen
        name="trad"
        options={{
          title: 'Trad set',
        }}
      />
    </Tabs>
  );
}

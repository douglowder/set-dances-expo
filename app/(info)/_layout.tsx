import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';

import { useTextStyles } from '@/hooks/useTextStyles';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const textStyles = useTextStyles();

  const tabBarButton = (props: BottomTabBarButtonProps) => {
    const style: any = props.style ?? {};
    return (
      <Pressable
        {...props}
        style={({ pressed, focused }) => [
          style,
          {
            opacity: pressed || focused ? 0.6 : 1.0,
          },
        ]}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          height: textStyles.title.lineHeight * 2,
          marginBottom: 0,
        },
        headerShown: false,
        tabBarButton,
        tabBarLabelStyle: textStyles.default,
        tabBarIcon: () => null,
      }}
    >
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

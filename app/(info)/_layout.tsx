import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import { useScale } from '@/hooks/useScale';

import { useTextStyles } from '@/hooks/useTextStyles';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scale = useScale();
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

  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarStyle: {
          height: textStyles.title.lineHeight * 2,
          marginBottom: 0 * scale,
          borderColor: colors.tint,
          borderBottomWidth: scale,
          backgroundColor: colors.background,
        },
        tabBarLabelStyle: [
          textStyles.default,
          {
            fontWeight: '600',
          },
        ],
        headerShown: false,
        tabBarButton,
        tabBarIcon: () => null,
        tabBarPosition: 'top',
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

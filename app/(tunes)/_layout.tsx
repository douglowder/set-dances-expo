import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, useColorScheme } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import { useTextStyles } from '@/hooks/useTextStyles';
import { useScale } from '@/hooks/useScale';

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
          borderColor: colors.tint,
          borderTopWidth: Platform.isTV ? 0 : scale,
          borderBottomWidth: scale,
          backgroundColor: colors.background,
        },
        tabBarLabelStyle: [
          textStyles.default,
          {
            fontWeight: '600',
            marginTop: 20 * scale,
          },
        ],
        headerShown: false,
        tabBarButton,
        tabBarIcon: () => null,
        tabBarPosition: Platform.isTV ? 'top' : 'bottom',
      }}
    >
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

import { Colors } from '@/constants/Colors';
import { useScale } from '@/hooks/useScale';
import { useTextStyles } from '@/hooks/useTextStyles';
import {
  BottomTabNavigationOptions,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';

import { Platform, Pressable, useColorScheme } from 'react-native';

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

export function useBottomTabOptions(): BottomTabNavigationOptions {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const textStyles = useTextStyles();
  const scale = useScale();
  return {
    tabBarActiveTintColor: colors.tint,
    tabBarStyle: {
      height: textStyles.title.lineHeight * 2,
      marginBottom: Platform.isTV ? -30 * scale : 0 * scale,
      borderTopWidth: Platform.isTV ? 0 : 2 * scale,
      borderTopColor: colors.tint,
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
    tabBarPosition: Platform.isTV ? 'top' : 'bottom',
  };
}

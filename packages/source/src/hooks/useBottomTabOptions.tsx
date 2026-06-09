import { Colors } from '@/constants/Colors';
import { useScale } from '@/hooks/useScale';
import { useTextStyles } from '@/hooks/useTextStyles';
import type {
  BottomTabNavigationOptions,
  BottomTabBarButtonProps,
} from 'expo-router/js-tabs';

import type { Ref } from 'react';
import { Platform, Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabBarButton = ({ ref, ...props }: BottomTabBarButtonProps) => {
  const style: any = props.style ?? {};
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  return (
    <Pressable
      ref={ref as Ref<View>}
      tvParallaxProperties={{
        enabled: true,
        magnification: 1.2,
        pressMagnification: 1.3,
        pressDuration: 0.3,
      }}
      {...props}
      style={({ pressed, focused }) => [
        style,
        {
          opacity:
            (pressed || focused) && Platform.OS === 'android' ? 0.6 : 1.0,
          color: focused ? colors.tint : colors.text,
        },
      ]}
    />
  );
};

export function useBottomTabOptions(): BottomTabNavigationOptions {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const textStyles = useTextStyles();
  const { scale } = useScale();
  const marginBottom = 0;
  const paddingBottom = Platform.isTV ? 0 : 30 * scale;
  const borderTopWidth = Platform.isTV ? 0 : 2 * scale;
  return {
    tabBarActiveTintColor: colors.tint,
    tabBarStyle: {
      height: textStyles.title.lineHeight * 2.5,
      marginBottom,
      paddingBottom,
      borderTopWidth,
      borderTopColor: colors.tint,
      backgroundColor: colors.background,
    },
    tabBarItemStyle: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    tabBarLabelStyle: [
      textStyles.default,
      {
        fontWeight: '600',
      },
    ],
    headerShown: false,
    tabBarButton: TabBarButton,
    tabBarIcon: () => null,
    tabBarPosition: Platform.isTV ? 'top' : 'bottom',
  };
}

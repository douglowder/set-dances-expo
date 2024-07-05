import { Colors } from '@/constants/Colors';
import { useScale } from '@/hooks/useScale';
import { useTextStyles } from '@/hooks/useTextStyles';
import {
  BottomTabNavigationOptions,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';

import { Platform, Pressable, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabBarButton = (props: BottomTabBarButtonProps) => {
  const style: any = props.style ?? {};
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <Pressable
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const textStyles = useTextStyles();
  const { scale } = useScale();
  const marginBottom = Platform.isTV ? -30 * scale : 0;
  const paddingBottom = Platform.isTV ? 0 : 30 * scale;
  const borderTopWidth = Platform.isTV ? 0 : 2 * scale;
  return {
    tabBarActiveTintColor: colors.tint,
    tabBarStyle: {
      height: textStyles.title.lineHeight * 2,
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

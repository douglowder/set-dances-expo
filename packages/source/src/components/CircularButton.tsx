import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { forwardRef } from 'react';
import {
  type ColorValue,
  Platform,
  Pressable,
  PressableProps,
  useTVEventHandler,
} from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  withTiming,
} from 'react-native-reanimated';

type CircularButtonProps = PressableProps & {
  size: number;
  iconName: any;
  iconType?: 'MaterialIcons' | 'Ionicons';
  alt: string;
  color?: ColorValue;
  onPlayPause?: () => void;
};

export const CircularButton = forwardRef(
  (props: CircularButtonProps, ref: any) => {
    const { alt, size, iconName, onPress, color } = props;
    const iconType = props?.iconType ?? 'Ionicons';

    useTVEventHandler((event) => {
      if (props?.onPlayPause) {
        if (event.eventType === 'playPause') {
          props.onPlayPause();
        }
      }
    });

    return (
      <Pressable
        tvParallaxProperties={{
          enabled: true,
          magnification: 1.2,
          pressMagnification: 1.3,
          pressDuration: 0.3,
        }}
        ref={ref}
        accessible={true}
        accessibilityLabel={alt}
        accessibilityRole="button"
        onPress={onPress}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {({ pressed, focused }) => (
          <Animated.View
            style={[
              {
                width: size,
                height: size,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                opacity: pressed || (Platform.OS === 'android' && focused) ? 0.6 : 1.0,
              },
/*
              {
                opacity: withTiming<number>(
                  pressed || (Platform.OS === 'android' && focused) ? 0.6 : 1.0,
                  {
                    duration: 2000,
                    easing: Easing.circle,
                    reduceMotion: ReduceMotion.Always,
                  },
                ),
              },
*/
            ]}
          >
            {iconType === 'MaterialIcons' && (
              <MaterialIcons
                size={size}
                name={iconName}
                color={color ?? 'white'}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            )}
            {iconType === 'Ionicons' && (
              <Ionicons
                size={size}
                name={iconName}
                color={color ?? 'white'}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            )}
          </Animated.View>
        )}
      </Pressable>
    );
  },
);

CircularButton.displayName = 'CircularButton';

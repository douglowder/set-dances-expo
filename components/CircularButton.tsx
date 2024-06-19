import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  useTVEventHandler,
} from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type CircularButtonProps = PressableProps & {
  size: number;
  iconName?: any;
  alt: string;
  color?: string;
  onPlayPause?: () => void;
};

export const CircularButton = forwardRef(
  (props: CircularButtonProps, ref: any) => {
    const [focused, setFocused] = useState(false);
    const [pressed, setPressed] = useState(false);
    const { alt, size, iconName, onPress, color } = props;

    useTVEventHandler((event) => {
      if (props?.onPlayPause) {
        if (event.eventType === 'playPause') {
          props.onPlayPause();
        }
      }
    });

    const $animatedStyle: ViewStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming<number>(pressed ? 0.6 : 1.0, {
          duration: 300,
          easing: Easing.circle,
          reduceMotion: ReduceMotion.Always,
        }),
      }),
      [pressed, focused],
    );

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
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              width: size,
              height: size,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
            },
            $animatedStyle,
          ]}
        >
          {iconName && (
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
      </Pressable>
    );
  },
);

CircularButton.displayName = 'CircularButton';

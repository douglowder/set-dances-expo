import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  useTVEventHandler,
} from 'react-native';
import Animated, {
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
        console.log(`TV event: ${props.iconName} ${event.eventType}`);
        if (event.eventType === 'playPause') {
          props.onPlayPause();
        }
      }
    });

    const $animatedStyle: ViewStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming<number>(pressed || focused ? 0.6 : 1.0, {
          duration: 150,
        }),
      }),
      [pressed, focused],
    );

    return (
      <Pressable
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

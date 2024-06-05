import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useState } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type CircularButtonProps = PressableProps & {
  size: number;
  iconName?: any;
  alt: string;
};

export const CircularButton = forwardRef(
  (props: CircularButtonProps, ref: any) => {
    const [focused, setFocused] = useState(false);
    const [pressed, setPressed] = useState(false);
    const { alt, size, iconName, onPress } = props;

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
          width: size * 1.2,
          height: size * 1.2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              borderRadius: size * 0.65,
              width: size * 1.1,
              height: size * 1.1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
            },
            useAnimatedStyle(
              () => ({
                opacity: withTiming<number>(pressed ? 0.6 : 1.0, {
                  duration: 150,
                }),
              }),
              [pressed, focused],
            ),
          ]}
        >
          {iconName && (
            <Ionicons
              size={size * 0.9}
              name={iconName}
              style={{
                color: focused ? '#00ffff' : 'white',
                width: '90%',
                height: '90%',
                margin: 0,
                padding: 0,
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

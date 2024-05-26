import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, ImageSource } from 'expo-image';
import { forwardRef, useState } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useScale } from '@/hooks/useScale';

type CircularButtonProps = PressableProps & {
  size: number;
  imageSource?: ImageSource;
  iconName?: any;
  alt: string;
};

export const CircularButton = forwardRef(
  (props: CircularButtonProps, ref: any) => {
    const scale = useScale();
    const [focused, setFocused] = useState(false);
    const [pressed, setPressed] = useState(false);
    const { alt, size, imageSource, iconName, onPress } = props;

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
              borderColor: 'white',
              width: size * 1.1,
              height: size * 1.1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
            },
            useAnimatedStyle(
              () => ({
                width: withTiming<number>(pressed ? size * 1.1 : size, {
                  duration: 150,
                }),
                height: withTiming<number>(pressed ? size * 1.1 : size, {
                  duration: 150,
                }),
                borderWidth: withTiming<number>(focused ? scale : 0, {
                  duration: 150,
                }),
              }),
              [pressed, focused],
            ),
          ]}
        >
          {imageSource && (
            <Image
              alt={alt}
              source={imageSource}
              style={{
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0,
              }}
            />
          )}
          {iconName && (
            <Ionicons
              size={size * 0.9}
              name={iconName}
              style={{
                color: 'white',
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

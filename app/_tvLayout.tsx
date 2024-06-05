import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Pressable, useColorScheme } from 'react-native';

import { useScale } from '@/hooks/useScale';
import { Ionicons } from '@expo/vector-icons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TVLayout() {
  const colorScheme = useColorScheme();
  const headerTintColor = (colorScheme === 'dark' ? DarkTheme : DefaultTheme)
    .colors.text;
  const scale = useScale();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView>
          <Stack
            screenOptions={{
              headerLeft: (props) => {
                return (
                  <Pressable onPress={() => router.replace('/')}>
                    {({ pressed, focused }) => {
                      return (
                        <Ionicons
                          size={40 * scale}
                          name="caret-back-sharp"
                          style={{
                            width: 40 * scale,
                            height: 40 * scale,
                            margin: 10 * scale,
                            color: props.tintColor,
                            opacity: pressed || focused ? 0.6 : 1.0,
                          }}
                        />
                      );
                    }}
                  </Pressable>
                );
              },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="(tunes)"
              options={{
                headerTitle: 'Select a tune',
                headerTintColor,
                contentStyle: {
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: 50 * scale,
                  marginBottom: 50 * scale,
                },
              }}
            />
            <Stack.Screen
              name="(info)"
              options={{
                headerTitle: 'Info',
                headerTintColor,
                contentStyle: {
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: 50 * scale,
                  marginBottom: 50 * scale,
                },
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

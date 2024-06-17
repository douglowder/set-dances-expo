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
import { Platform, useColorScheme } from 'react-native';

import { useScale } from '@/hooks/useScale';
import { CircularButton } from '@/components/CircularButton';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TVLayout() {
  const colorScheme = useColorScheme();
  const headerTintColor = (colorScheme === 'dark' ? DarkTheme : DefaultTheme)
    .colors.text;
  const { scale } = useScale();
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
                  <CircularButton
                    onPress={() => router.replace('/')}
                    size={40 * scale}
                    alt="Home"
                    iconName="caret-back-sharp"
                    color={props.tintColor}
                  />
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
                  marginTop: Platform.isTV ? 0 : 50 * scale,
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
                  marginTop: Platform.isTV ? 0 : 50 * scale,
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

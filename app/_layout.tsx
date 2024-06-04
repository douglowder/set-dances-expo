import { useScale } from '@/hooks/useScale';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  const headerTintColor = (colorScheme === 'dark' ? DarkTheme : DefaultTheme)
    .colors.text;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer>
            <Drawer.Screen
              name="index"
              options={{
                headerTransparent: true,
                headerTintColor: 'white',
                drawerLabel: 'Home',
                title: '',
              }}
            />
            <Drawer.Screen
              name="(tunes)"
              options={{
                drawerLabel: 'Select a tune',
                title: 'Select a tune',
                headerTitleStyle: {
                  fontSize: 25 * scale,
                },
                headerTintColor,
              }}
            />
            <Drawer.Screen
              name="(info)"
              options={{
                drawerLabel: 'More info',
                title: 'More info',
                headerTitleStyle: {
                  fontSize: 25 * scale,
                },
                headerTintColor,
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

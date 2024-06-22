import TVLayout from '@/layouts/tv';
import PhoneLayout from '@/layouts/phone';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Zapfino: require('../assets/fonts/Zapfino-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.error(error);
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return Platform.isTV ? <TVLayout /> : <PhoneLayout />;
}

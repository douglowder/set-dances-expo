import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, useColorScheme } from 'react-native';

import { useScale } from '@/hooks/useScale';
import { CircularButton } from '@/components/CircularButton';

export default function TVLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const headerTintColor = theme.colors.text;
  const backgroundColor = theme.colors.background;
  const { scale } = useScale();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
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

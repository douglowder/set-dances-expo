import { useScale } from '@/hooks/useScale';
import { Ionicons } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useRouter,
} from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function PhoneLayout() {
  const colorScheme = useColorScheme();
  const { scale } = useScale();
  const router = useRouter();

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const headerTintColor = theme.colors.text;
  const backgroundColor = theme.colors.background;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
          <Drawer
            screenOptions={({ navigation }) => ({
              swipeEnabled: false,
              headerLeft: (props) => (
                <Pressable onPress={() => navigation.toggleDrawer()}>
                  {({ pressed, focused }) => {
                    return (
                      <Ionicons
                        size={40 * scale}
                        name="menu"
                        aria-label="Menu"
                        style={{
                          width: 40 * scale,
                          height: 40 * scale,
                          margin: 20 * scale,
                          color: props.tintColor,
                          opacity: pressed || focused ? 0.6 : 1.0,
                        }}
                      />
                    );
                  }}
                </Pressable>
              ),
            })}
          >
            <Drawer.Screen
              name="index"
              options={{
                headerTransparent: true,
                headerStyle: {
                  height: 100 * scale,
                },
                headerTintColor: 'white',
                headerRight: (props) => (
                  <Pressable
                    onPress={() => router.push('/(info)/instructions')}
                  >
                    {({ pressed, focused }) => {
                      return (
                        <Ionicons
                          size={40 * scale}
                          name="help-circle-outline"
                          aria-label="Help"
                          style={{
                            width: 40 * scale,
                            height: 40 * scale,
                            margin: 20 * scale,
                            color: props.tintColor,
                            opacity: pressed || focused ? 0.6 : 1.0,
                          }}
                        />
                      );
                    }}
                  </Pressable>
                ),
                drawerLabel: 'Home',
                drawerLabelStyle: {
                  fontSize: 25 * scale,
                },
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
                headerStyle: {
                  height: 100 * scale,
                },
                drawerLabelStyle: {
                  fontSize: 25 * scale,
                },
                headerTintColor,
              }}
            />
            <Drawer.Screen
              name="(info)"
              options={{
                drawerLabel: 'Help',
                title: '',
                headerTitleStyle: {
                  fontSize: 25 * scale,
                },
                headerStyle: {
                  height: 100 * scale,
                },
                drawerLabelStyle: {
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

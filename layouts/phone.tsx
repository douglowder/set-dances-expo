import { useScale } from '@/hooks/useScale';
import { Ionicons } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  DrawerActions,
  ThemeProvider,
} from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Platform, Pressable, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function PhoneLayout() {
  const colorScheme = useColorScheme();
  const { scale } = useScale();
  const navigation = useNavigation();

  const headerTintColor = (colorScheme === 'dark' ? DarkTheme : DefaultTheme)
    .colors.text;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              swipeEnabled: false,
              headerLeft: (props) =>
                Platform.isTV ? null : (
                  <Pressable
                    onPress={() =>
                      navigation.dispatch(DrawerActions.toggleDrawer)
                    }
                  >
                    {({ pressed, focused }) => {
                      return (
                        <Ionicons
                          size={40 * scale}
                          name="menu"
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
                ),
            }}
          >
            <Drawer.Screen
              name="index"
              options={{
                headerTransparent: true,
                headerTintColor: 'white',
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
                drawerLabel: 'Info',
                title: 'Info',
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

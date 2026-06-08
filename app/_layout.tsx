import TVLayout from '@/layouts/tv';
import PhoneLayout from '@/layouts/phone';
import { Observe, ObserveRoot } from 'expo-observe';
import { Platform } from 'react-native';

Observe.configure({
  integrations: { 'expo-router': true },
});

function RootLayout() {
  return Platform.isTV ? <TVLayout /> : <PhoneLayout />;
}

export default ObserveRoot.wrap(RootLayout);

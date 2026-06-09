import TVLayout from '@/layouts/tv';
import PhoneLayout from '@/layouts/phone';
import { Observe, ObserveRoot } from 'expo-observe';
import { Platform } from 'react-native';

// App-specific root layout. Not managed by scripts/sync-routes.js (no
// @generated marker), so edits here are preserved across syncs.
Observe.configure({
  integrations: { 'expo-router': true },
  environment: 'production',
  dispatchingEnabled: true,
  dispatchInDebug: true,
});

function RootLayout() {
  return Platform.isTV ? <TVLayout /> : <PhoneLayout />;
}

export default ObserveRoot.wrap(RootLayout);

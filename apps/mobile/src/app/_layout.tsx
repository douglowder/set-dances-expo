import PhoneLayout from '@/layouts/phone';
import { Observe, ObserveRoot } from 'expo-observe';

// App-specific root layout. Not managed by scripts/sync-routes.js (no
// @generated marker), so edits here are preserved across syncs.
Observe.configure({
  integrations: { 'expo-router': true },
});

function RootLayout() {
  return <PhoneLayout />;
}

export default ObserveRoot.wrap(RootLayout);

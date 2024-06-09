import TVLayout from '@/layouts/tv';
import PhoneLayout from '@/layouts/phone';
import { Platform } from 'react-native';

export default function RootLayout() {
  return Platform.isTV ? <TVLayout /> : <PhoneLayout />;
}

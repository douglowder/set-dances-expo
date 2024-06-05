import TVLayout from './_tvLayout';
import PhoneLayout from './_phoneLayout';
import { Platform } from 'react-native';

export default function RootLayout() {
  return Platform.isTV ? <TVLayout /> : <PhoneLayout />;
}

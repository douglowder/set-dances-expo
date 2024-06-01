import { ExpoAvRoutePickerView } from '@douglowder/expo-av-route-picker-view';
import { Platform, View, ViewProps } from 'react-native';

export function RoutePicker(props: ViewProps) {
  return Platform.OS === 'ios' ? (
    <ExpoAvRoutePickerView {...props} />
  ) : (
    <View {...props} />
  );
}

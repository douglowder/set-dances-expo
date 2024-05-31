import { ColorValue, DimensionValue, ViewProps, ViewStyle } from 'react-native';

export type ExpoAirplayButtonViewProps = ViewProps & {
  tintColor?: ColorValue;
  activeTintColor?: ColorValue;
  prioritizesVideoDevices?: boolean;
};

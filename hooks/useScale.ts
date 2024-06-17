import { Platform, useWindowDimensions } from 'react-native';

export function useScale() {
  const { height, width } = useWindowDimensions();
  const scale = Platform.isTV ? width / 1000 : 1;
  return {
    height,
    width,
    scale,
  };
}

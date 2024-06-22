import { useWindowDimensions } from 'react-native';

export function useScale() {
  const { height, width } = useWindowDimensions();
  const scale = Math.max(width, height) / 1000;
  const landscape = width > height;
  return {
    height,
    width,
    scale,
    landscape,
  };
}

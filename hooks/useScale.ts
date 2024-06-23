import { useWindowDimensions } from 'react-native';

export function useScale() {
  const { height, width } = useWindowDimensions();
  const scale = Math.max(width, height) / 1000;
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const landscape = width > height;
  const tall = !landscape && aspectRatio > 2;
  return {
    height,
    width,
    scale,
    landscape,
    aspectRatio,
    tall,
  };
}

import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: config.slug ?? '', // TypeScript is upset if we don't explicitly provide a slug here
  name: config.name ?? '',
  orientation: process.env.EXPO_TV ? undefined : 'portrait',
});

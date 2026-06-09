import type { PropsWithChildren } from 'react';
import {
  StyleSheet,
  ScrollView,
  TVTextScrollView,
  Platform,
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';

type Props = PropsWithChildren & { tvScroll?: boolean };

export default function ParallaxScrollView({ tvScroll, children }: Props) {
  const styles = useParallaxScrollViewStyles();

  if (Platform.isTV && Platform.OS === 'ios' && tvScroll) {
    return (
      <ThemedView style={styles.container}>
        <TVTextScrollView>
          <ThemedView style={styles.content}>{children}</ThemedView>
        </TVTextScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView scrollEventThrottle={16}>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const useParallaxScrollViewStyles = function () {
  const { scale } = useScale();
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    content: {
      flex: 1,
      padding: 32 * scale,
      gap: 16 * scale,
      overflow: 'hidden',
    },
  });
};

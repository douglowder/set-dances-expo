import { Link, router } from 'expo-router';
import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getTuneMap, Tune } from '@/constants/Tunes';
import { emitTuneChangeEvent } from '@/utils/TuneChangeEmitter';

export default function TuneList() {
  const styles = useTuneListStyles();

  const handleRowSelect = (item: Tune) => {
    emitTuneChangeEvent({ tuneKey: item.key });
    router.back();
  };
  const renderRow = ({ item }: { item: Tune }) => {
    return (
      <Pressable onPress={() => handleRowSelect(item)}>
        <ThemedView style={styles.textContainer}>
          <ThemedText>{item.name}</ThemedText>
        </ThemedView>
      </Pressable>
    );
  };

  const tuneMap = getTuneMap();
  const data = [...tuneMap.keys()].map((key) => tuneMap.get(key) as Tune);

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.safeAreaContainer}>
        <ThemedText type="subtitle">Select a tune:</ThemedText>
        <FlatList
          contentContainerStyle={styles.list}
          data={data}
          renderItem={renderRow}
        />
        {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
        <Link href="../" asChild>
          <Pressable style={styles.button}>
            {({ pressed, focused }) => (
              <ThemedText
                type="subtitle"
                style={[
                  styles.buttonText,
                  pressed ? { color: 'yellow' } : undefined,
                  focused ? { opacity: 0.6 } : undefined,
                ]}
              >
                Cancel
              </ThemedText>
            )}
          </Pressable>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const useTuneListStyles = function () {
  const scale = useScale();
  const backgroundColor = useThemeColor({}, 'tint');
  const color = useThemeColor({}, 'background');
  const { top, bottom } = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    safeAreaContainer: {
      flex: 1,
      padding: 32 * scale,
      gap: 16 * scale,
      overflow: 'hidden',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: top,
      marginBottom: bottom,
    },
    list: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    textContainer: {
      flexDirection: 'row',
      padding: 10 * scale,
    },
    text: {
      textAlign: 'justify',
      flex: 1,
    },
    image: {
      width: 40 * scale,
      height: 40 * scale,
      margin: 5,
    },
    button: {
      backgroundColor,
      borderRadius: 10 * scale,
      margin: 10 * scale,
      padding: 10 * scale,
    },
    buttonText: {
      color,
    },
  });
};

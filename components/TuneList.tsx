import { Link, router } from 'expo-router';
import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Tune, TuneType, AllTunes } from '@/constants/AllTunes';
import { emitTuneChangeEvent } from '@/utils/TuneChangeEmitter';
import { storeTuneSettingAsync } from '@/utils/TuneSettings';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function TuneList({ tuneTypes }: { tuneTypes: TuneType[] }) {
  const styles = useTuneListStyles();

  const tuneTypeSet = new Set(tuneTypes);

  const handleRowSelect = (item: Tune) => {
    storeTuneSettingAsync(item).then(() => {
      emitTuneChangeEvent();
      router.navigate('/');
    });
  };
  const renderRow = ({ item }: { item: Tune }) => {
    return (
      <Pressable onPress={() => handleRowSelect(item)} key={item.key}>
        <ThemedView style={styles.textContainer}>
          <ThemedText>{`${item.name} (${item.defaultSpeed})`}</ThemedText>
        </ThemedView>
      </Pressable>
    );
  };

  console.log(`total number of tunes = ${AllTunes.length}`);
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.buttonContainer}>
        <ThemedText style={styles.title} type="subtitle">
          Select a tune:
        </ThemedText>
        <Link href="/" asChild>
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
      <ParallaxScrollView>
        {AllTunes.filter((item) => tuneTypeSet.has(item.type)).map((item) =>
          renderRow({ item }),
        )}
      </ParallaxScrollView>
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
      paddingTop: 20 * scale,
      paddingBottom: 20 * scale,
    },
    safeAreaContainer: {
      flex: 1,
      padding: 32 * scale,
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
      margin: 20 * scale,
      padding: 10 * scale,
    },
    buttonText: {
      color,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      flex: 1,
      margin: 20 * scale,
      fontSize: 30 * scale,
      lineHeight: 40 * scale,
    },
  });
};

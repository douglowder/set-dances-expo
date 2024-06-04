import { router } from 'expo-router';
import { StyleSheet, Pressable } from 'react-native';
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
          <ThemedText
            style={styles.text}
          >{`${item.name} (${item.defaultSpeed})`}</ThemedText>
        </ThemedView>
      </Pressable>
    );
  };

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.container, styles.safeAreaContainer]}>
        <ParallaxScrollView>
          {AllTunes.filter((item) => tuneTypeSet.has(item.type)).map((item) =>
            renderRow({ item }),
          )}
        </ParallaxScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const useTuneListStyles = function () {
  const scale = useScale();
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const { bottom } = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    safeAreaContainer: {
      marginBottom: bottom,
    },
    list: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    textContainer: {
      flexDirection: 'row',
      padding: 5 * scale,
    },
    text: {
      color: textColor,
    },
    textHighlighted: {
      color: tintColor,
    },
    image: {
      width: 40 * scale,
      height: 40 * scale,
      margin: 5,
    },
    button: {
      backgroundColor: tintColor,
      borderRadius: 10 * scale,
      margin: 20 * scale,
      padding: 10 * scale,
    },
    buttonText: {
      color: backgroundColor,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      flex: 1,
      margin: 20 * scale,
      fontSize: 20 * scale,
      lineHeight: 30 * scale,
    },
  });
};

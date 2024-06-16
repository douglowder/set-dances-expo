import { router, useFocusEffect } from 'expo-router';
import { StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Tune, TuneType, AllTunes } from '@/constants/AllTunes';
import { emitTuneChangeEvent } from '@/utils/TuneChangeEmitter';
import {
  fetchTuneSettingAsync,
  storeSavedSpeedAsync,
  storeTuneSettingAsync,
} from '@/utils/TuneSettings';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useState } from 'react';

export default function TuneList({ tuneTypes }: { tuneTypes: TuneType[] }) {
  const styles = useTuneListStyles();

  const tuneTypeSet = new Set(tuneTypes);

  const [savedTune, setSavedTune] = useState<Tune | undefined>(undefined);

  useFocusEffect(() => {
    const handleAsync = async () => {
      const tune = await fetchTuneSettingAsync();
      setSavedTune(tune);
    };
    handleAsync();
    return () => setSavedTune(undefined);
  });

  const handleRowSelect = (item: Tune) => {
    const handleAsync = async () => {
      if (savedTune?.key === item.key) {
        // Navigate back to player, no changes needed
        router.navigate('/');
        return;
      }
      await storeTuneSettingAsync(item);
      await storeSavedSpeedAsync(item, item.defaultSpeed);
      emitTuneChangeEvent();
      router.navigate('/');
    };
    handleAsync();
  };

  const renderRow = ({ item }: { item: Tune }) => {
    return (
      <Pressable onPress={() => handleRowSelect(item)} key={item.key}>
        {({ pressed, focused }) => (
          <ThemedView style={styles.textContainer}>
            <ThemedText
              style={pressed || focused ? styles.textHighlighted : styles.text}
            >{`${item.name} (${item.defaultSpeed})`}</ThemedText>
          </ThemedView>
        )}
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

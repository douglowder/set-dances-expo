// App-specific route for testing the expo-observe Reanimated integration
// (https://github.com/expo/expo/pull/50576). No @generated marker, so
// scripts/sync-routes.js leaves this file alone.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { withSequence, withSpring } from 'react-native-reanimated';
// `logger` is internal to Reanimated. It is the only way to emit a Reanimated
// error on demand, because the real `logger.error` call sites are hard to reach.
import { logger } from 'react-native-reanimated/src/common/logger';
import { scheduleOnUI } from 'react-native-worklets';

type Sample = {
  label: string;
  kind: 'warning' | 'error';
  runtime: 'RN' | 'UI';
  run: () => void;
};

// The integration reports each distinct message once per launch, so the
// samples that run on both runtimes use different values in their messages.
const SAMPLES: Sample[] = [
  {
    label: 'Invalid spring config',
    kind: 'warning',
    runtime: 'RN',
    run: () => {
      withSpring(1, { stiffness: -1 });
    },
  },
  {
    label: 'Invalid spring config',
    kind: 'warning',
    runtime: 'UI',
    run: () => {
      scheduleOnUI(() => {
        'worklet';
        withSpring(1, { stiffness: -2 });
      });
    },
  },
  {
    label: 'Empty withSequence()',
    kind: 'warning',
    runtime: 'UI',
    run: () => {
      scheduleOnUI(() => {
        'worklet';
        withSequence();
      });
    },
  },
  {
    label: 'Synthetic logger.error',
    kind: 'error',
    runtime: 'RN',
    run: () => {
      logger.error('Sample error from the React Native runtime (set-dances test)');
    },
  },
  {
    label: 'Synthetic logger.error',
    kind: 'error',
    runtime: 'UI',
    run: () => {
      scheduleOnUI(() => {
        'worklet';
        logger.error('Sample error from the UI runtime (set-dances test)');
      });
    },
  },
];

function sampleKey(sample: Sample) {
  return `${sample.label} (${sample.runtime})`;
}

export default function ReanimatedTest() {
  const [ran, setRan] = useState<Record<string, number>>({});

  const runSample = (sample: Sample) => {
    sample.run();
    const key = sampleKey(sample);
    setRan((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.note}>
        Each button triggers a Reanimated log. Warnings become
        `reanimated.warning` events and errors become `reanimated.error`
        errors in EAS Observe. Each distinct message is reported once per app
        launch, so a second tap only prints to the console.
      </Text>
      <Pressable
        style={[styles.button, styles.runAll]}
        onPress={() => SAMPLES.forEach(runSample)}
      >
        <Text style={styles.buttonText}>Run all</Text>
      </Pressable>
      {SAMPLES.map((sample) => {
        const key = sampleKey(sample);
        return (
          <Pressable
            key={key}
            style={[
              styles.button,
              sample.kind === 'error' ? styles.error : styles.warning,
            ]}
            onPress={() => runSample(sample)}
          >
            <Text style={styles.buttonText}>
              {`${sample.kind === 'error' ? 'Error' : 'Warning'}: ${key}`}
            </Text>
            <Text style={styles.count}>{`Tapped ${ran[key] ?? 0}×`}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  note: { fontSize: 15, color: 'gray' },
  button: { padding: 14, borderRadius: 8 },
  runAll: { backgroundColor: '#3b6ea5' },
  warning: { backgroundColor: '#b7791f' },
  error: { backgroundColor: '#c53030' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  count: { color: 'white', fontSize: 13, opacity: 0.8, marginTop: 4 },
});

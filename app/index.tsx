import { useScale } from '@/hooks/useScale';
import { AVPlaybackStatusSuccess, Audio } from 'expo-av';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { StyleSheet, TVFocusGuideView, Text, View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CircularButton } from '@/components/CircularButton';
import {
  Tune,
  fetchTuneSettingAsync,
  storeTuneSettingAsync,
} from '@/utils/TuneSettings';
import { addTuneChangeListener } from '@/utils/TuneChangeEmitter';
import { getTuneMap } from '@/constants/Tunes';

const playImage = require('@/assets/images/play.png');
const pauseImage = require('@/assets/images/pause.png');
const rewindImage = require('@/assets/images/rewind.png');
const refreshImage = require('@/assets/images/refresh.png');

const fractionCompleteFromStatus = (status: AVPlaybackStatusSuccess) =>
  status.positionMillis !== undefined && status.durationMillis !== undefined
    ? status.positionMillis / status.durationMillis
    : 0;

export default function Index() {
  const scale = useScale();
  const styles = useIndexStyles();

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [fractionComplete, setFractionComplete] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(0);

  const tune = useRef<Tune>();

  const progress = useSharedValue(fractionComplete);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const speedValue = useSharedValue(1);
  const speedMin = useSharedValue(0);
  const speedMax = useSharedValue(2);

  const changeTune = useCallback(
    ({ tuneKey }: { tuneKey: string }) => {
      const handleAsync = async () => {
        let savedTune;
        if (tuneKey !== '') {
          savedTune = getTuneMap().get(tuneKey) as Tune;
          await storeTuneSettingAsync(savedTune);
        } else if (tune.current === undefined) {
          savedTune = await fetchTuneSettingAsync();
        } else {
          return;
        }
        tune.current = savedTune;
        const { sound: newSound } = await Audio.Sound.createAsync(
          savedTune.value,
        );
        setSound(newSound);
        setSpeed(savedTune.defaultSpeed);
        speedValue.value = savedTune.defaultSpeed;
        speedMin.value = savedTune.defaultSpeed - 10;
        speedMax.value = savedTune.defaultSpeed + 10;
        setFractionComplete(0);
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            const f = fractionCompleteFromStatus(status);
            setFractionComplete(f);
            setDuration(status.durationMillis ?? 0);
            progress.value = f;
          }
        });
        newSound.setProgressUpdateIntervalAsync(1000);
      };
      handleAsync();
    },
    [tune, sound, progress, speedValue, speedMin, speedMax],
  );

  useEffect(() => changeTune({ tuneKey: '' }), []);

  addTuneChangeListener((event) => changeTune(event));

  const handleRewind = () => {
    if (!sound) {
      return;
    }
    sound.setPositionAsync(0).catch((error) => {
      console.warn(error);
    });
  };

  const handlePlayPause = () => {
    if (!sound) {
      setIsPlaying(false);
      return;
    }
    if (isPlaying) {
      sound
        .pauseAsync()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((error) => {
          setIsPlaying(false);
          console.warn(error);
        });
    } else {
      sound
        .playAsync()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          setIsPlaying(false);
          console.warn(error);
        });
    }
  };

  const handleSelect = () => {
    if (isPlaying) {
      sound
        ?.pauseAsync()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((error) => {
          setIsPlaying(false);
          console.warn(error);
        });
    }
    router.push('/tunelist');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/splash.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.safeAreaContainer}>
          <TVFocusGuideView autoFocus style={styles.buttonContainer}>
            <Link href="/info" asChild>
              <CircularButton
                alt="Info"
                iconName="information-circle"
                size={30 * scale}
              />
            </Link>
          </TVFocusGuideView>
          <Text style={styles.title}>Set Dances</Text>
          <Text style={styles.tuneTitle}>{tune.current?.name}</Text>
          <View style={{ flex: 1 }} />
          <TVFocusGuideView
            autoFocus
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120 * scale,
              width: '100%',
            }}
          >
            <CircularButton
              size={75 * scale}
              onPress={handleRewind}
              imageSource={rewindImage}
              alt="Rewind"
            />
            <CircularButton
              size={150 * scale}
              onPress={handlePlayPause}
              imageSource={isPlaying ? pauseImage : playImage}
              alt={isPlaying ? 'Pause' : 'Play'}
            />
            <CircularButton
              size={75 * scale}
              imageSource={refreshImage}
              alt="Select"
              onPress={handleSelect}
            />
          </TVFocusGuideView>
          <Slider
            style={styles.progressContainer}
            progress={progress}
            maximumValue={max}
            minimumValue={min}
            heartbeat={false}
            renderBubble={() => null}
            renderThumb={() => <View style={styles.progressCenter} />}
            theme={{
              minimumTrackTintColor: 'blue',
            }}
            onSlidingComplete={(value) => {
              sound?.setPositionAsync(value * duration);
            }}
          />
          <Text style={styles.tuneTitle}>{`Speed: ${speed}`}</Text>
          <Slider
            style={styles.progressContainer}
            progress={speedValue}
            maximumValue={speedMax}
            minimumValue={speedMin}
            snapToStep
            step={20}
            heartbeat={false}
            renderBubble={() => null}
            renderMark={() => null}
            renderThumb={() => <View style={styles.progressCenter} />}
            theme={{
              minimumTrackTintColor: 'blue',
            }}
            onSlidingComplete={(value) => {
              setSpeed(value);
              sound?.setRateAsync(
                value / (tune.current?.defaultSpeed ?? 0),
                false,
              );
            }}
          />
          <View style={{ flex: 2 }} />
        </View>
      </Image>
      <StatusBar style="light" />
    </View>
  );
}

const useIndexStyles = function () {
  const scale = useScale();
  const { top, bottom } = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    safeAreaContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: top,
      marginBottom: bottom,
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: 'white',
      fontSize: 40 * scale,
      fontWeight: 'bold',
      marginBottom: 50 * scale,
    },
    tuneTitle: {
      color: 'white',
      fontSize: 30 * scale,
    },
    buttonContainer: {
      width: '80%',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    progressContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      width: '80%',
      height: 5 * scale,
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressCenter: {
      width: 20 * scale,
      height: 20 * scale,
      borderRadius: 10 * scale,
      backgroundColor: 'white',
    },
  });
};

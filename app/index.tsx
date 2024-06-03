import { useScale } from '@/hooks/useScale';
import {
  AVPlaybackStatusSuccess,
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import {
  StyleSheet,
  TVFocusGuideView,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CircularButton } from '@/components/CircularButton';
import { RoutePicker } from '@/components/RoutePicker';
import { Tune } from '@/constants/AllTunes';
import {
  fetchTuneSettingAsync,
  displayedSpeedString,
} from '@/utils/TuneSettings';
import { addTuneChangeListener } from '@/utils/TuneChangeEmitter';

const fractionCompleteFromStatus = (status: AVPlaybackStatusSuccess) =>
  status.positionMillis !== undefined && status.durationMillis !== undefined
    ? status.positionMillis / status.durationMillis
    : 0;

export default function Index() {
  const scale = useScale();
  const styles = useIndexStyles();

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [tune, setTune] = useState<Tune | undefined>(undefined);

  const progressValue = useSharedValue(0);
  const minProgressValue = useSharedValue(0);
  const maxProgressValue = useSharedValue(1);

  const speedValue = useSharedValue(1);
  const minSpeedValue = useSharedValue(0);
  const maxSpeedValue = useSharedValue(2);

  const initialize = useCallback(() => {
    const handleAsync = async () => {
      let newSound;
      let savedTune;
      setIsPlaying(false);
      try {
        Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: true,
        });
        savedTune = await fetchTuneSettingAsync();
        const { sound: _sound } = await Audio.Sound.createAsync(
          savedTune.value,
          {
            progressUpdateIntervalMillis: 1000,
          },
          (status) => {
            if (status.isLoaded) {
              const f = fractionCompleteFromStatus(status);
              setDuration(status.durationMillis ?? 0);
              progressValue.value = f;
            }
          },
        );
        newSound = _sound;
      } catch (error) {
        console.error(error);
      }
      setSound(newSound);
      if (savedTune) {
        speedValue.value = savedTune.defaultSpeed;
        minSpeedValue.value = savedTune.minSpeed;
        maxSpeedValue.value = savedTune.maxSpeed;
        setSpeed(savedTune.defaultSpeed);
      }
      progressValue.value = 0;
      setTune(savedTune);
    };
    handleAsync();
  }, [progressValue, speedValue, minSpeedValue, maxSpeedValue]);

  useEffect(() => {
    if (tune === undefined) {
      initialize();
    }
  }, [initialize, tune]);

  addTuneChangeListener(() => {
    setTune(undefined);
  });

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
    const tab = tune?.type.startsWith('trad') ? 'trad' : tune?.type ?? 'hp';
    router.push(`/(tunes)/${tab}`);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/splash.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.safeAreaContainer}>
          <Text style={styles.title}>Set Dances</Text>
          <Text style={styles.tuneTitle}>{tune?.name ?? ''}</Text>
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
              iconName="caret-back"
              alt="Rewind"
            />
            <CircularButton
              size={100 * scale}
              onPress={handlePlayPause}
              iconName={isPlaying ? 'pause' : 'play'}
              alt={isPlaying ? 'Pause' : 'Play'}
            />
            <CircularButton
              size={60 * scale}
              iconName="search"
              alt="Select"
              onPress={handleSelect}
            />
          </TVFocusGuideView>
          <Slider
            style={styles.progressContainer}
            progress={progressValue}
            maximumValue={maxProgressValue}
            minimumValue={minProgressValue}
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
          <Text style={styles.tuneTitle}>{`Speed: ${displayedSpeedString(
            tune,
            speed,
          )}`}</Text>
          {tune && (
            <Slider
              style={styles.progressContainer}
              progress={speedValue}
              maximumValue={maxSpeedValue}
              minimumValue={minSpeedValue}
              heartbeat={false}
              renderBubble={() => null}
              renderMark={() => null}
              renderThumb={() => <View style={styles.progressCenter} />}
              theme={{
                minimumTrackTintColor: 'blue',
              }}
              onValueChange={(value) => {
                setSpeed(value);
                sound?.setRateAsync(value / (tune?.defaultSpeed ?? 0), false);
              }}
            />
          )}
          <View style={styles.centerButtonContainer}>
            <RoutePicker style={styles.airplayButton} />
          </View>
          <View style={{ flex: 2 }} />
        </View>
      </ImageBackground>
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
      backgroundColor: 'transparent',
    },
    title: {
      color: 'white',
      fontSize: 40 * scale,
      fontWeight: 'bold',
      marginBottom: 50 * scale,
      marginTop: 60 * scale,
    },
    tuneTitle: {
      color: 'white',
      fontSize: 30 * scale,
    },
    rightButtonContainer: {
      width: '80%',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    centerButtonContainer: {
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
    airplayButton: {
      width: 150 * scale,
      height: 150 * scale,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'transparent',
    },
  });
};

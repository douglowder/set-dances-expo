import { useScale } from '@/hooks/useScale';
import {
  AVPlaybackStatusSuccess,
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import {
  StyleSheet,
  TVFocusGuideView,
  Text,
  View,
  ImageBackground,
  Platform,
} from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CircularButton } from '@/components/CircularButton';
import { RoutePicker } from '@/components/RoutePicker';
import { Tune } from '@/constants/AllTunes';
import {
  fetchTuneSettingAsync,
  displayedSpeedString,
  storeSavedSpeedAsync,
  fetchSavedSpeedAsync,
} from '@/utils/TuneSettings';
import { addTuneChangeListener } from '@/utils/TuneChangeEmitter';

const fractionCompleteFromStatus = (status: AVPlaybackStatusSuccess) =>
  status.positionMillis !== undefined && status.durationMillis !== undefined
    ? status.positionMillis / status.durationMillis
    : 0;

export default function Index() {
  const { scale, landscape, tall } = useScale();
  const styles = useIndexStyles();

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [tune, setTune] = useState<Tune | undefined>(undefined);
  const [repeat, setRepeat] = useState(false);
  const [finished, setFinished] = useState(false);

  const progressValue = useSharedValue(0);
  const minProgressValue = useSharedValue(0);
  const maxProgressValue = useSharedValue(1);

  const initialize = useCallback(() => {
    const handleAsync = async () => {
      let newSound;
      let savedTune;
      let savedSpeed: number = 0;
      try {
        Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        savedTune = await fetchTuneSettingAsync();
        savedSpeed = (await fetchSavedSpeedAsync()) ?? 0;
        const { sound: _sound } = await Audio.Sound.createAsync(
          savedTune.value,
          {
            progressUpdateIntervalMillis: 1000,
            rate: savedSpeed / (savedTune?.defaultSpeed ?? 0),
          },
          (status) => {
            if (status.isLoaded) {
              const successStatus =
                status as unknown as AVPlaybackStatusSuccess;
              const f = fractionCompleteFromStatus(successStatus);
              setDuration(successStatus.durationMillis ?? 0);
              progressValue.value = f;
              if (f > 0.99) {
                setFinished(true);
              }
            }
          },
        );
        newSound = _sound;
      } catch (error) {
        console.error(error);
      }
      setSound(newSound);
      progressValue.value = 0;
      setTune(savedTune);
      setSpeed(savedSpeed);
      setFinished(false);
    };
    handleAsync();
  }, [progressValue]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        const handleAsync = async () => {
          // Pause sound if another screen (tune select or info) is focused
          await sound?.pauseAsync();
          // Rewind also
          await sound?.setPositionAsync(0);
          setIsPlaying(false);
        };
        handleAsync();
      };
    }, [sound]),
  );

  useEffect(() => {
    if (tune === undefined) {
      initialize();
    }
  }, [initialize, tune]);

  useEffect(() => {
    if (sound && finished) {
      sound?.setPositionAsync(0).then(() => {
        setFinished(false);
        if (repeat) {
          sound?.playAsync();
        } else {
          sound?.pauseAsync();
          setIsPlaying(false);
        }
      });
    }
  }, [repeat, finished, sound]);

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

  const handleInfo = () => {
    router.push(`/(info)/instructions`);
  };

  const handleSpeedChange = async (tune: Tune, newSpeed: number) => {
    await sound?.setRateAsync(newSpeed / (tune?.defaultSpeed ?? 0), false);
    await storeSavedSpeedAsync(tune, newSpeed);
    setSpeed(newSpeed);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/splash.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.safeAreaContainer}>
          <View style={{ height: 60 * scale }} />
          <TVFocusGuideView autoFocus style={styles.centerButtonContainer}>
            {Platform.isTV && (
              <CircularButton
                size={60 * scale}
                iconName="search"
                alt="Select"
                onPress={handleSelect}
              />
            )}
            <View style={{ flex: 1 }} />
            <Text style={[styles.title, { fontFamily: 'Zapfino' }]}>
              Set Dances
            </Text>
            <View style={{ flex: 1 }} />
            {Platform.isTV && (
              <CircularButton
                onPress={handleInfo}
                alt="Info"
                iconName="help-circle-outline"
                size={60 * scale}
              />
            )}
          </TVFocusGuideView>
          <Text style={styles.tuneTitle}>{tune?.name ?? ''}</Text>
          <View style={{ flex: 1 }} />
          <TVFocusGuideView
            autoFocus
            style={[styles.centerButtonContainer, { minHeight: 120 * scale }]}
          >
            <CircularButton
              size={75 * scale}
              onPress={handleRewind}
              iconName="play-back"
              alt="Rewind"
            />
            <View style={{ flex: 1 }} />
            <CircularButton
              size={100 * scale}
              onPress={handlePlayPause}
              iconName={isPlaying ? 'pause' : 'play'}
              alt={isPlaying ? 'Pause' : 'Play'}
              onPlayPause={handlePlayPause}
            />
            <View style={{ flex: 1 }} />
            <CircularButton
              iconName="repeat"
              alt="Toggle repeat"
              color={repeat ? '#00ffff' : 'white'}
              onPress={() => setRepeat(!repeat)}
              size={75 * scale}
            />
          </TVFocusGuideView>
          <View style={{ flex: 1 }} />
          <TVFocusGuideView autoFocus style={styles.centerButtonContainer}>
            <CircularButton
              onPress={() =>
                sound?.setPositionAsync(progressValue.value * duration - 10000)
              }
              alt="Jog back"
              size={Platform.isTV ? 60 * scale : 40 * scale}
              iconType="MaterialIcons"
              iconName="replay-10"
            />
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
            <CircularButton
              onPress={() =>
                sound?.setPositionAsync(progressValue.value * duration + 10000)
              }
              alt="Jog forward"
              size={Platform.isTV ? 60 * scale : 40 * scale}
              iconType="MaterialIcons"
              iconName="forward-10"
            />
          </TVFocusGuideView>
          {tune && (
            <TVFocusGuideView
              autoFocus
              style={[
                styles.centerButtonContainer,
                {
                  marginTop: landscape ? 0 : 60 * scale,
                  width: landscape ? '50%' : '70%',
                },
              ]}
            >
              <CircularButton
                onPress={() => {
                  const newSpeed = speed - 1;
                  handleSpeedChange(tune, newSpeed);
                }}
                alt="Decrease speed"
                size={60 * scale}
                iconName="caret-down"
              />
              <Text style={styles.tuneTitle}>{`Speed: ${displayedSpeedString(
                tune,
                speed,
              )}`}</Text>
              <CircularButton
                onPress={() => {
                  const newSpeed = speed + 1;
                  handleSpeedChange(tune, newSpeed);
                }}
                alt="Increase speed"
                size={60 * scale}
                iconName="caret-up"
              />
              {!tall && Platform.OS === 'ios' && <View style={{ flex: 1 }} />}
              {!tall && Platform.OS === 'ios' && (
                <RoutePicker
                  style={[styles.airplayButton, { marginLeft: 50 * scale }]}
                  tintColor="white"
                  activeTintColor="#00ffff"
                />
              )}
            </TVFocusGuideView>
          )}
          {tall && Platform.OS === 'ios' && (
            <RoutePicker
              style={styles.airplayButton}
              tintColor="white"
              activeTintColor="#00ffff"
            />
          )}
          <View style={{ flex: 2 }} />
        </View>
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
}

const useIndexStyles = function () {
  const { scale, landscape } = useScale();
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
      marginTop: top * 2,
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
      fontSize: 30 * scale,
      fontWeight: 'bold',
      textAlignVertical: 'center',
      marginBottom: -15 * scale,
    },
    tuneTitle: {
      color: 'white',
      fontSize: 30 * scale,
      margin: 30 * scale,
      textAlignVertical: 'center',
    },
    centerButtonContainer: {
      width: landscape ? '60%' : '80%',
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
      backgroundColor: 'transparent',
    },
  });
};

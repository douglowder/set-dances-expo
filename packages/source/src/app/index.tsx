import { useScale } from '@/hooks/useScale';
import { useMarkInteractive } from '@/hooks/useMarkInteractive';
import {
  type AudioPlayer,
  type AudioStatus,
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const fractionCompleteFromStatus = (status: AudioStatus) =>
  status.duration > 0 ? status.currentTime / status.duration : 0;

export default function Index() {
  const { scale, landscape, tall } = useScale();
  const styles = useIndexStyles();

  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<AudioPlayer | undefined>(undefined);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [tune, setTune] = useState<Tune | undefined>(undefined);
  const [repeat, setRepeat] = useState(false);
  const [finished, setFinished] = useState(false);

  useMarkInteractive(tune !== undefined);

  const progressValue = useSharedValue(0);
  const minProgressValue = useSharedValue(0);
  const maxProgressValue = useSharedValue(1);

  const initialize = useCallback(() => {
    const handleAsync = async () => {
      let newPlayer: AudioPlayer | undefined;
      let savedTune;
      let savedSpeed: number = 0;
      try {
        await setAudioModeAsync({
          shouldPlayInBackground: true,
          playsInSilentMode: true,
          interruptionMode: 'duckOthers',
        });
        savedTune = await fetchTuneSettingAsync();
        savedSpeed = (await fetchSavedSpeedAsync()) ?? 0;
        newPlayer = createAudioPlayer(savedTune.value, {
          updateInterval: 1000,
        });
        newPlayer.shouldCorrectPitch = false;
        newPlayer.setPlaybackRate(savedSpeed / (savedTune.defaultSpeed || 1));
        newPlayer.addListener('playbackStatusUpdate', (status) => {
          if (status.isLoaded) {
            setDuration(status.duration);
            // Reanimated shared values are meant to be mutated via `.value`
            // (including from JS-thread callbacks); the react-compiler
            // immutability rule doesn't model that.
            // eslint-disable-next-line react-hooks/immutability
            progressValue.value = fractionCompleteFromStatus(status);
            if (status.didJustFinish) {
              setFinished(true);
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
      playerRef.current?.remove();
      playerRef.current = newPlayer;
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
        // Pause and rewind if another screen (tune select or info) is focused
        const player = playerRef.current;
        if (!player) {
          return;
        }
        player.pause();
        player.seekTo(0);
        setIsPlaying(false);
      };
    }, []),
  );

  useEffect(() => {
    if (tune === undefined) {
      initialize();
    }
  }, [initialize, tune]);

  useEffect(() => {
    return () => {
      playerRef.current?.remove();
      playerRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (player && finished) {
      player.seekTo(0).then(() => {
        setFinished(false);
        if (repeat) {
          player.play();
        } else {
          player.pause();
          setIsPlaying(false);
        }
      });
    }
  }, [repeat, finished]);

  useEffect(() => {
    const subscription = addTuneChangeListener(() => {
      setTune(undefined);
    });
    return () => subscription.remove();
  }, []);

  const handleRewind = () => {
    playerRef.current?.seekTo(0).catch((error) => {
      console.warn(error);
    });
  };

  const handlePlayPause = () => {
    const player = playerRef.current;
    if (!player) {
      setIsPlaying(false);
      return;
    }
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleSelect = () => {
    if (isPlaying) {
      playerRef.current?.pause();
      setIsPlaying(false);
    }
    let tab: 'hp' | 'jig' | 'slowhp' | 'trad' = 'hp';
    if (tune) {
      tab =
        tune.type === 'tradhp' || tune.type === 'tradjig' ? 'trad' : tune.type;
    }
    router.push(`/(tunes)/${tab}`);
  };

  const handleInfo = () => {
    router.push(`/(info)/instructions`);
  };

  const handleSpeedChange = async (tune: Tune, newSpeed: number) => {
    playerRef.current?.setPlaybackRate(newSpeed / (tune?.defaultSpeed || 1));
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
          <View
            style={{
              height:
                landscape && Platform.OS === 'android' ? 5 * scale : 60 * scale,
            }}
          />
          <TVFocusGuideView
            autoFocus
            style={[
              styles.centerButtonContainer,
              {
                marginBottom:
                  landscape && Platform.OS === 'android' ? -80 * scale : 0,
              },
            ]}
          >
            {Platform.isTV && (
              <CircularButton
                size={60 * scale}
                iconName="search"
                alt="Select"
                onPress={handleSelect}
              />
            )}
            <View style={{ flex: 1 }} />
            <Text style={styles.appName}>Set Dances</Text>
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
                playerRef.current?.seekTo(
                  Math.max(0, progressValue.value * duration - 10),
                )
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
                playerRef.current?.seekTo(value * duration);
              }}
            />
            <CircularButton
              onPress={() =>
                playerRef.current?.seekTo(
                  Math.min(duration, progressValue.value * duration + 10),
                )
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
    appName: {
      fontFamily: Platform.select({
        ios: 'Zapfino',
        android: 'zapfino',
      }),
      color: 'white',
      fontSize: 30 * scale,
      textAlignVertical: 'center',
      marginBottom: -15 * scale,
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

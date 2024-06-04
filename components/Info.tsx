import { Image } from 'expo-image';
import Constants from 'expo-constants';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';
import { useThemeColor } from '@/hooks/useThemeColor';

import { version as expoVersion } from 'expo/package.json';
import { version as expoRouterVersion } from 'expo-router/package.json';
import { version as expoAVVersion } from 'expo-av/package.json';
import { version as reactNativeVersion } from 'react-native/package.json';
import Ionicons from '@expo/vector-icons/Ionicons';

type InfoTabNames = 'About' | 'Instructions' | 'Thanks';

export default function Info({ tabName }: { tabName: InfoTabNames }) {
  const styles = useHomeScreenStyles();
  const scale = useScale();

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.container, styles.safeAreaContainer]}>
        <ParallaxScrollView>
          {tabName === 'Instructions' && (
            <ThemedView>
              <ThemedView style={styles.textContainer}>
                <Ionicons size={30 * scale} name="play" style={styles.image} />
                <ThemedText style={styles.text}>
                  Press this to play/pause the music. You can use the sliders to
                  move to a different part of the tune, and to adjust the speed.
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.textContainer}>
                <Ionicons
                  size={30 * scale}
                  name="search"
                  style={styles.image}
                />
                <ThemedText style={styles.text}>
                  Press this to bring up a dialog that will allow you to select
                  a different dance tune.
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.textContainer}>
                <ThemedText style={styles.text}>
                  Tunes can be selected from four lists; use the selector at the
                  bottom to change to a different list. There are two lists for
                  the hornpipe tempo tunes, one for tempo range 100 - 120 bpm,
                  the other for the tempo range 75 - 85. The jig tempo tunes can
                  be played at speeds from 60 - 80 bpm. Traditional hornpipe
                  sets can be played at speeds from 110 - 160 bpm, and
                  traditional jig sets can be played at speeds from 80 - 100
                  bpm.
                </ThemedText>
              </ThemedView>
              {Platform.OS === 'ios' && (
                <ThemedView style={styles.textContainer}>
                  <Image
                    source={require('@/assets/images/airplay-route-picker.png')}
                    style={{ width: 30, height: 30, margin: 10 }}
                  />
                  <ThemedText style={styles.text}>
                    Pressing this button will bring up a list of available
                    Airplay and Bluetooth devices to which the audio can be
                    sent. The button will change to a cyan color when AirPlay is
                    active.
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}
          {tabName === 'Thanks' && (
            <ThemedView>
              <ThemedView style={styles.textContainer}>
                <ThemedText style={styles.text}>
                  To all Irish dancers and dance teachers: thanks for giving me
                  the idea of creating this app. I hope you enjoy this and find
                  it useful.
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.textContainer}>
                <ThemedText style={styles.text}>
                  Special thanks go to my son Scott Lowder, for his advice and
                  help with the design of the user interface, and Gwen Stephens,
                  for her assistance in testing several versions of this app.
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.textContainer}>
                <ThemedText style={styles.text}>
                  Finally, thanks to my wife Cheryl for all her love,
                  encouragement, and support!
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
          {tabName === 'About' && (
            <ThemedView>
              <ThemedView>
                <ThemedText type="defaultSemiBold" style={styles.text}>
                  Programming:
                </ThemedText>
              </ThemedView>
              <ThemedView>
                <ThemedText
                  style={styles.text}
                >{`Version ${Constants.expoConfig?.version}`}</ThemedText>
                <ThemedText
                  style={styles.text}
                >{`react-native-tvos ${reactNativeVersion}`}</ThemedText>
                <ThemedText
                  style={styles.text}
                >{`expo ${expoVersion}`}</ThemedText>
                <ThemedText
                  style={styles.text}
                >{`expo-router ${expoRouterVersion}`}</ThemedText>
                <ThemedText
                  style={styles.text}
                >{`expo-av ${expoAVVersion}`}</ThemedText>
              </ThemedView>
              <ThemedView>
                <ThemedText type="defaultSemiBold" style={styles.text}>
                  &nbsp;
                </ThemedText>
              </ThemedView>
              <ThemedView>
                <ThemedText type="defaultSemiBold" style={styles.text}>
                  Music:
                </ThemedText>
              </ThemedView>
              <ThemedView>
                <ThemedText style={styles.text}>
                  "The Vanishing Lake" is included by kind permission of the
                  composer, Francis Ward. "The Charlady" is included by kind
                  permission of the composer, Michael Fitzpatrick. All other
                  compositions are traditional and in the public domain. All
                  tracks were performed by Douglas Lowder on acoustic fiddle and
                  electronic instruments.
                </ThemedText>
              </ThemedView>
              <ThemedText>&nbsp;</ThemedText>
              <ThemedView>
                <ThemedText style={styles.text}>
                  Copyright &copy; 2010-2024 by Douglas Lowder, all rights
                  reserved.
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ParallaxScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const useHomeScreenStyles = function () {
  const scale = useScale();
  const backgroundColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const color = useThemeColor({}, 'background');
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
    textContainer: {
      flexDirection: 'row',
      padding: 5 * scale,
    },
    text: {
      textAlign: 'left',
      flex: 1,
      fontSize: 18 * scale,
    },
    image: {
      color: iconColor,
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
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20 * scale,
    },
    title: {
      flex: 1,
      margin: 20 * scale,
      fontSize: 24 * scale,
      lineHeight: 30 * scale,
    },
  });
};

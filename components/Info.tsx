import { Image } from 'expo-image';
import * as Application from 'expo-application';
import { StyleSheet, Platform, TVFocusGuideView } from 'react-native';
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
import { useUpdates } from 'expo-updates';

type InfoTabNames = 'About' | 'Instructions' | 'Thanks';

export default function Info({ tabName }: { tabName: InfoTabNames }) {
  const styles = useHomeScreenStyles();
  const { landscape } = useScale();
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <ThemedView style={styles.container}>
      <TVFocusGuideView
        autoFocus
        style={[styles.container, styles.safeAreaContainer]}
      >
        {landscape ? (
          <ParallaxScrollView tvScroll key="landscapeView">
            {tabName === 'Instructions' && <Instructions />}
            {tabName === 'About' && <About />}
            {tabName === 'Thanks' && <Thanks />}
          </ParallaxScrollView>
        ) : (
          <ParallaxScrollView key="portraitView">
            {tabName === 'Instructions' && <Instructions />}
            {tabName === 'About' && <About />}
            {tabName === 'Thanks' && <Thanks />}
          </ParallaxScrollView>
        )}
      </TVFocusGuideView>
    </ThemedView>
  );
}

function About() {
  const styles = useHomeScreenStyles();
  const { currentlyRunning } = useUpdates();

  return (
    <ThemedView>
      <ThemedView>
        <ThemedText type="defaultSemiBold" style={styles.text}>
          Software:
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.textSmall}>&nbsp;</ThemedText>
        <ThemedText
          style={styles.textSmall}
        >{`Version: ${Application.nativeApplicationVersion}`}</ThemedText>
        <ThemedText
          style={styles.textSmall}
        >{`Build number: ${Application.nativeBuildVersion}`}</ThemedText>
        <ThemedText style={styles.textSmall}>{`Bundle ID: ${
          currentlyRunning.updateId ?? 'Not defined in dev mode'
        }`}</ThemedText>
        <ThemedText style={styles.textSmall}>{`Bundle date: ${
          currentlyRunning.createdAt?.toISOString() ?? 'Not defined in dev mode'
        }`}</ThemedText>
        <ThemedText style={styles.textSmall}>&nbsp;</ThemedText>
        <ThemedText
          style={styles.textSmall}
        >{`react-native ${reactNativeVersion}`}</ThemedText>
        <ThemedText
          style={styles.textSmall}
        >{`expo ${expoVersion}`}</ThemedText>
        <ThemedText
          style={styles.textSmall}
        >{`expo-router ${expoRouterVersion}`}</ThemedText>
        <ThemedText
          style={styles.textSmall}
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
        <ThemedText style={styles.textSmall}>&nbsp;</ThemedText>
        <ThemedText style={styles.textSmall}>
          "The Vanishing Lake" is included by kind permission of the composer,
          Francis Ward. "The Charlady" is included by kind permission of the
          composer, Michael Fitzpatrick. All other compositions are traditional
          and in the public domain. All tracks were performed by Douglas Lowder
          on acoustic fiddle and electronic instruments.
        </ThemedText>
      </ThemedView>
      <ThemedText>&nbsp;</ThemedText>
      <ThemedView>
        <ThemedText style={styles.text}>
          Copyright &copy; 2010-2024 by Douglas Lowder, all rights reserved.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

function Instructions() {
  const styles = useHomeScreenStyles();
  const { scale } = useScale();
  return (
    <ThemedView>
      <ThemedView style={styles.textContainer}>
        <Ionicons size={30 * scale} name="play" style={styles.image} />
        <ThemedText style={styles.text}>
          Press this to play/pause the music. You can use the slider to move to
          a different part of the tune, and the up and down arrows to adjust the
          speed.
        </ThemedText>
      </ThemedView>
      {Platform.isTV && (
        <ThemedView style={styles.textContainer}>
          <Ionicons size={30 * scale} name="search" style={styles.image} />
          <ThemedText style={styles.text}>
            Press this to bring up a screen that will allow you to select a
            different dance tune.
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.textContainer}>
        <Ionicons size={30 * scale} name="repeat" style={styles.image} />
        <ThemedText style={styles.text}>
          Press this to turn on/off repeat play (music will automatically
          restart when finished).
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.textContainer}>
        <Ionicons size={30 * scale} name="play-back" style={styles.image} />
        <ThemedText style={styles.text}>
          Press this to rewind the track back to the beginning.
        </ThemedText>
      </ThemedView>
      {!Platform.isTV && (
        <ThemedView style={styles.textContainer}>
          <Ionicons size={30 * scale} name="menu" style={styles.image} />
          <ThemedText style={styles.text}>
            Use the menu to switch between the main screen, the tune selection
            screen, and this help screen.
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.text}>
          Tunes can be selected from four lists; use the selector at the bottom
          to change to a different list. There are two lists for the hornpipe
          tempo tunes, one for standard championship tempos (around 110 bpm),
          the other for "slow" tempos (around 76 - 80 bpm).
        </ThemedText>
      </ThemedView>
      {Platform.OS === 'ios' && (
        <ThemedView style={styles.textContainer}>
          <Image
            source={require('@/assets/images/airplay-route-picker.png')}
            style={{ width: 30, height: 30, margin: 10 }}
          />
          <ThemedText style={styles.text}>
            Pressing this button will bring up a list of available Airplay and
            Bluetooth devices to which the audio can be sent. The button will
            change to a cyan color when AirPlay is active.
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

function Thanks() {
  const styles = useHomeScreenStyles();
  return (
    <ThemedView>
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.text}>
          To all Irish dancers and dance teachers: thanks for giving me the idea
          of creating this app. I hope you enjoy this and find it useful.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.text}>
          Special thanks go to my son Scott Lowder, for his advice and help with
          the design of the user interface, and Gwen Stephens, for her
          assistance in testing several versions of this app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.text}>
          Finally, thanks to my wife Cheryl for all her love, encouragement, and
          support!
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const useHomeScreenStyles = function () {
  const { scale } = useScale();
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
      lineHeight: 24 * scale,
    },
    textSmall: {
      textAlign: 'left',
      flex: 1,
      fontSize: 12 * scale,
      lineHeight: 14 * scale,
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

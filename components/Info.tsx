import { Image } from 'expo-image';
import { Link } from 'expo-router';
import Constants from 'expo-constants';
import { StyleSheet, Pressable } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useScale } from '@/hooks/useScale';
import { useThemeColor } from '@/hooks/useThemeColor';

import { version as expoVersion } from 'expo/package.json';
import { version as expoRouterVersion } from 'expo-router/package.json';
import { version as expoAVVersion } from 'expo-av/package.json';
import { version as reactNativeVersion } from 'react-native/package.json';

type InfoTabNames = 'About' | 'Instructions' | 'Thanks';

export default function Info({ tabName }: { tabName: InfoTabNames }) {
  const styles = useHomeScreenStyles();

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  return (
    <ThemedView
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThemedView style={styles.buttonContainer}>
        <ThemedText style={styles.title} type="title">
          {tabName}
        </ThemedText>
        <Link href="/" asChild>
          <Pressable style={styles.button}>
            {({ pressed, focused }) => (
              <ThemedText
                type="default"
                style={[
                  styles.buttonText,
                  pressed ? { color: 'yellow' } : undefined,
                  focused ? { opacity: 0.6 } : undefined,
                ]}
              >
                Dismiss
              </ThemedText>
            )}
          </Pressable>
        </Link>
      </ThemedView>
      <ParallaxScrollView>
        {tabName === 'Instructions' && (
          <ThemedView>
            <ThemedView style={styles.textContainer}>
              <Image
                source={require('@/assets/images/playsmall.png')}
                style={styles.image}
              />
              <ThemedText style={styles.text}>
                Press this to play/pause the music. You can use the sliders to
                move to a different part of the tune, and to adjust the speed.
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.textContainer}>
              <Image
                source={require('@/assets/images/refreshsmall.png')}
                style={{ width: 40, height: 40, margin: 5 }}
              />
              <ThemedText style={styles.text}>
                Press this to bring up a dialog that will allow you to select a
                different dance tune.
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.textContainer}>
              <ThemedText style={styles.text}>
                Tunes can be selected from four lists; use the selector at the
                bottom to change to a different list. There are two lists for
                the hornpipe tempo tunes, one for tempo range 100 - 120 bpm, the
                other for the tempo range 75 - 85. The jig tempo tunes can be
                played at speeds from 60 - 80 bpm. Traditional hornpipe sets can
                be played at speeds from 110 - 160 bpm, and traditional jig sets
                can be played at speeds from 80 - 100 bpm.
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.textContainer}>
              <Image
                source={require('@/assets/images/airplay1.png')}
                style={{ width: 40, height: 40, margin: 5 }}
              />
              <ThemedText style={styles.text}>
                If you are near an Apple TV or other Airplay-enabled device, or
                you have connected to a compatible Bluetooth stereo accessory,
                you will see this icon appear in the lower left hand corner of
                the view. Pressing this icon will bring up a list of available
                Airplay and Bluetooth devices to which the audio can be sent.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
        {tabName == 'Thanks' && (
          <ThemedView>
            <ThemedView style={styles.textContainer}>
              <ThemedText style={styles.text}>
                To all Irish dancers and dance teachers: thanks for giving me
                the idea of creating this app. I hope you enjoy this and find it
                useful.
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
              <ThemedText style={styles.text}>&nbsp;</ThemedText>
              <ThemedText style={styles.text}>
                Copyright &copy; 2010-2024 by Doug Lowder, all rights reserved.
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.textContainer}>
              <ThemedText style={styles.text}>
                "The Vanishing Lake" is included by kind permission of the
                composer, Francis Ward. "The Charlady" is included by kind
                permission of the composer, Michael Fitzpatrick.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      </ParallaxScrollView>
    </ThemedView>
  );
}

const useHomeScreenStyles = function () {
  const scale = useScale();
  const backgroundColor = useThemeColor({}, 'tint');
  const color = useThemeColor({}, 'background');
  return StyleSheet.create({
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

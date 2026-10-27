// App-specific helpers for testing the expo-observe expo-updates integration.
// expo-updates error recovery handles only the errors that occur within 10
// seconds after the first render, so the crash test runs on the next launch.
import AsyncStorage from '@react-native-async-storage/async-storage';

const CRASH_ON_LAUNCH_KEY = 'crashTest.crashOnNextLaunch';

// A throw inside a promise callback is an unhandled rejection, not a fatal
// error, so the throw runs from a timer.
function throwFatalError(message: string) {
  setTimeout(() => {
    throw new Error(message);
  }, 0);
}

export function crashNow() {
  throwFatalError('Crash test: crash now (set-dances test)');
}

export async function crashOnNextLaunch() {
  await AsyncStorage.setItem(CRASH_ON_LAUNCH_KEY, '1');
}

export async function crashIfRequested() {
  if ((await AsyncStorage.getItem(CRASH_ON_LAUNCH_KEY)) == null) {
    return;
  }
  await AsyncStorage.removeItem(CRASH_ON_LAUNCH_KEY);
  throwFatalError('Crash test: crash on launch (set-dances test)');
}

import { Observe } from 'expo-observe';
import { Platform } from 'react-native';
import { ReanimatedLogLevel } from 'react-native-reanimated';
import { runOnUISync, scheduleOnRN } from 'react-native-worklets';

type ReanimatedLogData = {
  level: ReanimatedLogLevel;
  message: string;
};

// Reanimated stores its logger config on a per-runtime global. `logFunction` is
// internal, so it is absent from both the public `LoggerConfig` type and the
// published typings, and `configureReanimatedLogger` cannot set it.
type ReanimatedLoggerConfigInternal = {
  logFunction: (data: ReanimatedLogData) => void;
  level: ReanimatedLogLevel;
  strict: boolean;
};

declare global {
  var __reanimatedLoggerConfig: ReanimatedLoggerConfigInternal | undefined;
}

// A UI-runtime warning can repeat every frame, so report each distinct message
// once. The cap bounds the set when messages embed varying values.
const MAX_DISTINCT_MESSAGES = 100;
// Attribute values cross the network on every dispatch, and Reanimated's strict
// messages append a docs reference, so cap the copied message.
const MAX_MESSAGE_LENGTH = 500;
const reportedMessages = new Set<string>();

function reportToObserve(level: ReanimatedLogLevel, message: string) {
  if (reportedMessages.has(message) || reportedMessages.size >= MAX_DISTINCT_MESSAGES) {
    return;
  }
  reportedMessages.add(message);

  Observe.logEvent('reanimated.log', {
    displayName: 'Reanimated log',
    body: message,
    severity: level === ReanimatedLogLevel.error ? 'error' : 'warn',
    attributes: {
      level: ReanimatedLogLevel[level],
      // `eas observe:events` and `observe:session` surface `attributes` but not
      // `body`, so the message is copied here to stay queryable from the CLI.
      message: message.slice(0, MAX_MESSAGE_LENGTH),
    },
  });
}

function logToConsoleAndObserve(data: ReanimatedLogData) {
  'worklet';
  if (data.level === ReanimatedLogLevel.error) {
    console.error(data.message);
  } else {
    console.warn(data.message);
  }
  // Works from either runtime: on the RN runtime it queues a microtask, on the
  // UI runtime it hops to the RN runtime where the native module lives.
  scheduleOnRN(reportToObserve, data.level, data.message);
}

function installOnUIRuntime(level: ReanimatedLogLevel, strict: boolean) {
  'worklet';
  globalThis.__reanimatedLoggerConfig = {
    logFunction: logToConsoleAndObserve,
    level,
    strict,
  };
}

/**
 * Routes every Reanimated warning and error to expo-observe as a
 * `reanimated.log` user event, and keeps the console output.
 *
 * Replaces `configureReanimatedLogger`: it sets `level` and `strict` itself, so
 * calling `configureReanimatedLogger` afterwards resets them to the defaults.
 * Call it before any other Reanimated code runs.
 */
export function installReanimatedObserveLogger(
  options: { level?: ReanimatedLogLevel; strict?: boolean } = {}
) {
  const level = options.level ?? ReanimatedLogLevel.warn;
  const strict = options.strict ?? true;

  globalThis.__reanimatedLoggerConfig = {
    logFunction: logToConsoleAndObserve,
    level,
    strict,
  };

  if (Platform.OS !== 'web') {
    runOnUISync(installOnUIRuntime, level, strict);
  }
}

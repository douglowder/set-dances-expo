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

const REANIMATED_ERROR_NAME = 'reanimated.error';
const REANIMATED_WARNING_EVENT = 'reanimated.warning';

// A UI-runtime log can repeat every frame, so report each distinct message once.
// The cap bounds the set when messages embed varying values.
const MAX_DISTINCT_MESSAGES = 100;
// Attribute values cross the network on every dispatch, and Reanimated's strict
// messages append a docs reference, so cap the copied message.
const MAX_MESSAGE_LENGTH = 500;
const reportedMessages = new Set<string>();

/**
 * A Reanimated error routed to `Observe.reportError`. `reportCaughtError` maps
 * `name` to the report's `type` and `stack` to its `stacktrace`, so both are set
 * explicitly — the stack is captured at the log site, not at construction.
 */
export class ReanimatedError extends Error {
  constructor(message: string, stack?: string) {
    super(message);
    this.name = REANIMATED_ERROR_NAME;
    if (stack !== undefined) {
      this.stack = stack;
    }
  }
}

function shouldReport(message: string) {
  if (reportedMessages.has(message) || reportedMessages.size >= MAX_DISTINCT_MESSAGES) {
    return false;
  }
  reportedMessages.add(message);
  return true;
}

function reportErrorToObserve(message: string, stack: string | undefined) {
  if (shouldReport(message)) {
    Observe.reportError(new ReanimatedError(message, stack));
  }
}

function reportWarningToObserve(message: string) {
  if (shouldReport(message)) {
    Observe.logEvent(REANIMATED_WARNING_EVENT, {
      displayName: 'Reanimated warning',
      body: message,
      severity: 'warn',
      attributes: {
        // `eas observe:events` and `observe:session` surface `attributes` but
        // not `body`, so the message is copied here to stay queryable.
        message: message.slice(0, MAX_MESSAGE_LENGTH),
      },
    });
  }
}

function logToConsoleAndObserve(data: ReanimatedLogData) {
  'worklet';
  // Both branches hand off with `scheduleOnRN`, which works from either runtime:
  // on the RN runtime it queues a microtask, on the UI runtime it hops to the RN
  // runtime where the native module lives.
  if (data.level === ReanimatedLogLevel.error) {
    console.error(data.message);
    // Captured here because this is the only point where the frames that led to
    // the log are still on the stack; the hand-off below unwinds them.
    scheduleOnRN(reportErrorToObserve, data.message, new Error(data.message).stack);
  } else {
    console.warn(data.message);
    scheduleOnRN(reportWarningToObserve, data.message);
  }
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
 * Routes Reanimated logs to expo-observe, keeping the console output. Errors go
 * to `Observe.reportError` as a `reanimated.error`, carrying the stack from the
 * log site. Warnings go to `Observe.logEvent` as `reanimated.warning`.
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

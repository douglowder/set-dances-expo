import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tune, getTuneMap, AllTunes } from '@/constants/AllTunes';

const defaultTuneKey = AllTunes[0].key;

export const defaultTune = getTuneMap().get(defaultTuneKey) as unknown as Tune;

const LAST_TUNE_STORAGE_KEY = '@lastTuneKey';
const LAST_SPEED_STORAGE_KEY = '@lastSpeedKey';

type SpeedJson = {
  tuneKey: string;
  speed: number;
};

export const fetchTuneSettingAsync: () => Promise<Tune> = async () => {
  const tuneKey =
    (await AsyncStorage.getItem(LAST_TUNE_STORAGE_KEY)) ?? defaultTuneKey;
  return getTuneMap().get(tuneKey) || defaultTune;
};

export const storeTuneSettingAsync: (tune: Tune) => Promise<void> = async (
  tune,
) => {
  return await AsyncStorage.setItem(LAST_TUNE_STORAGE_KEY, tune.key);
};

export const displayedSpeedString = (tune: Tune | undefined, speed: number) => {
  if (tune?.key.includes('is_the_big')) {
    const hpSpeed = (113.0 * speed) / 70.0;
    return `${Math.floor(hpSpeed)}/${Math.floor(speed)}`;
  } else {
    return `${Math.floor(speed)}`;
  }
};

export const fetchSavedSpeedAsync: () => Promise<number> = async () => {
  const tune = await fetchTuneSettingAsync();
  const savedSpeedJsonString = await AsyncStorage.getItem(
    LAST_SPEED_STORAGE_KEY,
  );
  if (!savedSpeedJsonString) {
    return tune.defaultSpeed;
  }
  try {
    const savedSpeedJson = JSON.parse(savedSpeedJsonString) as SpeedJson;
    if (savedSpeedJson?.tuneKey === tune.key) {
      return savedSpeedJson.speed;
    } else {
      return tune.defaultSpeed;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return tune.defaultSpeed;
  }
};

export const storeSavedSpeedAsync: (
  tune: Tune,
  speed: number,
) => Promise<void> = async (tune, speed) => {
  const savedSpeedJson: SpeedJson = {
    tuneKey: tune.key,
    speed,
  };
  const savedSpeedJsonString = JSON.stringify(savedSpeedJson);
  return await AsyncStorage.setItem(
    LAST_SPEED_STORAGE_KEY,
    savedSpeedJsonString,
  );
};

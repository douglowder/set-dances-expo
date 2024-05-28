import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tune, getTuneMap } from '@/constants/AllTunes';

const defaultTuneKey = 'missbrownsfancy-70';
export const defaultTune = getTuneMap().get(defaultTuneKey) as unknown as Tune;

export const fetchTuneSettingAsync: () => Promise<Tune> = async () => {
  const tuneKey =
    (await AsyncStorage.getItem('@lastTuneKey')) ?? defaultTuneKey;
  return getTuneMap().get(tuneKey) || defaultTune;
};

export const storeTuneSettingAsync: (tune: Tune) => Promise<void> = async (
  tune,
) => {
  return await AsyncStorage.setItem('@lastTuneKey', tune.key);
};

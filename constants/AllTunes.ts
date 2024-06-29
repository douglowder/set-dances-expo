import { AVPlaybackSource } from 'expo-av';

export type TuneType = 'hp' | 'jig' | 'slowhp' | 'tradhp' | 'tradjig';

export type Tune = {
  key: string;
  type: TuneType;
  name: string;
  value: AVPlaybackSource;
  defaultSpeed: number;
  minSpeed: number;
  maxSpeed: number;
};

export const AllTunes: Tune[] = [
  {
    key: 'hp_ace_and_deuce_of_pipering_107',
    name: 'Ace And Deuce Of Pipering',
    value: require('@/assets/audio/hp_ace_and_deuce_of_pipering_107.m4a'),
    type: 'hp',
    defaultSpeed: 107,
    minSpeed: 100,
    maxSpeed: 120,
  },
];

let tuneMap: Map<string, Tune> | undefined = undefined;

export const getTuneMap = function (): Map<string, Tune> {
  if (!tuneMap) {
    tuneMap = new Map<string, Tune>();
    AllTunes.forEach((tune) => {
      tuneMap?.set(tune.key, tune);
    });
  }
  return tuneMap;
};

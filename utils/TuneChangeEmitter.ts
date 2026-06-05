import { EventEmitter } from 'expo-modules-core';

type TuneChangeEvents = {
  tuneChange: () => void;
};

const emitter = new EventEmitter<TuneChangeEvents>();

export const addTuneChangeListener = (listener: () => void) =>
  emitter.addListener('tuneChange', listener);

export const emitTuneChangeEvent = () => {
  emitter.emit('tuneChange');
};

import { EventEmitter as JsEventEmitter } from 'fbemitter';

let _jsEventEmitter: JsEventEmitter | null = null;
function _getJsEventEmitter(): JsEventEmitter {
  if (!_jsEventEmitter) {
    _jsEventEmitter = new JsEventEmitter();
  }
  return _jsEventEmitter;
}

export type TuneChangeEvent = {
  tuneKey: string;
};

export const addTuneChangeListener = (
  listener: (event: TuneChangeEvent) => void,
) => {
  return _getJsEventEmitter().addListener('tuneChangeEvent', listener);
};

export const emitTuneChangeEvent = (event: TuneChangeEvent) => {
  _getJsEventEmitter().emit('tuneChangeEvent', event);
};

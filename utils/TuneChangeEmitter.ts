import { EventEmitter as JsEventEmitter } from 'fbemitter';

let _jsEventEmitter: JsEventEmitter | null = null;
function _getJsEventEmitter(): JsEventEmitter {
  if (!_jsEventEmitter) {
    _jsEventEmitter = new JsEventEmitter();
  }
  return _jsEventEmitter;
}

export const addTuneChangeListener = (listener: () => void) => {
  return _getJsEventEmitter().addListener('tuneChangeEvent', listener);
};

export const emitTuneChangeEvent = () => {
  _getJsEventEmitter().emit('tuneChangeEvent');
};

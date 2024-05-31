import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoAirplayButtonViewProps } from './ExpoAirplayButtonView.types';
import { View } from 'react-native';

const NativeView: React.ComponentType<ExpoAirplayButtonViewProps> =
  requireNativeViewManager('ExpoAirplayButtonView');

export default function ExpoAirplayButtonView(
  props: ExpoAirplayButtonViewProps,
) {
  return (
    <View
      {...props}
      style={[
        props.style,
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <NativeView {...props} />
    </View>
  );
}

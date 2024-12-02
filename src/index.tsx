import { type LayoutRectangle, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Input } from './components/Input';
import { defaultSettings } from './defaultSettings';
import type { ISettings } from './types/settings';
import { Dropdown } from './components/Dropdown';
import React from 'react';
import { defaultLayloutRect, getTestSearchItems, mergeSettings } from './utils';

export const AutoComplete = (settings: ISettings = defaultSettings) => {
  const containerRef = React.useRef<View>(null);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);

  const handleContainerLayoutChange = (e: LayoutChangeEvent) => {
    setContainerRect(e.nativeEvent.layout);
  };

  return (
    <View style={styles.container} ref={containerRef} onLayout={handleContainerLayoutChange}>
      <Input {...mergeSettings(defaultSettings, settings)} />
      <Dropdown items={getTestSearchItems()} containerRect={containerRect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

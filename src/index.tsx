import { type LayoutRectangle, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { InputMemoized } from './components/Input';
import { defaultSettings } from './defaultSettings';
import type { Settings } from './types/settings';
import { Dropdown } from './components/Dropdown';
import React from 'react';
import { defaultLayloutRect, getTestSearchItems, mergeSettings } from './utils';

export const AutoComplete = (settings: Settings = defaultSettings) => {
  const containerRef = React.useRef<View>(null);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  // const [inputValue, setInputValue] = React.useState<string>('');
  // const [isPedingInputValue, startInputValueTransition] = useTransition();
  const inputSettingsProps = React.useMemo(
    () => mergeSettings(defaultSettings, settings),
    [settings]
  );

  const handleContainerLayoutChange = (e: LayoutChangeEvent) => {
    setContainerRect(e.nativeEvent.layout);
  };

  // const handleInputChange = useCallback((text: string) => {
  // startInputValueTransition(() => setInputValue(text));
  // }, []);

  return (
    <View style={styles.container} ref={containerRef} onLayout={handleContainerLayoutChange}>
      <InputMemoized {...inputSettingsProps} />
      <Dropdown items={getTestSearchItems()} containerRect={containerRect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

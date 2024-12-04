import { type LayoutRectangle, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { InputMemoized } from './components/Input';
import { defaultSettings } from './defaultSettings';
import type { Settings } from './types/settings';
import { Dropdown } from './components/Dropdown';
import React from 'react';
import { defaultLayloutRect, getTestSearchItems, mergeSettings } from './utils';
import { useSearch } from './hooks/useSearch';
import { MATCH_TAG_END, MATCH_TAG_START } from './constants';
const seatchItems = getTestSearchItems();

export const AutoComplete = (settings: Settings = defaultSettings) => {
  const containerRef = React.useRef<View>(null);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [items, setItems] = React.useState(seatchItems);
  const [, startItemsListTransition] = React.useTransition();
  const inputSettingsProps = React.useMemo(
    () => mergeSettings(defaultSettings, settings),
    [settings]
  );

  const { handleSearch } = useSearch(seatchItems, {
    wrapMatch: {
      start: MATCH_TAG_START,
      end: MATCH_TAG_END,
    },
  });

  const handleContainerLayoutChange = (e: LayoutChangeEvent) => {
    setContainerRect(e.nativeEvent.layout);
  };

  const handleInputChange = (text: string) => {
    startItemsListTransition(() => {
      const _items = handleSearch(text);
      setItems(_items);
    });
  };

  return (
    <View style={styles.container} ref={containerRef} onLayout={handleContainerLayoutChange}>
      <InputMemoized {...inputSettingsProps} onChangeText={handleInputChange} />
      <Dropdown items={items} containerRect={containerRect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

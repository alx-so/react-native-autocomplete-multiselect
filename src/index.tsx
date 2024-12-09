import { type LayoutRectangle, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { InputMemoized } from './components/Input';
import { defaultSettings } from './defaultSettings';
import type { Settings } from './types/settings';
import { Dropdown } from './components/Dropdown';
import React from 'react';
import { defaultLayloutRect, getTestSearchItems, mergeSettings } from './utils';
import { useSearch, type SearchItem } from './hooks/useSearch';
import { MATCH_TAG_END, MATCH_TAG_START } from './constants';
import { Select } from './components/Select';
import type { DropdownItem } from './types/common';
import { removeTags } from './common/composePartialTextNode';
const seatchItems = getTestSearchItems().sort((a, b) => a.label.localeCompare(b.label));

export const AutoComplete = (settings: Settings) => {
  const containerRef = React.useRef<View>(null);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [tags, setTags] = React.useState<DropdownItem[]>([]);
  const [items, setItems] = React.useState(seatchItems);
  const [, startItemsListTransition] = React.useTransition();
  settings = React.useMemo(() => mergeSettings(defaultSettings, settings), [settings]);

  const { handleSearch } = useSearch(seatchItems as SearchItem[], {
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

  const handleItemPress = (item: DropdownItem) => {
    const tag = { ...item, label: removeTags(item.label) };

    const _items = items.filter((i) => i.id !== item.id);
    const newSearchItems = seatchItems.filter((i) => i.id !== item.id);
    seatchItems.length = 0;
    seatchItems.push(...newSearchItems);

    setTags([...tags, tag]);
    setItems([..._items]);
  };

  const handleTagRemove = (tag: DropdownItem) => {
    const newTags = tags.filter((t) => t.id !== tag.id);
    const newItems = [...items, tag].sort((a, b) => a.label.localeCompare(b.label));

    seatchItems.push(tag);
    seatchItems.sort((a, b) => a.label.localeCompare(b.label));

    setTags(newTags);
    setItems(newItems);
  };

  const handleTagAdd = (tag: DropdownItem) => {
    setTags([...tags, tag]);
  };

  return (
    <View style={styles.container} ref={containerRef} onLayout={handleContainerLayoutChange}>
      {settings.type === 'input' ? (
        <InputMemoized
          {...settings}
          tags={tags}
          onTextChange={handleInputChange}
          onTagRemove={handleTagRemove}
          onTagAdd={handleTagAdd}
        />
      ) : (
        <Select {...settings} tags={tags} onTagRemove={handleTagRemove} />
      )}
      <Dropdown
        items={items}
        containerRect={containerRect}
        isSearchVisible={settings.type === 'select' && settings.isSelectSearchVisible}
        onSearchTextChange={handleInputChange}
        onItemPress={handleItemPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

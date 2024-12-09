import {
  type LayoutRectangle,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  Alert,
} from 'react-native';
import { InputMemoized } from './components/Input';
import { defaultSettings } from './defaultSettings';
import type { Settings } from './types/settings';
import { Dropdown } from './components/Dropdown';
import React from 'react';
import { defaultLayloutRect, getTestSearchItems, mergeSettings } from './utils';
import { useSearch, type SearchItem } from './hooks/useSearch';
import { MATCH_TAG_END, MATCH_TAG_START } from './constants';
import { Select } from './components/Select';
import type { DropdownItem, TagItem } from './types/common';
import { removeTags } from './common/composePartialTextNode';
const seatchItems = getTestSearchItems().sort((a, b) => a.label.localeCompare(b.label));

export const AutoComplete = (settings: Settings) => {
  const containerRef = React.useRef<View>(null);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [tags, setTags] = React.useState<TagItem[]>([]);
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

  const removeTag = (tag: TagItem) => {
    const newTags = tags.filter((t) => t.id !== tag.id);
    setTags(newTags);

    if (settings.type === 'input-select' || settings.type === 'select') {
      restoreSearchItem(tag);
    }
  };

  const restoreSearchItem = (tag: TagItem) => {
    const newItems = [...items, tag].sort((a, b) => a.label.localeCompare(b.label));

    seatchItems.push(tag);
    seatchItems.sort((a, b) => a.label.localeCompare(b.label));
    setItems(newItems);
  };

  const handleTagAdd = (tag: TagItem) => {
    setTags([...tags, tag]);
  };

  const handleRemoveTag = (tag: TagItem) => {
    switch (settings.tagBackspaceDeleteBehavior) {
      case 'delete':
      case 'delete-modify':
        removeTag(tag);
        break;
      case 'delete-confirm':
        removeTagAfterConfirm(tag);
        break;
    }
  };

  const removeTagAfterConfirm = (tag: TagItem) => {
    const handlePress = () => removeTag(tag);

    // TODO: localize the default alert message
    Alert.alert('Are you sure?', 'Do you want to the tag?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: handlePress,
      },
    ]);
  };

  const isInputComponent = settings.type === 'input' || settings.type === 'input-select';
  const isDropdownSearchVisible = settings.type === 'select' && settings.isSelectSearchVisible;

  return (
    <View style={styles.container} ref={containerRef} onLayout={handleContainerLayoutChange}>
      {isInputComponent ? (
        <InputMemoized
          {...settings}
          tags={tags}
          onTextChange={handleInputChange}
          onTagRemove={handleRemoveTag}
          onTagAdd={handleTagAdd}
        />
      ) : (
        <Select {...settings} tags={tags} onTagRemove={handleRemoveTag} />
      )}

      <Dropdown
        items={items}
        containerRect={containerRect}
        isSearchVisible={isDropdownSearchVisible}
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

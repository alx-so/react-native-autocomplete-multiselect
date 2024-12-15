import {
  type LayoutRectangle,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  Alert,
} from 'react-native';
import { InputMemoized, type InputRef } from './components/Input';
import { defaultSettings } from './defaultSettings';
import type { Settings } from './types/settings';
import { Dropdown } from './components/Dropdown';
import React, { useEffect, useMemo } from 'react';
import { defaultLayloutRect, mergeSettings } from './utils';
import { useSearch, type SearchItem } from './hooks/useSearch';
import { MATCH_TAG_END, MATCH_TAG_START } from './constants';
import { SelectMultiple } from './components/SelectMultiple';
import type { DropdownItem, TagItem } from './types/common';
import { removeTags } from './common/composePartialTextNode';
import type { DropdownNoticeOpts } from './components/DropdownNotice';
import { Select } from './components/Select';
// import { Input } from './components/Input';
import { Input } from './components/Input';
import { AddTagDropdownNotice } from './components/AddTagDropdownNotice';

export const AutoComplete = (settings: Settings) => {
  const seatchItems = useMemo<SearchItem[]>(() => {
    const _items = (settings.items || []) as SearchItem[];

    return [..._items];
  }, [settings.items]);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [tags, setTags] = React.useState<TagItem[]>([]);
  const [items, setItems] = React.useState(seatchItems);
  const [, startItemsListTransition] = React.useTransition();
  const [dropdownNotice, setDropdownNotice] = React.useState<DropdownNoticeOpts | null>(null);
  const inputRef = React.useRef<InputRef>(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = React.useState(false);
  settings = React.useMemo(() => mergeSettings(defaultSettings, settings), [settings]);

  const { handleSearch, warmUpSearch } = useSearch(seatchItems, {
    wrapMatch: {
      start: MATCH_TAG_START,
      end: MATCH_TAG_END,
    },
  });

  useEffect(() => {
    warmUpSearch();
  }, [warmUpSearch]);

  const handleContainerLayoutChange = (e: LayoutChangeEvent) => {
    setContainerRect(e.nativeEvent.layout);
  };

  const handleInputChange = (text: string) => {
    const isSimpleInput = settings.type === 'input';

    console.log('handleInputChange', text, isSimpleInput);

    if (isSimpleInput) {
      setDropdownNotice({
        label: text,
        type: 'add-tag',
      });

      return;
    }

    startItemsListTransition(() => {
      const startTime = performance.now();
      const _items = handleSearch(text);
      const endTime = performance.now();

      console.log('Search time:', endTime - startTime);

      const inputIsNotEmpty = Boolean(text);
      const hasSuggestions = _items.length > 0;

      setItems(_items);

      if (inputIsNotEmpty && !hasSuggestions) {
        setDropdownNotice({
          label: 'No results found',
          type: 'info',
        });
      } else {
        setIsSuggestionsVisible(true);
        setDropdownNotice(null);
      }
    });
  };

  const handleItemPress = (item: DropdownItem) => {
    const tag = { ...item, label: removeTags(item.label) };

    const newSearchItems = seatchItems.filter((i) => i.id !== item.id);
    seatchItems.length = 0;
    seatchItems.push(...newSearchItems);

    setTags([...tags, tag]);
    setItems([...seatchItems]);
    // TODO: optional via settings
    // setIsSuggestionsVisible(false);
    //
    inputRef.current?.clear();
  };

  const removeTag = (tag: TagItem) => {
    const newTags = tags.filter((t) => t.id !== tag.id);
    setTags(newTags);

    if (
      settings.type === 'input-select' ||
      settings.type === 'select' ||
      settings.type === 'select-multiple'
    ) {
      restoreSearchItem(tag);
    }
  };

  const restoreSearchItem = (tag: TagItem) => {
    const seatchItem: SearchItem = { id: tag.id, label: tag.label };
    const newItems = [...(items || []), seatchItem].sort((a, b) => a.label.localeCompare(b.label));

    seatchItems.push(tag);
    seatchItems.sort((a, b) => a.label.localeCompare(b.label));
    setItems(newItems);
  };

  const handleTagAdd = (tag: TagItem) => {
    setTags([...tags, tag]);
    setDropdownNotice(null);
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

  const handleNoticePress = (type: string) => {
    if (type === 'add-tag') {
      const label = inputRef.current?.getValue() || '';
      const tag: TagItem = { id: new Date().getTime(), label };
      setTags([...tags, tag]);
      setDropdownNotice(null);
      inputRef.current?.clear();
    }
  };

  const handleToggleDropdown = (isVisible: boolean) => {
    setIsSuggestionsVisible(isVisible);
    setDropdownNotice(null);

    if (!isVisible) {
      restoreSearchItemsWithoutTags();
    }
  };

  const handleInputBlur = () => {
    setIsSuggestionsVisible(false);
    setDropdownNotice(null);

    restoreSearchItemsWithoutTags();
  };

  const handleInputFocus = () => {
    if (!Array.isArray(settings.items) || settings.items.length === 0) return;

    setIsSuggestionsVisible(true);
  };

  const restoreSearchItemsWithoutTags = () => {
    const newItems = seatchItems.filter((i) => !tags.some((t) => t.id === i.id));
    setItems(newItems);
  };

  const isInputComponent = settings.type === 'input' || settings.type === 'input-select';
  const isDropdownSearchVisible =
    (settings.type === 'select' || settings.type === 'select-multiple') &&
    settings.isSelectSearchVisible &&
    isSuggestionsVisible;

  return (
    <View style={styles.container} onLayout={handleContainerLayoutChange}>
      {isInputComponent ? (
        <InputMemoized
          refObj={inputRef}
          {...settings}
          tags={tags}
          onTextChange={handleInputChange}
          onTagRemove={handleRemoveTag}
          onTagAdd={handleTagAdd}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
        />
      ) : (
        <SelectMultiple
          {...settings}
          tags={tags}
          isDropdownOpen={isSuggestionsVisible}
          onToggleDropdown={handleToggleDropdown}
          onTagRemove={handleRemoveTag}
        />
      )}

      <Dropdown
        notice={dropdownNotice}
        items={items}
        containerRect={containerRect}
        isSuggestionsListVisible={isSuggestionsVisible}
        isSearchVisible={isDropdownSearchVisible}
        onNoticePress={handleNoticePress}
        onSearchTextChange={handleInputChange}
        onSuggestionItemPress={handleItemPress}
      />
    </View>
  );
};

const InputEnchanced = (props) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [endNode, setEndNode] = React.useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (props.multiple) {
      if (inputValue) {
        setEndNode(<AddTagDropdownNotice notice={inputValue} />);

        return;
      }

      if (endNode) {
        setEndNode(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, props.multiple]);

  return <Input {...props} onChange={setInputValue} endNode={endNode} />;
};

AutoComplete.Select = Select;
AutoComplete.Input = InputEnchanced;

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
  },
});

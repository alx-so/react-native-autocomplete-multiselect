import React, { useEffect } from 'react';
import { Pressable, StyleSheet, type LayoutChangeEvent, type LayoutRectangle } from 'react-native';
import { DropdownList } from '../DropdownList';
import { defaultLayloutRect } from '../../utils';
import type { DropdownItem, TagItem } from '../../types/common';
import { Input, type InputRefObject, type InputValue } from '../Input';
import { useSearch, type SearchItem } from '../../hooks/useSearch';
import { MATCH_TAG_END, MATCH_TAG_START } from '../../constants';
import { composePartialTextNode, removeTags } from '../../common/composePartialTextNode';
import { DropdownNotice } from '../DropdownList/DropdownNotice';

export type SelectValue = string | string[];

interface InputSelectProps {
  closeOnSelect?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (value: SelectValue) => void;
  placeholder?: string;
  renderValue?: (value: SelectValue) => React.ReactNode;
  renderDropdownItem?: (item: DropdownItem) => React.ReactNode;
  testID?: string;
  value?: SelectValue;
  icon?: React.ReactNode;
  items: DropdownItem[];
}

// const iconSize = 12;
// const textEllipsisMode = { ellipsizeMode: 'tail' as const, numberOfLines: 1 };

export const InputSelect: React.FC<InputSelectProps> = (props) => {
  const seatchItems = React.useMemo<SearchItem[]>(() => {
    const _items = (props.items || []) as SearchItem[];
    return [..._items];
  }, [props.items]);
  const [autocompleteItems, setAutocompleteItems] = React.useState(seatchItems);
  const [isOpen, setIsOpen] = React.useState(props.open);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [value, setValue] = React.useState<SelectValue>(props.value || '');
  const [dropdownListNode, setDropdownListNode] = React.useState<React.ReactNode | null>(null);
  const inputRef = React.useRef<InputRefObject>(null);
  const [, startItemsListTransition] = React.useTransition();
  const currentTags = React.useRef<TagItem[]>([]);

  const { handleSearch } = useSearch(seatchItems, {
    wrapMatch: {
      start: MATCH_TAG_START,
      end: MATCH_TAG_END,
    },
  });

  useEffect(() => {
    setIsOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    if (isOpen) {
      props.onOpen?.();
    } else {
      props.onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    props.onChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      const inputIsNotEmpty = Boolean(value);
      const hasSuggestions = autocompleteItems.length > 0;

      if (inputIsNotEmpty && !hasSuggestions) {
        console.log('No results found');
        setDropdownListNode(<DropdownNotice label="No results found" type="info" />);
      } else {
        setDropdownListNode(
          <DropdownList
            style={styles.dropdown}
            containerRect={containerRect}
            items={autocompleteItems}
            renderItem={renderDropdownItem}
          />
        );
      }
    } else {
      setDropdownListNode(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, autocompleteItems]);

  const handleItemPress = (item: DropdownItem) => {
    if (props.multiple) {
      appendTag(item);
      // reset input value
      setValue('');
    } else {
      setValue(removeTags(item.label));
    }

    if (props.closeOnSelect) {
      inputRef.current?.blur();
      setIsOpen(false);
    }
  };

  const handleInputValueChange = (val: InputValue) => {
    setValue(val);

    startItemsListTransition(() => {
      const _items = handleSearch(val as string);
      setAutocompleteItems(_items);
    });
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerRect(e.nativeEvent.layout);
  };

  const renderDropdownItem = (item: DropdownItem) => {
    if (props.renderDropdownItem) {
      return props.renderDropdownItem(item);
    }

    // const selectedItemStyle = composeSelectedDropdownItemStyle(
    //   item,
    //   value,
    //   styles.dropdownItemSelected
    // );

    return (
      <Pressable key={item.id} onPress={() => handleItemPress(item)} style={[styles.dropdownItem]}>
        {composePartialTextNode(item.label, {
          matchedTextNodeStyle: { fontWeight: 'bold' },
          startStrPart: MATCH_TAG_START,
          endStrPart: MATCH_TAG_END,
        })}
      </Pressable>
    );
  };

  const handleInputFocus = () => {
    if (props.disabled) return;

    if (!props.multiple) {
      setAutocompleteItems([...seatchItems]);
    }

    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsOpen(false);
  };

  const handleTagsListChange = (tags: TagItem[]) => {
    const isAdded = tags.length > currentTags.current.length;
    const isRemoved = tags.length < currentTags.current.length;
    // const isEdited = tags.length === currentTags.current.length;

    if (isAdded) {
      const newTags = tags.filter((t) => !currentTags.current.some((ct) => ct.id === t.id));
      if (newTags.length > 0) {
        removeSearchItems(newTags);
      }
    }

    if (isRemoved) {
      const removedTags = currentTags.current.filter((ct) => !tags.some((t) => t.id === ct.id));

      if (removedTags.length > 0) {
        addSearchItems(removedTags);
      }
    }

    currentTags.current = tags;
  };

  const removeSearchItems = (o: DropdownItem[]) => {
    const newSearchItems = seatchItems.filter((i) => !o.some((item) => item.id === i.id));
    seatchItems.length = 0;
    seatchItems.push(...newSearchItems);
    setAutocompleteItems(newSearchItems);
  };

  const addSearchItems = (o: DropdownItem[]) => {
    const newSearchItems = seatchItems.concat(o).sort((a, b) => a.label.localeCompare(b.label));

    seatchItems.length = 0;
    seatchItems.push(...newSearchItems);
    setAutocompleteItems(newSearchItems);
  };

  const appendTag = (tag: TagItem) => {
    inputRef.current?.setTags([
      ...currentTags.current,
      {
        id: tag.id,
        label: removeTags(tag.label),
      },
    ]);
  };

  return (
    <Input
      {...props}
      refObject={inputRef}
      value={value}
      multiple={props.multiple}
      onChange={handleInputValueChange}
      onContainerLayoutChange={handleLayout}
      startNode={dropdownListNode}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      tagProps={{
        showRemoveButton: true,
        onChange: handleTagsListChange,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    borderColor: 'black',
    borderWidth: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 99999,
  },
  selectValue: {
    padding: 4,
    height: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  selectValueText: {
    width: '100%',
    verticalAlign: 'middle',
  },
  chevron: {
    position: 'absolute',
    right: 4,
    top: 18,
  },
  dropdownItem: {
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownItemText: {
    paddingHorizontal: 4,
  },
});

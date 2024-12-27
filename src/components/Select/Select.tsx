import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import ChevronIcon from '../icons/ChevronIcon';
import { DropdownList } from '../DropdownList';
import { defaultLayoutRect } from '../../utils';
import type { ContainerRect, DropdownItem } from '../../types/common';
import {
  composeSelectedDropdownItemStyle,
  isItemSelected,
  removeItemFromMultipleValue,
} from './utils';
import { Tag } from '../Tag/Tag';
import { SelectSearchInput, type SelectSearchInputRef } from './SelectSearchInput';
import { useSearch, type SearchItem } from '../../hooks/useSearch';
import { MATCH_TAG_END, MATCH_TAG_START } from '../../constants';
import { composePartialTextNode, removeTags } from '../../common/composePartialTextNode';
import { getThemeStyles } from '../../styles/theme';
import CheckIcon from '../icons/CheckIcon';

export type SelectValue = string | string[];

interface SelectProps {
  closeOnSelect?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  focusSearchOnOpen?: boolean;
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

const iconSize = 12;
const textEllipsisMode = { ellipsizeMode: 'tail' as const, numberOfLines: 1 };
const theme = getThemeStyles();

export const Select: React.FC<SelectProps> = (props) => {
  const searchItems = React.useMemo<SearchItem[]>(() => {
    const _items = (props.items || []) as SearchItem[];
    return [..._items];
  }, [props.items]);
  const [autocompleteItems, setAutocompleteItems] = React.useState(searchItems);
  const [isOpen, setIsOpen] = React.useState(props.open);
  const [containerRect, setContainerRect] = React.useState<ContainerRect>(defaultLayoutRect);
  const [value, setValue] = React.useState<SelectValue>(props.value || '');
  const selectValueExtraStyle: ViewStyle = { maxWidth: containerRect.width - iconSize * 2 };
  const searchInputRef = React.useRef<SelectSearchInputRef>(null);
  const [, startItemsListTransition] = React.useTransition();

  const { handleSearch } = useSearch(searchItems, {
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

    if (isOpen && props.searchable && props.focusSearchOnOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    if (props.searchable && !isOpen) {
      searchInputRef.current?.clear();
      setAutocompleteItems(searchItems);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    props.onChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handlePress = () => {
    if (props.disabled) return;

    setIsOpen(!isOpen);
  };

  const handleItemPress = (item: DropdownItem) => {
    setValue((prevValue) => {
      const newItemValue = props.searchable ? removeTags(item.label) : item.label;

      if (props.multiple) {
        if (isItemSelected(newItemValue, prevValue)) {
          const newValue = removeItemFromMultipleValue(newItemValue, prevValue);

          return newValue;
        }

        return [...(prevValue as string[]), newItemValue];
      }

      return newItemValue;
    });

    const isCurrentSearchEmpty = !searchInputRef.current?.getValue();
    if (props.searchable && !isCurrentSearchEmpty) {
      setAutocompleteItems((prevItems) => {
        const itemsWithoutSelected = prevItems.filter((i) => i.id !== item.id);

        return itemsWithoutSelected;
      });
    }

    if (props.closeOnSelect) {
      setIsOpen(false);
    }
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    e.target.measure((x, y, width, height, pageX, pageY) => {
      setContainerRect({ width, height, pageX, pageY });
    });
  };

  const renderValue = () => {
    if (props.renderValue) {
      return props.renderValue(value);
    }

    return (
      <Text style={styles.selectValueText} {...textEllipsisMode}>
        {value}
      </Text>
    );
  };

  const renderMultipleValues = () => {
    if (!Array.isArray(value)) {
      return null;
    }

    if (props.renderValue) {
      return props.renderValue(value);
    }

    return (
      <>
        {value.map((val, i) => (
          <Tag key={i}>{val}</Tag>
        ))}
      </>
    );
  };

  const renderDropdownItem = (item: DropdownItem) => {
    if (props.renderDropdownItem) {
      return props.renderDropdownItem(item);
    }

    const isSelected = isItemSelected(
      props.searchable ? removeTags(item.label) : item.label,
      value
    );

    const selectedItemStyle = composeSelectedDropdownItemStyle(
      item,
      value,
      styles.dropdownItemSelected
    );

    return (
      <Pressable
        key={item.id}
        onPress={() => handleItemPress(item)}
        style={[styles.dropdownItem, selectedItemStyle]}
      >
        {composePartialTextNode(item.label, {
          matchedTextNodeStyle: { fontWeight: 'bold' },
          startStrPart: MATCH_TAG_START,
          endStrPart: MATCH_TAG_END,
        })}
        {isSelected && <CheckIcon containerStyle={{ marginLeft: 10 }} />}
      </Pressable>
    );
  };

  const handleSearchChange = (val: string) => {
    startItemsListTransition(() => {
      let _items = handleSearch(val as string);

      if (val) {
        _items = _items.filter((i) => !isItemSelected(removeTags(i.label), value));
      }

      setAutocompleteItems(_items);
    });
  };

  const dropdownHeader = props.searchable ? (
    <SelectSearchInput onChange={handleSearchChange} refObj={searchInputRef} />
  ) : null;

  const containerThemeStyle = [theme.select, isOpen ? theme.selectFocused : {}];

  return (
    <View style={[styles.container, containerThemeStyle]} onLayout={handleLayout}>
      <View style={[styles.selectValue, selectValueExtraStyle]}>
        {!props.multiple ? renderValue() : renderMultipleValues()}
      </View>

      <Pressable onPress={handlePress} style={styles.select}>
        <ChevronIcon
          onPress={handlePress}
          rotation={isOpen ? 'Top' : 'Bottom'}
          size={iconSize}
          style={styles.chevron}
        />
      </Pressable>

      {isOpen && (
        <DropdownList
          header={dropdownHeader}
          containerRect={containerRect}
          items={autocompleteItems}
          renderItem={renderDropdownItem}
        />
      )}
    </View>
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
  },
  select: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
  selectValue: {
    padding: 4,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  selectValueText: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 14,
    verticalAlign: 'middle',
  },
  chevron: {
    position: 'absolute',
    right: 4,
    top: 18,
  },
  dropdownItem: theme.dropdownItem,
  dropdownItemSelected: theme.dropdownItemSelected,
});

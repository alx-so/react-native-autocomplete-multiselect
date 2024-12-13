import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  useWindowDimensions,
  type LayoutRectangle,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';
import { Position, type DropdownItem } from '../types/common';
import { composePartialTextNode } from '../common/composePartialTextNode';
import { MATCH_TAG_END, MATCH_TAG_START } from '../constants';
import { DropdownNotice, type DropdownNoticeOpts, type DropdownNoticeType } from './DropdownNotice';
import { useEffect } from 'react';
import React from 'react';

// TODO: make ajustable
const requiredDropdownHeight = 200;

export const Dropdown: DropdownComponent = (props) => {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const deviceDimensions = useWindowDimensions();
  const position = calcDropdownPosition(
    props.containerRect,
    deviceDimensions.height,
    keyboardHeight
  );
  const containerStyle = getContainerStylePosition(position, props.containerRect.height);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleItemPress = (item: DropdownItem) => {
    props.onSuggestionItemPress?.(item);
  };

  const handleNoticePress = (type: DropdownNoticeType) => {
    props.onNoticePress?.(type);
  };

  if (!props.isSuggestionsListVisible && !props.notice) return null;

  return (
    <View style={[styles.dropdown, containerStyle]}>
      {props.isSearchVisible && (
        <TextInput
          style={styles.searchInput}
          onChangeText={props.onSearchTextChange}
          placeholder="Type to search.."
        />
      )}

      <DropdownNotice
        label={props.notice?.label}
        type={props.notice?.type}
        onNoticePress={handleNoticePress}
      />

      {Array.isArray(props.items) && !props.notice && props.isSuggestionsListVisible && (
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
          {props.items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleItemPress(item)}
              style={styles.suggestionItem}
            >
              {composePartialTextNode(item.label, {
                matchedTextNodeStyle: { fontWeight: 'bold' },
                startStrPart: MATCH_TAG_START,
                endStrPart: MATCH_TAG_END,
              })}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

interface DropdownProps {
  isSearchVisible?: boolean;
  isSuggestionsListVisible?: boolean;
  items?: DropdownItem[];
  containerRect: LayoutRectangle;
  notice?: DropdownNoticeOpts | null;
  onNoticePress?: (type: DropdownNoticeType) => void;
  onSuggestionItemPress?: (item: DropdownItem) => void;
  onSearchTextChange?: (text: string) => void;
}

type DropdownComponent = React.FC<DropdownProps>;
type DropdownPosition = Position.Top | Position.Bottom;

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: requiredDropdownHeight / 2,
  },
  suggestionItem: {
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },
  dropdown: {
    width: '100%',
    position: 'absolute',
    zIndex: 9999999999999,
    backgroundColor: 'white',
    borderWidth: 1,
  },
  searchInput: {
    height: 54,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: 'green',
  },
});

const getContainerStylePosition = (
  pos: DropdownPosition,
  containerHeight: number
): StyleProp<ViewStyle> => {
  return {
    top: pos === 'top' ? 'auto' : containerHeight,
    bottom: pos === 'top' ? containerHeight : 'auto',
  };
};

const calcDropdownPosition = (
  rect: LayoutRectangle,
  windowHeight: number,
  keyboardHeight: number
) => {
  const yBottomPosition = rect.y + rect.height;
  const yBottomPositionWithDropdown = yBottomPosition + requiredDropdownHeight;
  const windowHeightWithoutKeyboard = windowHeight - keyboardHeight;

  if (yBottomPositionWithDropdown > windowHeightWithoutKeyboard) {
    return Position.Top;
  }

  return Position.Bottom;
};

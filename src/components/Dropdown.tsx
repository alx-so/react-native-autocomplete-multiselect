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
} from 'react-native';
import { Position, type DropdownItem } from '../types/common';
import { composePartialTextNode } from '../common/composePartialTextNode';
import { MATCH_TAG_END, MATCH_TAG_START } from '../constants';

// TODO: make ajustable
const requiredDropdownHeight = 200;

export const Dropdown: DropdownComponent = (props) => {
  const deviceDimensions = useWindowDimensions();
  const position = calcDropdownPosition(props.containerRect, deviceDimensions.height);
  const containerStyle = getContainerStylePosition(position, props.containerRect.height);

  const handleItemPress = (item: DropdownItem) => {
    props.onItemPress?.(item);
  };

  return (
    <View style={[styles.dropdown, containerStyle]}>
      {props.isSearchVisible && (
        <TextInput
          style={styles.searchInput}
          onChangeText={props.onSearchTextChange}
          placeholder="Type to search.."
        />
      )}
      <ScrollView style={styles.scrollView}>
        {props.items.map((item) => (
          <Pressable key={item.id} onPress={() => handleItemPress(item)}>
            {composePartialTextNode(item.label, {
              matchedTextNodeStyle: { fontWeight: 'bold' },
              startStrPart: MATCH_TAG_START,
              endStrPart: MATCH_TAG_END,
            })}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

interface DropdownProps {
  isSearchVisible?: boolean;
  onSearchTextChange?: (text: string) => void;
  items: DropdownItem[];
  containerRect: LayoutRectangle;
  onItemPress?: (item: DropdownItem) => void;
}

type DropdownComponent = React.FC<DropdownProps>;

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: requiredDropdownHeight / 2,
  },
  dropdown: {
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  searchInput: {
    height: 54,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: 'green',
  },
});

type DropdownPosition = Position.Top | Position.Bottom;

const getContainerStylePosition = (
  pos: DropdownPosition,
  containerHeight: number
): StyleProp<ViewStyle> => {
  return {
    top: pos === 'top' ? 'auto' : containerHeight,
    bottom: pos === 'top' ? containerHeight : 'auto',
  };
};

const calcDropdownPosition = (rect: LayoutRectangle, windowHeight: number) => {
  const position = rect.y + requiredDropdownHeight < windowHeight ? Position.Bottom : Position.Top;

  return position;
};

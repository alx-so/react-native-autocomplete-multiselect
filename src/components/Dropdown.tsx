import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  useWindowDimensions,
  type LayoutRectangle,
} from 'react-native';
import { Position } from '../types/common';
import { composePartialTextNode } from '../common/composePartialTextNode';
import { MATCH_TAG_END, MATCH_TAG_START } from '../constants';

// TODO: make ajustable
const requiredDropdownHeight = 200;

export const Dropdown: DropdownComponent = (props) => {
  const deviceDimensions = useWindowDimensions();
  const position = calcDropdownPosition(props.containerRect, deviceDimensions.height);
  const containerStyle = getContainerStylePosition(position, props.containerRect.height);

  return (
    <View style={[styles.dropdown, containerStyle]}>
      <ScrollView>
        {props.items.map((item) => (
          <View key={item.id}>
            {composePartialTextNode(item.label, {
              matchedTextNodeStyle: { fontWeight: 'bold' },
              startStrPart: MATCH_TAG_START,
              endStrPart: MATCH_TAG_END,
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

interface Item {
  id: string | number;
  label: string;
}

interface DropdownProps {
  items: Item[];
  containerRect: LayoutRectangle;
}

type DropdownComponent = React.FC<DropdownProps>;

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
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

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
  useWindowDimensions,
  type LayoutRectangle,
} from 'react-native';
import { Position } from '../types/common';

const requiredDropdownHeight = 200;

export const Dropdown: DropdownComponent = (props) => {
  const deviceDimensions = useWindowDimensions();

  const position =
    props.containerRect.y + requiredDropdownHeight < deviceDimensions.height
      ? Position.Bottom
      : Position.Top;
  const containerStyle = getContainerStylePosition(position, props.containerRect.height);

  return (
    <View style={[styles.dropdown, containerStyle]}>
      <ScrollView>
        {props.items.map((item, index) => (
          <View key={index}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

interface DropdownProps {
  items: string[];
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

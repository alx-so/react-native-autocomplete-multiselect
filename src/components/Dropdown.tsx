import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ContainerDimensions } from 'react-native-autocomplete-multiselect';
import { Position } from '../types/common';

export const Dropdown: DropdownComponent = (props) => {
  const containerStyle = getContainerStylePosition(
    props.position || Position.Bottom,
    props.containerDimensions.height
  );

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
  position?: DropdownPosition;
  containerDimensions: ContainerDimensions;
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

import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutRectangle,
  type ScrollViewProps,
} from 'react-native';
import { type DropdownItem } from '../../types/common';
import React from 'react';
import { useContainerStyle } from './utils';

interface DropdownListProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items?: DropdownItem[];
  containerRect: LayoutRectangle;
  renderItem: (item: DropdownItem) => React.ReactNode;
  scrollViewProps?: ScrollViewProps;
}

// TODO: make ajustable via props
const maxDropdownHeight = 200;

export const DropdownList: React.FC<DropdownListProps> = (props) => {
  const items = props.items || [];
  const containerStyle = useContainerStyle(props.containerRect, maxDropdownHeight);

  return (
    <View style={[styles.dropdown, containerStyle]}>
      {props.header}
      <ScrollView style={styles.scrollView} {...props.scrollViewProps}>
        {items.map((item) => props.renderItem(item))}
      </ScrollView>
      {props.footer}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: maxDropdownHeight / 2,
  },
  dropdown: {
    width: '100%',
    position: 'absolute',
    zIndex: 9999999999999,
    backgroundColor: 'white',
    borderWidth: 1,
  },
});

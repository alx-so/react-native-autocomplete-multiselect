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
      <ScrollView style={styles.scrollView} {...props.scrollViewProps}>
        {items.map((item) => props.renderItem(item))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: maxDropdownHeight / 2,
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

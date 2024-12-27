import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { type ContainerRect, type DropdownItem } from '../../types/common';
import React from 'react';
import { useContainerStyle } from './utils';
import { getThemeStyles } from '../../styles/theme';

interface DropdownListProps {
  style?: ViewStyle;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items?: DropdownItem[];
  containerRect: ContainerRect;
  renderItem: (item: DropdownItem) => React.ReactNode;
  scrollViewProps?: ScrollViewProps;
}

// TODO: make ajustable via props
const maxDropdownHeight = 150;
const theme = getThemeStyles();

export const DropdownList: React.FC<DropdownListProps> = (props) => {
  const items = props.items || [];
  const containerStyle = useContainerStyle(props.containerRect, maxDropdownHeight);

  return (
    <View style={[styles.dropdown, containerStyle, props.style]}>
      {props.header}
      <ScrollView
        style={styles.scrollView}
        {...props.scrollViewProps}
        keyboardShouldPersistTaps="always"
      >
        {items.map((item) => props.renderItem(item))}
      </ScrollView>
      {props.footer}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: maxDropdownHeight,
    ...theme.dropdownScrollView,
  },
  dropdown: {
    minWidth: '100%',
    position: 'absolute',
    zIndex: 9999999999999,
    ...theme.dropdown,
  },
});

import type { ViewStyle } from 'react-native';
import type { DropdownItem } from '../../types/common';
import type { SelectValue } from './Select';

export const removeItemFromMultipleValue = (newValue: string, value: SelectValue) => {
  if (!Array.isArray(value)) {
    return value;
  }

  return (value as string[]).filter((v) => v !== newValue);
};

export const isItemSelected = (newValue: string, value: SelectValue) => {
  if (!Array.isArray(value)) {
    return value === newValue;
  }

  return value.includes(newValue);
};

export const composeSelectedDropdownItemStyle = (
  item: DropdownItem,
  value: SelectValue,
  selectedStyle: ViewStyle
): ViewStyle => {
  if (Array.isArray(value) && value.includes(item.label)) {
    return selectedStyle;
  }

  if (item.label === value) {
    return selectedStyle;
  }

  return {};
};

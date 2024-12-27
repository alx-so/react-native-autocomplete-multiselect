import { Alert } from 'react-native';
import type { TagItem } from '../../types/common';
import type { InputValue } from './Input';

export const composeValue = (value: InputValue | undefined, multiple?: boolean): string => {
  if (multiple || !value) {
    return '';
  }

  return value as string;
};

export const composeTags = (value?: InputValue): TagItem[] => {
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return [composeTagItem(value)];
  }

  return value.map((label) => composeTagItem(label));
};

export const composeTagItem = (label: string): TagItem => {
  return {
    id: new Date().getTime(),
    label,
  };
};

export const confirmTagRemoval = async (tag: TagItem | undefined) => {
  if (!tag) return;

  return new Promise((resolve) => {
    // TODO: localize the default alert message
    Alert.alert('Are you sure?', 'Do you want to the tag?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => resolve(false),
      },
      {
        text: 'OK',
        onPress: () => resolve(true),
      },
    ]);
  });
};

import type { LayoutRectangle } from 'react-native';

export const defaultLayloutRect: LayoutRectangle = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export const mergeSettings = <T>(defaultSettings: T, settings: T): T => {
  return { ...defaultSettings, ...settings };
};

export const getTestSearchItems = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'];

  return items;
};

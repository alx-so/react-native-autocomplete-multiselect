import type { LayoutRectangle } from 'react-native';
import type { Item } from './types/common';

export const defaultLayloutRect: LayoutRectangle = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export const mergeSettings = <T>(defaultSettings: T, settings: T): T => {
  return { ...defaultSettings, ...settings };
};

export const getTestSearchItems = (): Item[] => {
  const items = [
    {
      id: '1',
      label: 'Apple',
    },
    {
      id: '2',
      label: 'Banana',
    },
    {
      id: '3',
      label: 'Orange',
    },
    {
      id: '4',
      label: 'Pineapple',
    },
    {
      id: '5',
      label: 'Kiwi',
    },
    {
      id: '6',
      label: 'Strawberry',
    },
    {
      id: '7',
      label: 'Blueberry',
    },
    {
      id: '8',
      label: 'Raspberry',
    },
    {
      id: '9',
      label: 'Blackberry',
    },
    {
      id: '10',
      label: 'Mango',
    },
    {
      id: '11',
      label: 'Peach',
    },
    {
      id: '12',
      label: 'Plum',
    },
    {
      id: '13',
      label: 'Cherry',
    },
    {
      id: '14',
      label: 'Grape',
    },
    {
      id: '15',
      label: 'Watermelon',
    },
    {
      id: '16',
      label: 'Cantaloupe',
    },
    {
      id: '17',
      label: 'Honeydew',
    },
    {
      id: '18',
      label: 'Cool Apple',
    },
  ];

  return items;
};

import type { Settings } from './types/settings';

export const defaultSettings: Settings = {
  items: [],
  type: 'input',
  blurOnSubmit: true,
  isSelectSearchVisible: true,
  tagBackspaceDeleteBehavior: 'delete-modify',
  confirmTagDelete: false,
  showRemoveButton: true,
};

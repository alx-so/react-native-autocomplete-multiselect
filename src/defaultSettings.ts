import type { Settings } from './types/settings';

export const defaultSettings: Settings = {
  type: 'select',
  blurOnSubmit: true,
  isSelectSearchVisible: true,
  tagBackspaceDeleteBehavior: 'delete-modify',
  confirmTagDelete: false,
  showRemoveButton: true,
};

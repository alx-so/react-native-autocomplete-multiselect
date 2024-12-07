import type { Settings } from './types/settings';

export const defaultSettings: Settings = {
  type: 'input',
  blurOnSubmit: true,
  tagBackspaceDeleteBehavior: 'delete-modify',
  confirmTagDelete: false,
  showRemoveButton: true,
};

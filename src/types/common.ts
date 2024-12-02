export enum Position {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export interface TagItem {
  id: string | number;
  label: string;
  disabled?: boolean;
}

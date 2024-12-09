export enum Position {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export type PositionType = keyof typeof Position;

export interface TagItem {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export interface DropdownItem {
  id: string | number;
  label: string;
}

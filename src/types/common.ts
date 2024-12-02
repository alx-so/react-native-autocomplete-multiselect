export enum Position {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export interface ComponentDimensions {
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

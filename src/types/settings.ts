export interface ISettings {
  blurOnSubmit?: boolean;

  /**
   * The behavior tag deletion when the backspace key is pressed.
   *
   * - `delete`: Remove the last tag.
   * - `delete-modify`: Remove the last tag and set the input value to the removed tag.
   *
   * `default`: 'delete'
   */
  tagBackspaceDeleteBehavior?: 'delete' | 'delete-modify' | 'delete-con';
}

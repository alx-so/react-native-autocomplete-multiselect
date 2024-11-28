export interface ISettings {
  blurOnSubmit?: boolean;

  /**
   * The behavior tag deletion when the backspace key is pressed.
   *
   * - `delete`: Remove the last tag.
   * - `delete-modify`: Remove the last tag and set the input value to the removed tag.
   * - `delete-confirm`: Show a confirmation alert before deleting the last tag.
   *
   * `default`: 'delete'
   */
  tagBackspaceDeleteBehavior?: 'delete' | 'delete-modify' | 'delete-confirm';

  /**
   * TODO: provide a way to show a confirmation alert before deleting the last tag.
   * TODO: provide a way to customize the alert message and buttons.
   *
   * Use system alert to confirm tag deletion.
   */
  confirmTagDelete?: boolean;

  /**
   * TODO: provide a way to customize the remove button.
   *
   * Show a remove button(X) on each tag.
   */
  showRemoveButton?: boolean;
}

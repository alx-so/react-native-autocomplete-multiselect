import type { DropdownItem, TagItem } from './common';

/**
 * TODO: separate settings for input and select
 */
export interface Settings {
  /**
   * @default 'input'
   */
  type?: 'input' | 'input-select' | 'select' | 'select-multiple';

  /**
   * @default true
   */
  blurOnSubmit?: boolean;

  isSelectSearchVisible?: boolean;

  /**
   * The behavior tag deletion when the backspace key is pressed.
   *
   * - `delete`: Remove the last tag.
   * - `delete-modify`: Remove the last tag and set the input value to the removed tag.
   * - `delete-confirm`: Show a confirmation alert before deleting the last tag.
   *
   * @default 'delete'
   */
  tagBackspaceDeleteBehavior?: 'delete' | 'delete-modify' | 'delete-confirm';

  /**
   * TODO:
   * - if tags does not fit in 1 line, show [+{number}] button to indicate that there are more tags.
   * Button should show all tags
   * - if tags does not fit in 1 line, wrap tags to the next lines
   */
  wrapTags?: boolean;

  /**
   * TODO: require for all, except 'input'
   */
  items?: DropdownItem[];

  /**
   * TODO:
   * - on item select, remove from the dropdown list.
   * - on item select, highlight in the dropdown list, but do not remove it.
   * - provide way to customize selected item > use should be able to provide own component (checbox, etc)
   */
  itemSelectBehavior?: boolean;

  /**
   * TODO:
   * - footer with buttons: select all, clear
   */
  footerControls?: boolean;

  /**
   * TODO:
   * - autofocus the search on dropdown open
   */
  autoFocusSearch?: boolean;

  /**
   * TODO:
   * - reset search input after item select
   * @default false
   */
  resetSearchOnSelect?: boolean;

  /**
   * TODO: provide a way to show a confirmation alert before deleting the last tag.
   * TODO: provide a way to customize the alert message and buttons.
   *
   * Use system alert to confirm tag deletion.
   */
  confirmTagDelete?: boolean;

  /**
   * TODO: close dropdown on item select.
   */
  closeOnSuggestionSelect?: boolean;

  /**
   * TODO: provide a way to customize the remove button.
   *
   * Show a remove button(X) on each tag.
   */
  showRemoveButton?: boolean;

  /**
   * Initial list of items that will be display as tags in the input.
   */
  tags?: TagItem[];

  disabled?: boolean;
}

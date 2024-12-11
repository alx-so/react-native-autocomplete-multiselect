import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Tag, type TagRemoveIconProps } from './Tag';
import { TagListMemoized } from './TagList';
import type { Settings } from '../types/settings';
import type { TagItem } from '../types/common';
import ChevronIcon from './ChevronIcon';

const iconSize = 12;

export const Select: InputComponent = (props) => {
  const tagsList = props.tags ?? [];

  const removeTag = (tag: TagItem) => props.onTagRemove?.(tag);

  const handleTagRemoveIconPress = (tag: TagItem) => {
    removeTag(tag);
  };

  const handlePress = () => {
    props.onToggleDropdown?.(!props.isDropdownOpen);
  };

  const renderTag = useCallback(
    (tag: TagItem) => {
      const other: TagRemoveIconProps = props.showRemoveButton
        ? {
            isVisible: true,
            onPress: () => handleTagRemoveIconPress(tag),
          }
        : {};

      return (
        <Tag key={tag.id} removeIconProps={other} disabled={tag.disabled}>
          {tag.label}
        </Tag>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.showRemoveButton, tagsList]
  );

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <TagListMemoized tags={tagsList} render={renderTag} />
      <ChevronIcon
        rotation={props.isDropdownOpen ? 'Top' : 'Bottom'}
        size={iconSize}
        style={styles.chevron}
      />
    </Pressable>
  );
};

export const SelectMemoized = React.memo(Select);

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: iconSize * 1.75,
  },
  chevron: { position: 'absolute', right: 4, top: 18 },
});

interface InputProps extends Settings {
  isDropdownOpen?: boolean;
  onTagRemove?: (tag: TagItem) => void;
  onToggleDropdown?: (isOpen: boolean) => void;
}

type InputComponent = React.FC<InputProps>;

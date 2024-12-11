import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
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
    <View style={styles.container}>
      <TagListMemoized tags={tagsList} render={renderTag} />
      <ChevronIcon size={iconSize} style={styles.chevron} />
    </View>
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
  onTagRemove?: (tag: TagItem) => void;
}

type InputComponent = React.FC<InputProps>;

import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  // type NativeSyntheticEvent,
  // type TextInputKeyPressEventData,
  Alert,
} from 'react-native';
import { Tag, type TagRemoveIconProps } from './Tag';
import { TagListMemoized } from './TagList';
import type { Settings } from '../types/settings';
import type { TagItem } from '../types/common';
import ChevronIcon from './ChevronIcon';

export const Select: InputComponent = (props) => {
  const tagsList = props.tags ?? [];

  const removeTag = (tag: TagItem, index: number) => props.onTagRemove?.(tag, index);

  const handleTagRemoveIconPress = (tag: TagItem, index: number) => {
    if (props.confirmTagDelete) {
      return removeTagAfterConfirm(tag, index);
    }

    removeTag(tag, index);
  };

  const removeTagAfterConfirm = (tag: TagItem, index: number) => {
    const handlePress = () => removeTag(tag, index);

    // TODO: localize the default alert message
    Alert.alert('Are you sure?', 'Do you want to the tag?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: handlePress,
      },
    ]);
  };

  const renderTag = useCallback(
    (tag: TagItem, index: number) => {
      const other: TagRemoveIconProps = props.showRemoveButton
        ? {
            isVisible: true,
            onPress: () => handleTagRemoveIconPress(tag, index),
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
      <ChevronIcon size={12} style={styles.chevron} />
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
    paddingRight: 16,
  },
  chevron: { position: 'absolute', right: 4, top: 18 },
});

interface InputProps extends Settings {
  onTagRemove?: (tag: TagItem, index: number) => void;
}

type InputComponent = React.FC<InputProps>;

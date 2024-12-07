import React, { useCallback } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  Alert,
} from 'react-native';
import { Tag, type TagRemoveIconProps } from './Tag';
import { TagListMemoized } from './TagList';
import type { Settings } from '../types/settings';
import type { TagItem } from '../types/common';

export const Input: InputComponent = (props) => {
  const tagsList = props.tags ?? [];
  const inputRef = React.useRef<TextInput>(null);
  const [inputValue, setInputValue] = React.useState<string>('');
  const newTagBaseId = React.useId();

  const handleTextChange = (text: string) => {
    setInputValue(text);

    props.onTextChange?.(text);
  };

  const removeTag = (tag: TagItem, index: number) => props.onTagRemove?.(tag, index);

  const handleTagRemoveIconPress = (tag: TagItem, index: number) => {
    if (props.confirmTagDelete) {
      return removeTagAfterConfirm(tag, index);
    }

    removeTag(tag, index);
  };

  const handleKeyPress = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const _isPressedKeyBackspace = isPressedKeyBackspace(ev);
    if (_isPressedKeyBackspace) handleBackspacePress();
  };

  const handleSubmitEditing = () => {
    if (inputValue.length > 0) {
      const id = `${newTagBaseId}-${tagsList.length}`;
      const label = inputValue;

      // setInputTags([...tagsList, { id, label }]);
      props.onTagAdd?.({ id, label });
      setInputValue('');
    } else {
      inputRef.current?.blur();
    }
  };

  const handleBackspacePress = () => {
    const _isCurrentInputEmpty = isCurrentInputEmpty();

    if (_isCurrentInputEmpty) handleRemoveTag();
  };

  const isCurrentInputEmpty = () => inputValue.length === 0;

  const isPressedKeyBackspace = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = ev.nativeEvent.key;

    return key === 'Backspace';
  };

  const handleRemoveTag = () => {
    switch (props.tagBackspaceDeleteBehavior) {
      case 'delete':
        removeLastTag();
        break;
      case 'delete-modify':
        removeLastTagAndSetInputValue();
        break;
      case 'delete-confirm':
        removeTagAfterConfirm(tagsList[getLastTagIndex()] as TagItem, getLastTagIndex());
        break;
    }
  };

  const removeLastTag = () => {
    if (tagsList.length === 0) return;

    const newItems = tagsList.slice(0, -1);
    setInputTags(newItems);
  };

  const removeLastTagAndSetInputValue = () => {
    const lastTag = getLastTag();

    if (lastTag) {
      removeTag(lastTag, getLastTagIndex());
      setInputValue(lastTag.label);
    }
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

  const getLastTagIndex = () => tagsList.length - 1;

  const getLastTag = () => tagsList[getLastTagIndex()];

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

      <TextInput
        editable={!props.disabled}
        value={inputValue}
        submitBehavior={props.blurOnSubmit ? 'blurAndSubmit' : 'submit'}
        ref={inputRef}
        style={styles.input}
        onChangeText={handleTextChange}
        onKeyPress={handleKeyPress}
        onSubmitEditing={handleSubmitEditing}
      />
    </View>
  );
};

export const InputMemoized = React.memo(Input);

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
    padding: 4,
  },
  input: {
    height: 40,
    flexGrow: 1,
    // margin: 0,
    marginLeft: 3,
    padding: 4,
  },
});

interface InputProps extends Settings {
  onTextChange?: (text: string) => void;
  onTagRemove?: (tag: TagItem, index: number) => void;
  onTagAdd?: (tag: TagItem) => void;
}

type InputComponent = React.FC<InputProps>;

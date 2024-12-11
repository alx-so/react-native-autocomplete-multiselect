import React, { useCallback, useImperativeHandle } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
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

  useImperativeHandle(props.refObj, () => ({
    clear() {
      setInputValue('');
    },
    getValue() {
      return inputValue;
    },
  }));

  const handleTextChange = (text: string) => {
    setInputValue(text);

    props.onTextChange?.(text);
  };

  const removeTag = (tag: TagItem) => props.onTagRemove?.(tag);

  const handleTagRemoveIconPress = (tag: TagItem) => {
    removeTag(tag);
  };

  const handleKeyPress = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const _isPressedKeyBackspace = isPressedKeyBackspace(ev);
    if (_isPressedKeyBackspace) handleBackspacePress();
  };

  const handleSubmitEditing = () => {
    if (props.type === 'input-select') return;

    if (inputValue.length > 0) {
      const id = `${newTagBaseId}-${tagsList.length}`;
      const label = inputValue;

      props.onTagAdd?.({ id, label });
      setInputValue('');
    } else {
      inputRef.current?.blur();
    }
  };

  const handleBackspacePress = () => {
    const _isCurrentInputEmpty = isCurrentInputEmpty();

    if (_isCurrentInputEmpty) {
      if (props.tagBackspaceDeleteBehavior === 'delete-modify') {
        removeLastTagAndSetInputValue();
      } else {
        removeLastTag();
      }
    }
  };

  const isCurrentInputEmpty = () => inputValue.length === 0;

  const isPressedKeyBackspace = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = ev.nativeEvent.key;

    return key === 'Backspace';
  };

  const removeLastTag = () => {
    if (tagsList.length === 0) return;

    const lastTag = getLastTag();

    if (lastTag) {
      removeTag(lastTag);
    }
  };

  const removeLastTagAndSetInputValue = () => {
    const lastTag = getLastTag();

    if (lastTag) {
      removeTag(lastTag);
      setInputValue(lastTag.label);
    }
  };

  const getLastTagIndex = () => tagsList.length - 1;

  const getLastTag = () => tagsList[getLastTagIndex()];

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

      <TextInput
        returnKeyType="done"
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

export interface InputRef {
  clear: () => void;
  getValue: () => string;
}

interface InputProps extends Settings {
  refObj?: React.Ref<InputRef>;
  onTextChange?: (text: string) => void;
  onTagRemove?: (tag: TagItem) => void;
  onTagAdd?: (tag: TagItem) => void;
}

type InputComponent = React.FC<InputProps>;

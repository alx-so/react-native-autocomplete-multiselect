import React, { useCallback } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { Tag } from './Tag';
import { TagListMemoized } from './TagList';

export const Input: InputComponent = (props) => {
  const inputRef = React.useRef<TextInput>(null);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [tagsList, setInputValues] = React.useState<string[]>([]);

  const handleTextChange = (text: string) => {
    setInputValue(text);
  };

  const removeItem = (index: number) => {
    const newItems = tagsList.filter((_, i) => i !== index);
    setInputValues(newItems);
  };

  const handleItemPress = (index: number) => {
    removeItem(index);
  };

  const handleKeyPress = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const _isPressedKeyBackspace = isPressedKeyBackspace(ev);
    if (_isPressedKeyBackspace) handleBackspacePress();
  };

  const handleSubmitEditing = () => {
    if (inputValue.length > 0) {
      setInputValues([...tagsList, inputValue]);
      setInputValue('');
    } else {
      inputRef.current?.blur();
    }
  };

  const handleBackspacePress = () => {
    const _isCurrentInputEmpty = isCurrentInputEmpty();

    if (_isCurrentInputEmpty) {
      removeLastTagAndSetInputValue();
    }
  };

  const isCurrentInputEmpty = () => inputValue.length === 0;

  const isPressedKeyBackspace = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = ev.nativeEvent.key;

    return key === 'Backspace';
  };

  const removeLastTag = () => {
    if (tagsList.length === 0) return;

    const newItems = tagsList.slice(0, -1);
    setInputValues(newItems);
  };

  const removeLastTagAndSetInputValue = () => {
    const lastItem = tagsList[tagsList.length - 1];
    removeLastTag();

    if (lastItem) {
      setInputValue(lastItem);
    }
  };

  const renderTag = useCallback(
    (tag: string, index: number) => {
      return (
        <Tag
          key={index}
          isRemoveIconVisible
          removeIconProps={{
            onPress: () => handleItemPress(index),
          }}
        >
          {tag}
        </Tag>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tagsList]
  );

  return (
    <View style={styles.container}>
      <TagListMemoized tags={tagsList} render={renderTag} />

      <TextInput
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

const styles = StyleSheet.create({
  container: {
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
    flexGrow: 1,
    // margin: 0,
    marginLeft: 3,
    padding: 0,
  },
  item: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    margin: 2,
    borderWidth: 1,
    borderColor: 'black',
    color: 'red',
  },
});

interface InputProps {
  blurOnSubmit?: boolean;
}

type InputComponent = React.FC<InputProps>;

import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
  type TextInputKeyPressEventData,
} from 'react-native';
import { Tag } from './Tag';

export const AutoCompleteInput: AutoCompleteInputComponent = (props) => {
  const inputRef = React.useRef<TextInput>(null);
  const prevInputValue = React.useRef<string>('');
  const inputValue = React.useRef<string>('');
  const [inputValuesList, setInputValues] = React.useState<string[]>([]);

  const handleTextChange = (ev: NativeSyntheticEvent<TextInputChangeEventData>) => {
    inputValue.current = ev.nativeEvent.text;
  };

  const removeItem = (index: number) => {
    const newItems = inputValuesList.filter((_, i) => i !== index);
    setInputValues(newItems);
  };

  const handleItemPress = (index: number) => {
    removeItem(index);
  };

  const handleKeyPress = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const canRemoveLastItem =
      isPressedKeyBackspace(ev) && isPrevInputEmpty() && isCurrentInputEmpty();

    if (canRemoveLastItem) {
      removeLastItem();
    }

    prevInputValue.current = inputValue.current;
  };

  const handleSubmitEditing = () => {
    if (inputValue.current.length > 0) {
      setInputValues([...inputValuesList, inputValue.current]);
      inputValue.current = '';
      prevInputValue.current = '';
      inputRef.current?.clear();
    } else {
      inputRef.current?.blur();
    }
  };

  const isPrevInputEmpty = () => prevInputValue.current.length === 0;

  const isCurrentInputEmpty = () => inputValue.current.length === 0;

  const isPressedKeyBackspace = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = ev.nativeEvent.key;

    return key === 'Backspace';
  };

  const removeLastItem = () => {
    if (inputValuesList.length === 0) return;

    const lastItem = inputValuesList[inputValuesList.length - 1];

    const newItems = inputValuesList.slice(0, -1);
    setInputValues(newItems);

    if (lastItem) {
      setCurretInputValue(lastItem);
    }
  };

  const setCurretInputValue = (value: string) => {
    console.log('setCurretInputValue', value);
    inputValue.current = value;
  };

  console.log('inputValue.current', inputValue.current);

  return (
    <View style={styles.container}>
      {inputValuesList.map((item, index) => (
        <Tag
          key={index}
          isRemoveIconVisible
          removeIconProps={{
            onPress: () => handleItemPress(index),
          }}
        >
          {item}
        </Tag>
      ))}

      <TextInput
        submitBehavior={props.blurOnSubmit ? 'blurAndSubmit' : 'submit'}
        ref={inputRef}
        style={styles.input}
        onChange={handleTextChange}
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

interface AutoCompleteInputProps {
  blurOnSubmit?: boolean;
}

type AutoCompleteInputComponent = React.FC<AutoCompleteInputProps>;

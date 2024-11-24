import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
  Pressable,
  type TextInputKeyPressEventData,
} from 'react-native';

export const AutoCompleteInput: AutoCompleteInputComponent = (props) => {
  const inputRef = React.useRef<TextInput>(null);
  const prevInputValue = React.useRef<string>('');
  const inputValue = React.useRef<string>('');
  const [inputValuesList, setInputValues] = React.useState<string[]>([]);

  const handleTextChange = (
    ev: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    inputValue.current = ev.nativeEvent.text;
  };

  const removeItem = (index: number) => {
    const newItems = inputValuesList.filter((_, i) => i !== index);
    setInputValues(newItems);
  };

  const handleItemPress = (index: number) => {
    removeItem(index);
  };

  const handleKeyPress = (
    ev: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (
      ev.nativeEvent.key === 'Backspace' &&
      prevInputValue.current.length === 0 &&
      inputValuesList.length > 0
    ) {
      const newItems = inputValuesList.slice(0, -1);
      setInputValues(newItems);
    }

    prevInputValue.current = inputValue.current;
  };

  const handleSubmitEditing = () => {
    if (inputValue.current.length > 0) {
      setInputValues([...inputValuesList, inputValue.current]);
      inputValue.current = '';
      prevInputValue.current = '';
      inputRef.current?.clear();
    }
  };

  return (
    <View style={styles.container}>
      {inputValuesList.map((item, index) => (
        <Pressable key={index} onPress={() => handleItemPress(index)}>
          <Text style={styles.item}>{item}</Text>
        </Pressable>
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

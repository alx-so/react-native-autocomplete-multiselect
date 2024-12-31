import React from 'react';
import { useImperativeHandle } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import CrossIcon from '../icons/CrossIcon';
import SearchIcon from '../icons/SearchIcon';
import { getThemeColors } from '../../styles/theme';

export interface SelectSearchInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
}

interface SelectSearchInputProps {
  refObj?: React.RefObject<SelectSearchInputRef>;
  onChange: (value: string) => void;
}

const theme = getThemeColors();

export const SelectSearchInput: React.FC<SelectSearchInputProps> = (props) => {
  const inputRef = React.useRef<TextInput>(null);
  const currentText = React.useRef<string>('');

  useImperativeHandle(props.refObj, () => ({
    focus() {
      inputRef.current?.focus();
    },
    blur() {
      inputRef.current?.blur();
    },
    clear() {
      handleClear();
    },
    getValue() {
      return currentText.current;
    },
  }));

  const handleTextChange = (text: string) => {
    props.onChange(text);

    currentText.current = text;
  };

  const handleClear = () => {
    inputRef.current?.clear();
    props.onChange('');
    currentText.current = '';
  };

  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput
        style={styles.textInput}
        ref={inputRef}
        placeholder="Search"
        onChangeText={handleTextChange}
        numberOfLines={1}
      />
      <CrossIcon onPress={handleClear} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  crossIcon: {
    position: 'absolute',
    right: 14,
  },
});

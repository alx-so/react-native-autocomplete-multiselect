import React from 'react';
import { useImperativeHandle } from 'react';
import { TextInput } from 'react-native';

export interface SelectSearchInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

interface SelectSearchInputProps {
  refObj?: React.RefObject<SelectSearchInputRef>;
  onChange: (value: string) => void;
}

export const SelectSearchInput: React.FC<SelectSearchInputProps> = (props) => {
  const inputRef = React.useRef<TextInput>(null);

  useImperativeHandle(props.refObj, () => ({
    focus() {
      inputRef.current?.focus();
    },
    blur() {
      inputRef.current?.blur();
    },
    clear() {
      inputRef.current?.clear();
    },
  }));

  const handleTextChange = (text: string) => {
    props.onChange(text);
  };

  return <TextInput ref={inputRef} placeholder="Search" onChangeText={handleTextChange} />;
};

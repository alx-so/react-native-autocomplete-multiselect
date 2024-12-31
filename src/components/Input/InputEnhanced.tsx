import React from 'react';
import { Input, type InputProps, type InputRefObject, type InputValue } from './Input';
import { DropdownNotice } from '../DropdownList/DropdownNotice';

export const InputEnhanced: React.FC<InputProps> = (props) => {
  const [endNode, setEndNode] = React.useState<React.ReactNode | null>(null);
  const inputRef = React.useRef<InputRefObject>(null);
  const valueRef = React.useRef<InputValue>(props.value || '');
  const handleNoticePress = () => {
    inputRef.current?.addTag({
      id: new Date().getTime(),
      label: valueRef.current as string,
    });
    inputRef.current?.clear();

    setEndNode(null);
  };

  const handleInputValueChange = (value: InputValue) => {
    valueRef.current = value;

    if (props.onChange) {
      props.onChange(value);
    }

    if (props.multiple) {
      if (value) {
        setEndNode(
          <DropdownNotice type="add-tag" label={value as string} onPress={handleNoticePress} />
        );

        return;
      }

      if (endNode) {
        setEndNode(null);
      }
    }
  };

  return (
    <Input {...props} onChange={handleInputValueChange} refObject={inputRef} endNode={endNode} />
  );
};

import React from 'react';
import { Input, type InputProps, type InputValue } from './Input';
import { AddTagDropdownNotice } from '../DropdownList/AddTagDropdownNotice';

export const InputEnchanced: React.FC<InputProps> = (props) => {
  const [endNode, setEndNode] = React.useState<React.ReactNode | null>(null);

  const handleInputValueChange = (value: InputValue) => {
    if (props.onChange) {
      props.onChange(value);
    }

    if (props.multiple) {
      if (value) {
        setEndNode(<AddTagDropdownNotice notice={value as string} />);

        return;
      }

      if (endNode) {
        setEndNode(null);
      }
    }
  };

  return <Input {...props} onChange={handleInputValueChange} endNode={endNode} />;
};

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ChevronIcon from './ChevronIcon';

const iconSize = 12;

export const Select: SelectComponent = (props) => {
  const [value, setValue] = React.useState<string | string[]>(props.value || '');

  const handlePress = () => {
    if (props.disabled) return;

    if (props.open) {
      props.onClose?.();
    } else {
      props.onOpen?.();
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <ChevronIcon
        onPress={handlePress}
        rotation={props.open ? 'Top' : 'Bottom'}
        size={iconSize}
        style={styles.chevron}
      />
    </Pressable>
  );
};

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
    paddingRight: iconSize * 1.75,
  },
  chevron: { position: 'absolute', right: 4, top: 18 },
});

interface SelectProps {
  disabled?: boolean;
  multiple?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  renderValue?: (value: string) => React.ReactNode;
  testID?: string;
  value?: string | string[];
  icon?: React.ReactNode;
}

type SelectComponent = React.FC<SelectProps>;

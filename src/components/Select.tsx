import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, type LayoutRectangle } from 'react-native';
import ChevronIcon from './ChevronIcon';
import { DropdownList } from './DropdownList';
import { defaultLayloutRect, getTestSearchItems } from '../utils';
import { composePartialTextNode } from '../common/composePartialTextNode';
import { MATCH_TAG_END, MATCH_TAG_START } from '../constants';

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

const iconSize = 12;

export const Select: React.FC<SelectProps> = (props) => {
  const [isOpen, setIsOpen] = React.useState(props.open);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [value, setValue] = React.useState<string | string[]>(props.value || '');

  useEffect(() => {
    setIsOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    if (isOpen) {
      props.onOpen?.();
    } else {
      props.onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    props.onChange?.(value);
  }, [value]);

  const handlePress = () => {
    if (props.disabled) return;

    setIsOpen(!isOpen);
  };

  const handleItemPress = (item: string) => {
    setValue(item);
  };

  return (
    <View style={styles.container} onLayout={(e) => setContainerRect(e.nativeEvent.layout)}>
      <Pressable onPress={handlePress} style={styles.select}>
        <ChevronIcon
          onPress={handlePress}
          rotation={isOpen ? 'Top' : 'Bottom'}
          size={iconSize}
          style={styles.chevron}
        />
      </Pressable>

      {isOpen && (
        <DropdownList
          containerRect={containerRect}
          items={getTestSearchItems()}
          renderItem={(item) => (
            <Pressable
              key={item.id}
              onPress={() => handleItemPress(item.label)}
              style={styles.suggestionItem}
            >
              {composePartialTextNode(item.label, {
                matchedTextNodeStyle: { fontWeight: 'bold' },
                startStrPart: MATCH_TAG_START,
                endStrPart: MATCH_TAG_END,
              })}
            </Pressable>
          )}
        />
      )}
    </View>
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
  },
  select: {
    width: '100%',
    height: '100%',
  },
  chevron: { position: 'absolute', right: 4, top: 18 },
  suggestionItem: {
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },
});

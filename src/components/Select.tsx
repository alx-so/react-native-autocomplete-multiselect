import React from 'react';
import { Pressable, StyleSheet, View, type LayoutRectangle } from 'react-native';
import ChevronIcon from './ChevronIcon';
import { DropdownList } from './DropdownList';
import { defaultLayloutRect, getTestSearchItems } from '../utils';
import { composePartialTextNode } from '../common/composePartialTextNode';
import { MATCH_TAG_END, MATCH_TAG_START } from '../constants';

const iconSize = 12;

export const Select: SelectComponent = (props) => {
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [value, setValue] = React.useState<string | string[]>(props.value || '');

  const handlePress = () => {
    if (props.disabled) return;

    if (props.open) {
      props.onClose?.();
    } else {
      props.onOpen?.();
    }
  };

  const handleItemPress = (item: string) => {
    setValue(item);
    props.onChange?.(item);
  };

  return (
    <View style={styles.container} onLayout={(e) => setContainerRect(e.nativeEvent.layout)}>
      <Pressable onPress={handlePress} style={styles.select}>
        <ChevronIcon
          onPress={handlePress}
          rotation={props.open ? 'Top' : 'Bottom'}
          size={iconSize}
          style={styles.chevron}
        />
      </Pressable>

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
  },
  chevron: { position: 'absolute', right: 4, top: 18 },
  suggestionItem: {
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },
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

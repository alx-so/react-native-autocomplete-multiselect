import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutRectangle } from 'react-native';
import ChevronIcon from './ChevronIcon';
import { DropdownList } from './DropdownList';
import { defaultLayloutRect, getTestSearchItems } from '../utils';
import { composePartialTextNode } from '../common/composePartialTextNode';
import { MATCH_TAG_END, MATCH_TAG_START } from '../constants';

type SelectValue = string | string[];

interface SelectProps {
  closeOnSelect?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (value: SelectValue) => void;
  placeholder?: string;
  renderValue?: (value: SelectValue) => React.ReactNode;
  testID?: string;
  value?: SelectValue;
  icon?: React.ReactNode;
}

const iconSize = 12;

export const Select: React.FC<SelectProps> = (props) => {
  const [isOpen, setIsOpen] = React.useState(props.open);
  const [containerRect, setContainerRect] = React.useState<LayoutRectangle>(defaultLayloutRect);
  const [value, setValue] = React.useState<SelectValue>(props.value || '');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handlePress = () => {
    if (props.disabled) return;

    setIsOpen(!isOpen);
  };

  const handleItemPress = (item: string) => {
    if (props.multiple) {
      setValue([...(value as string[]), item]);
    } else {
      setValue(item);
    }

    if (props.closeOnSelect) {
      setIsOpen(false);
    }
  };

  const renderValue = () => {
    if (props.renderValue) {
      return props.renderValue(value);
    }

    return (
      <Text style={styles.selectValueText} ellipsizeMode="tail" numberOfLines={1}>
        {value}
      </Text>
    );
  };

  const renderMultipleValues = () => {
    if (!Array.isArray(value)) {
      return null;
    }

    if (props.renderValue) {
      return props.renderValue(value);
    }

    return (
      <Text style={styles.selectValueText} ellipsizeMode="tail" numberOfLines={1}>
        {value.join(',')}
      </Text>
    );
  };

  return (
    <View style={styles.container} onLayout={(e) => setContainerRect(e.nativeEvent.layout)}>
      <View style={[styles.selectValue, { maxWidth: containerRect.width - iconSize * 2 }]}>
        {!props.multiple ? renderValue() : renderMultipleValues()}
      </View>

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
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
  selectValue: {
    height: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  selectValueText: {
    verticalAlign: 'middle',
  },
  chevron: {
    position: 'absolute',
    zIndex: -1,
    right: 4,
    top: 18,
  },
  suggestionItem: {
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },
});

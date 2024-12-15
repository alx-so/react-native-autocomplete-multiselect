import React, { useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import type { TagItem } from '../../types/common';
import { TagListMemoized } from '../TagList';
import { Tag } from '../Tag';

type InputValue = string | string[];

interface InputProps {
  multiple?: boolean;
  value?: InputValue;
  onInputChange?: (value: InputValue) => void;
  onRenderTag?: (tag: TagItem) => React.ReactNode;
  tagProps?: {
    showRemoveButton?: boolean;
    removeMode?: 'delete' | 'delete-modify' | 'delete-confirm';
  };
}

export const Input: React.FC<InputProps> = (props) => {
  const [value, setValue] = React.useState(composeInitialValue(props.value, props.multiple));
  const [tags, setTags] = React.useState<TagItem[]>(props.multiple ? composeTags(props.value) : []);
  const tagRemoveMode = props.tagProps?.removeMode || 'delete';

  useEffect(() => {
    props.onInputChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleTextChange = (text: string) => {
    setValue(text);
  };

  const handleSubmitEditing = () => {
    if (props.multiple) {
      const tag = composeTagItem(value as string);
      setTags([...tags, tag]);
      setValue('');
    }
  };

  const handleBackspacePress = () => {
    const _isCurrentInputEmpty = isCurrentInputEmpty();

    if (_isCurrentInputEmpty) {
      if (props.tagProps?.removeMode === 'delete-modify') {
        removeLastTagAndSetInputValue();
      } else {
        removeLastTag();
      }
    }
  };

  const handleKeyPress = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const _isPressedKeyBackspace = isPressedKeyBackspace(ev);
    if (_isPressedKeyBackspace) handleBackspacePress();
  };

  const renderTag = (tag: TagItem) => {
    if (props.onRenderTag) {
      return props.onRenderTag(tag);
    }

    return (
      <Tag
        key={tag.id}
        removeIconProps={{
          isVisible: props.tagProps?.showRemoveButton,
          onPress: () => removeTag(tag),
        }}
        disabled={tag.disabled}
      >
        {tag.label}
      </Tag>
    );
  };

  const removeLastTag = () => {
    if (tags.length === 0) return;

    const lastTag = getLastTag();

    if (lastTag) {
      removeTag(lastTag);
    }
  };

  const removeLastTagAndSetInputValue = () => {
    const lastTag = getLastTag();

    if (lastTag) {
      removeTag(lastTag);
      setValue(lastTag.label);
    }
  };

  const getLastTagIndex = () => tags.length - 1;

  const getLastTag = () => tags[getLastTagIndex()];

  const isCurrentInputEmpty = () => value.length === 0;

  const isPressedKeyBackspace = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = ev.nativeEvent.key;

    return key === 'Backspace';
  };

  const removeTag = async (tag: TagItem) => {
    const shouldConfirmTagRemoval = tagRemoveMode === 'delete-confirm';
    const shouldRemoveTag = shouldConfirmTagRemoval ? await confirmTagRemoval(tag) : true;

    if (!shouldRemoveTag) return;

    setTags((prevTags) => prevTags.filter((t) => t.id !== tag.id));
  };

  return (
    <View style={styles.container}>
      {props.multiple && <TagListMemoized tags={tags} render={renderTag} />}

      <TextInput
        value={value}
        style={styles.input}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSubmitEditing}
        onKeyPress={handleKeyPress}
      />
    </View>
  );
};

const composeInitialValue = (value: InputValue | undefined, multiple?: boolean): string => {
  if (multiple || !value) {
    return '';
  }

  return value as string;
};

const composeTags = (value?: InputValue): TagItem[] => {
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return [composeTagItem(value)];
  }

  return value.map((label) => composeTagItem(label));
};

const composeTagItem = (label: string): TagItem => {
  return {
    id: label,
    label,
  };
};

const confirmTagRemoval = async (tag: TagItem | undefined) => {
  if (!tag) return;

  return new Promise((resolve) => {
    // TODO: localize the default alert message
    Alert.alert('Are you sure?', 'Do you want to the tag?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => resolve(false),
      },
      {
        text: 'OK',
        onPress: () => resolve(true),
      },
    ]);
  });
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    minHeight: 54,
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
    height: 40,
    flexGrow: 1,
    // margin: 0,
    marginLeft: 3,
    padding: 4,
  },
});

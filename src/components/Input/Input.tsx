import React, { useEffect, useImperativeHandle } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type ViewStyle,
} from 'react-native';
import type { TagItem } from '../../types/common';
import { TagListMemoized } from '../Tag/TagList';
import { Tag } from '../Tag/Tag';

export type InputValue = string | string[];

export interface InputRefObject {
  focus: () => void;
  blur: () => void;
  setTags: (tags: TagItem[]) => void;
}

export interface InputProps {
  refObject?: React.RefObject<InputRefObject>;
  containerStyle?: ViewStyle;
  multiple?: boolean;
  value?: InputValue;
  defaultValue?: InputValue;
  onContainerLayoutChange?: (e: LayoutChangeEvent) => void;
  onChange?: (value: InputValue) => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  onBlur?: () => void;
  startNode?: React.ReactNode;
  endNode?: React.ReactNode;
  tagProps?: {
    onChange?: (tags: TagItem[]) => void;
    onRender?: (tag: TagItem) => React.ReactNode;
    showRemoveButton?: boolean;
    removeMode?: 'delete' | 'delete-modify' | 'delete-confirm';
  };
}

export const Input: React.FC<InputProps> = (props) => {
  const isControlledComponent = typeof props.value !== 'undefined';
  const inputDefaultValue = isControlledComponent ? props.value : props.defaultValue;
  const tagsDefaultValue = props.multiple ? composeTags(inputDefaultValue) : [];
  const tagRemoveMode = props.tagProps?.removeMode || 'delete';

  const inputRef = React.useRef<TextInput>(null);
  const [value, setValue] = React.useState(composeValue(inputDefaultValue, props.multiple));
  const [tags, setTags] = React.useState<TagItem[]>(tagsDefaultValue);

  useImperativeHandle(props.refObject, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    setTags: (tagsList) => setTags(tagsList),
  }));

  useEffect(() => {
    if (!isControlledComponent) return;

    setValue(props.value as string);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  useEffect(() => {
    props.tagProps?.onChange?.(tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  useEffect(() => {
    if (isControlledComponent) return;

    props.onChange?.(value);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleTextChange = (text: string) => {
    if (isControlledComponent) {
      props.onChange?.(text);
      return;
    }

    setValue(text);
  };

  const handleSubmitEditing = () => {
    if (props.onSubmitEditing) props.onSubmitEditing();

    if (!value || props.onSubmitEditing) return;

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

  const handleFocus = () => {
    props.onFocus?.();
  };

  const handleBlur = () => {
    props.onBlur?.();
  };

  const renderTag = (tag: TagItem) => {
    if (props.tagProps?.onRender) {
      return props.tagProps?.onRender(tag);
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
    <View style={[styles.container, props.containerStyle]} onLayout={props.onContainerLayoutChange}>
      {props.startNode && props.startNode}

      <View style={styles.innerContainer}>
        {props.multiple && <TagListMemoized tags={tags} render={renderTag} />}

        <TextInput
          ref={inputRef}
          value={value}
          style={styles.input}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmitEditing}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>

      {props.endNode && props.endNode}
    </View>
  );
};

const composeValue = (value: InputValue | undefined, multiple?: boolean): string => {
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
    id: new Date().getTime(),
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
    width: '100%',
    height: 'auto',
    borderColor: 'black',
    borderWidth: 1,
  },
  innerContainer: {
    padding: 4,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  input: {
    height: 40,
    flexGrow: 1,
    // margin: 0,
    marginLeft: 3,
    padding: 4,
  },
});

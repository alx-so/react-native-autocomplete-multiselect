import React, { useEffect, useImperativeHandle } from 'react';
import {
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
import { composeTagItem, composeTags, composeValue, confirmTagRemoval } from './utils';
import { getThemeStyles } from '../../styles/theme';

export type InputValue = string | string[];

export interface InputRefObject {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setTags: (tags: TagItem[]) => void;
  addTag: (tag: TagItem) => void;
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

const theme = getThemeStyles();

export const Input: React.FC<InputProps> = (props) => {
  const isControlledComponent = typeof props.value !== 'undefined';
  const inputDefaultValue = isControlledComponent ? props.value : props.defaultValue;
  const tagsDefaultValue = props.multiple ? composeTags(inputDefaultValue) : [];
  const tagRemoveMode = props.tagProps?.removeMode || 'delete';

  const inputRef = React.useRef<TextInput>(null);
  const [value, setValue] = React.useState(composeValue(inputDefaultValue, props.multiple));
  const [tags, setTags] = React.useState<TagItem[]>(tagsDefaultValue);
  const [inputThemeStyle, setInputThemeStyles] = React.useState<ViewStyle>(
    theme.inputOuterContainer
  );
  const currentInputValue = isControlledComponent ? (props.value as string) : value;

  useImperativeHandle(props.refObject, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    setTags: (tagsList) => setTags(tagsList),
    addTag: (tag) => {
      const newTags = [...tags, tag];

      setTags(newTags);
    },
    clear: () => {
      setValue('');
    },
  }));

  // useEffect(() => {
  //   if (!isControlledComponent) return;

  //   setValue(props.value as string);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.value]);

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
    setInputThemeStyles({
      ...theme.inputOuterContainer,
      ...theme.inputFocused,
    });
  };

  const handleBlur = () => {
    props.onBlur?.();
    setInputThemeStyles(theme.inputOuterContainer);
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

  const isCurrentInputEmpty = () => !currentInputValue || currentInputValue.length === 0;

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
    <View
      style={[styles.container, props.containerStyle, inputThemeStyle]}
      onLayout={props.onContainerLayoutChange}
    >
      {props.startNode && props.startNode}

      <View style={styles.innerContainer}>
        {props.multiple && <TagListMemoized tags={tags} render={renderTag} />}

        <TextInput
          ref={inputRef}
          value={currentInputValue}
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

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    width: '100%',
    height: 'auto',
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
    ...theme.input,
  },
});

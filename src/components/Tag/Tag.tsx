import { Pressable, StyleSheet, Text } from 'react-native';
import CrossIcon from '../icons/CrossIcon';
import React from 'react';

export const Tag: TagComponent = (props) => {
  const isChildrenString =
    !React.isValidElement(props.children) && typeof props.children === 'string';

  const isRemoveIconLeft = props.removeIconProps?.position === 'left';

  const tagStyles = [
    styles.tag,
    props.removeIconProps?.isVisible && styles.tagWithRemoveIcon,
    isRemoveIconLeft && styles.tagWithRemoveIconOnLeft,
    props.disabled && { opacity: 0.5 },
  ];

  const removeIconStyles = isRemoveIconLeft ? styles.removeIconLeft : styles.removeIconRight;

  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={tagStyles}
      testID={props.testID}
    >
      {isChildrenString ? <Text>{props.children}</Text> : <>{props.children}</>}

      {props.removeIconProps?.isVisible && (
        <CrossIcon {...props.removeIconProps} styles={removeIconStyles} disabled={props.disabled} />
      )}
    </Pressable>
  );
};

export interface TagProps {
  testID?: string;
  disabled?: boolean;
  removeIconProps?: TagRemoveIconProps;
  children: React.ReactNode;
  onPress?: () => void;
}

export interface TagRemoveIconProps {
  isVisible?: boolean;
  position?: 'left' | 'right';
  size?: number;
  onPress?: () => void;
}

type TagComponent = React.FC<TagProps>;

const styles = StyleSheet.create({
  tag: {
    height: 40,
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
  },
  tagWithRemoveIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagWithRemoveIconOnLeft: {
    flexDirection: 'row-reverse',
  },
  removeIconLeft: {
    marginRight: 8,
  },
  removeIconRight: {
    marginLeft: 8,
  },
});

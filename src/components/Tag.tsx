import { Pressable, StyleSheet, Text } from 'react-native';
import CrossIcon from './CrossIcon';
import React from 'react';

export const Tag: TagComponent = (props) => {
  const isChildrenString =
    !React.isValidElement(props.children) && typeof props.children === 'string';

  const isRemoveIconLeft = props.removeIconProps?.position === 'left';

  const tagStyles = [
    styles.tag,
    props.removeIconProps?.isVisible && styles.tagWithRemoveIcon,
    isRemoveIconLeft && styles.tagWithRemoveIconOnLeft,
  ];

  const removeIconStyles = isRemoveIconLeft ? styles.removeIconLeft : styles.removeIconRight;

  return (
    <Pressable onPress={props.onPress} style={tagStyles} testID={props.testID}>
      {isChildrenString ? <Text>{props.children}</Text> : <>{props.children}</>}

      {props.removeIconProps?.isVisible && (
        <CrossIcon {...props.removeIconProps} styles={removeIconStyles} />
      )}
    </Pressable>
  );
};

export interface TagProps {
  testID?: string;
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

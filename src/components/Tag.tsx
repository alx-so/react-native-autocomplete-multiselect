import { Pressable, StyleSheet, Text } from 'react-native';
import CrossIcon from './CrossIcon';
import React from 'react';

export const Tag: TagComponent = (props) => {
  const isChildrenString =
    !React.isValidElement(props.children) && typeof props.children === 'string';

  const isRemoveIconLeft = props.removeIconProps?.position === 'left';

  const tagStyles = [
    styles.tag,
    props.isRemoveIconVisible && styles.tagWithRemoveIcon,
    isRemoveIconLeft && styles.tagWithRemoveIconOnLeft,
  ];

  const removeIconStyles = isRemoveIconLeft ? styles.removeIconLeft : styles.removeIconRight;

  return (
    <Pressable onPress={props.onPress} style={tagStyles} testID={props.testID}>
      {isChildrenString ? <Text>{props.children}</Text> : <>{props.children}</>}

      {props.isRemoveIconVisible && (
        <CrossIcon {...props.removeIconProps} styles={removeIconStyles} />
      )}
    </Pressable>
  );
};

interface TagProps {
  testID?: string;
  isRemoveIconVisible?: boolean;
  removeIconProps?: RemoveIconProps;
  children: React.ReactNode;
  onPress?: () => void;
}

interface RemoveIconProps {
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

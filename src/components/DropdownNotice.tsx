import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';
import { AddTagDropdownNotice } from './AddTagDropdownNotice';

interface DropdownNoticeProps extends PressableProps {
  label: string;
  type: DropdownNoticeType;
  onNoticePress?: (type: DropdownNoticeType) => void;
}

export interface DropdownNoticeOpts {
  label: string;
  type: DropdownNoticeType;
}

export type DropdownNoticeType = 'info' | 'error' | 'add-tag';

export const DropdownNotice: React.FC<DropdownNoticeProps> = (props) => {
  if (!props.label || !props.type) {
    return null;
  }

  const handlePress = (e: GestureResponderEvent) => {
    if (props.type === 'add-tag') {
      props.onNoticePress?.(props.type);
    }

    props.onPress?.(e);
  };

  const Component =
    props.type === 'add-tag' ? (
      <AddTagDropdownNotice notice={props.label} />
    ) : (
      <Text>{props.label}</Text>
    );

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {Component}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    borderWidth: 1,
    zIndex: 9999999999,
  },
});

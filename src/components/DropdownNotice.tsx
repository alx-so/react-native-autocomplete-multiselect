import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';
import { AddTagDropdownNotice } from './AddTagDropdownNotice';

export const DropdownNotice: DropdownNoticeComponent = (props) => {
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

interface DropdownNoticeProps extends PressableProps {
  label?: string;
  type?: DropdownNoticeType;
  onNoticePress?: (type: DropdownNoticeType) => void;
}

export interface DropdownNoticeOpts {
  label: string;
  type: DropdownNoticeType;
}

type DropdownNoticeComponent = React.FC<DropdownNoticeProps>;

export type DropdownNoticeType = 'info' | 'error' | 'add-tag';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

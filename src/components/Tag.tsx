import { Pressable, StyleSheet, Text } from 'react-native';

export const Tag: TagComponent = (props) => {
  return (
    <Pressable onPress={props.onPress} style={styles.tag}>
      <Text style={styles.tagText}>{props.children}</Text>
    </Pressable>
  );
};

interface TagProps {
  children: React.ReactNode;
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
  tagText: {
    color: '#333',
  },
});

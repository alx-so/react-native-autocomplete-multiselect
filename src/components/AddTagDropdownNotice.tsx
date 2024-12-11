import { StyleSheet, Text } from 'react-native';

export const AddTagDropdownNotice = (props: { notice: string }) => {
  return (
    <>
      <Text style={styles.noticeLeftText}>Tap to Add:</Text>
      <Text style={styles.noticeText}>{props.notice}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  noticeLeftText: {
    marginRight: 2,
  },
  noticeText: {
    fontWeight: 'bold',
  },
});

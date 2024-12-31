import { StyleSheet, Text, View } from 'react-native';

export const AddTagDropdownNotice = (props: { notice: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.noticeLeftText}>Tap to Add:</Text>
      <Text style={styles.noticeText}>{props.notice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  noticeLeftText: {
    marginRight: 2,
  },
  noticeText: {
    fontWeight: 'bold',
  },
});

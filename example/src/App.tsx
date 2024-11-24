import { View, StyleSheet } from 'react-native';
import { AutoComplete } from 'react-native-autocomplete-multiselect';

export default function App() {
  return (
    <View style={styles.container}>
      <AutoComplete blurOnSubmit={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

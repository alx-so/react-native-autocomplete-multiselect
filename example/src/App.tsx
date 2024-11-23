import { View, StyleSheet } from 'react-native';
import { AutoComplete } from 'react-native-autocomplete-select';

export default function App() {
  return (
    <View style={styles.container}>
      <AutoComplete />
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

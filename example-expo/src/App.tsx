import { View, StyleSheet, Text, Button } from 'react-native';
import { AutoComplete } from 'react-native-autocomplete-multiselect';
import { getTestSearchItems } from '../../src/utils';
import React from 'react';

const seatchItems = getTestSearchItems().sort((a, b) => a.label.localeCompare(b.label));
export default function App() {
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);

  const style = {
    marginBottom: 10,
  };

  return (
    <View style={styles.container}>
      <Button title="Toggle" onPress={() => setIsSelectOpen(!isSelectOpen)} />

      <View style={style}>
        <Text>Input tags (multuple=true), freeform</Text>
        <AutoComplete.Input
          multiple
          defaultValue={['asdf']}
          tagProps={{
            showRemoveButton: true,
          }}
        />
      </View>

      <View style={style}>
        <Text>InputSelect no tags (multuple=false), suggestions</Text>
        <AutoComplete.InputSelect items={seatchItems} closeOnSelect />
      </View>

      <View style={style}>
        <Text>InputSelect tags (multuple=true), suggestions</Text>
        <AutoComplete.InputSelect items={seatchItems} multiple closeOnSelect={false} />
      </View>

      <View style={style}>
        <Text>Select (multuple=false), suggestions</Text>
        <AutoComplete.Select
          items={seatchItems}
          open={isSelectOpen}
          onOpen={() => console.log('onOpen')}
          onClose={() => console.log('onClose')}
        />
      </View>

      <View style={style}>
        <Text>Select (multuple=true), suggestions</Text>
        <AutoComplete.Select
          multiple
          items={seatchItems}
          open={isSelectOpen}
          onOpen={() => console.log('onOpen')}
          onClose={() => console.log('onClose')}
        />
      </View>

      <View style={style}>
        <Text>Select (multuple=true), suggestions with search</Text>
        <AutoComplete.Select
          searchable
          multiple
          items={seatchItems}
          open={isSelectOpen}
          onOpen={() => console.log('onOpen')}
          onClose={() => console.log('onClose')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 10,
    backgroundColor: '#ecf0f1',
  },
});

import { Select } from './components/Select';
import { InputSelect } from './components/InputSelect';
import { InputEnhanced } from './components/Input'; // Fixed import statement
import { Text } from 'react-native';

export const AutoComplete = () => {
  return <Text>test</Text>;
};

AutoComplete.Input = InputEnhanced;
AutoComplete.InputSelect = InputSelect;
AutoComplete.Select = Select;

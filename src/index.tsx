import { AutoCompleteInput } from './components/AutoCompleteInput';
import { defaultSettings } from './defaultSettings';
import type { ISettings } from './types/settings';

export const AutoComplete = (settings: ISettings = defaultSettings) => {
  return <AutoCompleteInput blurOnSubmit={settings.blurOnSubmit} />;
};

import { Input } from './components/Input';
import { defaultSettings } from './defaultSettings';
import type { ISettings } from './types/settings';

export const AutoComplete = (settings: ISettings = defaultSettings) => {
  settings = { ...defaultSettings, ...settings };

  return <Input {...settings} />;
};

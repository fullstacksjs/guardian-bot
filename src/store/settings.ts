import Datastore from 'nedb-promises';

export function SettingsStore() {
  const settings = new Datastore({
    autoload: true,
    filename: 'data/Settings.db',
  });

  return settings;
}

export interface Settings {
  chatId: number;
  timeout?: number;
  deleteDelay?: number;
  debugChatId?: string | number;
  allowLinks?: boolean;
  cacheTime?: number;
}

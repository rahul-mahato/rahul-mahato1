import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { migrations } from './migrations';
import { Memory } from './models/Memory';
import { Theme } from './models/Theme';
import { PrivacyLogEntry } from './models/PrivacyLogEntry';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'memoryos',
  jsi: true,
  onSetUpError: (error) => {
    // Don't include any user data — schema setup never sees content.
    console.error('db.setup.failed', error.message);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Memory, Theme, PrivacyLogEntry],
});

export { Memory, Theme, PrivacyLogEntry };

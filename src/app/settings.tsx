import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { privacyLog } from '@/sync/privacyLog';
import type { PrivacyLogEntry } from '@db/index';

export default function SettingsScreen() {
  const [entries, setEntries] = useState<PrivacyLogEntry[]>([]);

  useEffect(() => {
    void privacyLog.list(200).then(setEntries);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Privacy</Text>
      <Text style={styles.body}>
        MemoryOS runs locally. Your memories never leave this device unencrypted.
        Below is the complete log of every outbound network request the app has
        made.
      </Text>

      <Text style={styles.h2}>Outbound calls</Text>
      {entries.length === 0 ? (
        <Text style={styles.muted}>No outbound calls recorded.</Text>
      ) : (
        entries.map((e) => (
          <View key={e.id} style={styles.entry}>
            <Text style={styles.entryMeta}>
              {new Date(e.occurredAt).toLocaleString()} · {e.kind}
            </Text>
            <Text style={styles.entryUrl}>{e.url}</Text>
            <Text style={styles.muted}>
              {e.reason} · payload: {e.payloadShape}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, gap: 12 },
  h1: { fontSize: 22, fontWeight: '700' },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 16 },
  body: { fontSize: 15, lineHeight: 22, color: '#495057' },
  entry: { padding: 10, backgroundColor: '#f8f9fa', borderRadius: 8 },
  entryMeta: { fontSize: 11, color: '#6c757d' },
  entryUrl: { fontFamily: 'Menlo', fontSize: 13 },
  muted: { color: '#868e96', fontSize: 12 },
});

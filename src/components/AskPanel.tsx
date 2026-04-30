import { useState } from 'react';
import { View, TextInput, Pressable, Text, ScrollView, StyleSheet } from 'react-native';
import { useAskPastSelf } from '@/hooks/useAskPastSelf';

export function AskPanel() {
  const [query, setQuery] = useState('');
  const { ask, loading, result, error } = useAskPastSelf();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ask your past self…"
          style={styles.input}
        />
        <Pressable onPress={() => ask(query)} disabled={loading || !query.trim()} style={styles.btn}>
          <Text style={styles.btnText}>{loading ? '…' : 'Ask'}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.body}>
        {error && <Text style={styles.error}>{error.message}</Text>}
        {result && (
          <>
            <Text style={styles.answer}>{result.answer}</Text>
            <Text style={styles.h2}>Sources</Text>
            {result.contexts.map((c, i) => (
              <View key={c.id} style={styles.source}>
                <Text style={styles.sourceMeta}>
                  [{i + 1}] {c.createdAt.toLocaleDateString()}
                </Text>
                <Text>{c.text}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  row: { flexDirection: 'row', gap: 8, padding: 12 },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f1f3f5',
    fontSize: 16,
  },
  btn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
  },
  btnText: { color: '#fff', fontWeight: '600' },
  body: { padding: 12 },
  answer: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  h2: { fontWeight: '700', marginTop: 12, marginBottom: 6 },
  source: { padding: 10, backgroundColor: '#f8f9fa', borderRadius: 8, marginBottom: 8 },
  sourceMeta: { fontSize: 11, color: '#6c757d', marginBottom: 4 },
  error: { color: '#c92a2a' },
});

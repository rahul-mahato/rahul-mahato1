import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useMemories } from '@/hooks/useMemories';

export function MemoryList() {
  const items = useMemories(100);

  return (
    <FlatList
      data={items}
      keyExtractor={(m) => m.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.ts}>{item.createdAt.toLocaleString()}</Text>
          <Text style={styles.body}>{item.text}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No memories yet. Start typing.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 10 },
  row: { padding: 12, backgroundColor: '#fff', borderRadius: 10 },
  ts: { color: '#6c757d', fontSize: 11, marginBottom: 4 },
  body: { fontSize: 15, lineHeight: 22 },
  empty: { textAlign: 'center', color: '#868e96', marginTop: 64 },
});

import { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { memoryService } from '@db/memory.service';

export function ChatInput() {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      await memoryService.create({ text: trimmed, kind: 'text' });
      setText('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.row}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="What's on your mind?"
        multiline
        style={styles.input}
        editable={!busy}
      />
      <Pressable onPress={submit} disabled={busy || !text.trim()} style={styles.btn}>
        <Text style={styles.btnText}>{busy ? '…' : 'Save'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, padding: 12 },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
});

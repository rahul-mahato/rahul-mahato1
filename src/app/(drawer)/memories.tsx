import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/theme/text';
import { colors, fonts, radius, spacing } from '@/theme/tokens';
import { useMemories } from '@/hooks/useMemories';
import { memoryService } from '@db/memory.service';
import { MemoryRow } from '@components/MemoryRow';

export default function MemoriesScreen() {
  const nav = useNavigation();
  const items = useMemories(200);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      await memoryService.create({ text: draft.trim(), kind: 'text' });
      setDraft('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => nav.dispatch(DrawerActions.openDrawer())}
          accessibilityLabel="Open menu"
          style={styles.menuBtn}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.6}>
            <Path d="M4 7h16M4 12h16M4 17h16" />
          </Svg>
        </Pressable>
        <Text variant="display" style={styles.title}>Memories</Text>
      </View>

      <Text variant="bodyDim" style={styles.sub}>
        Tap any entry to revise it. {items.length} {items.length === 1 ? 'entry' : 'entries'}.
      </Text>

      <FlatList
        data={items}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MemoryRow id={item.id} text={item.text} createdAt={item.createdAt} kind={item.kind} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="serifBody" style={styles.emptyTitle}>Nothing here yet.</Text>
            <Text variant="bodyDim">Capture a thought below — it stays on this device, encrypted.</Text>
          </View>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.captureRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Capture a thought…"
            placeholderTextColor={colors.inkFaint}
            multiline
            style={styles.input}
            editable={!busy}
          />
          <Pressable
            onPress={submit}
            disabled={!draft.trim() || busy}
            style={[styles.saveBtn, (!draft.trim() || busy) && { opacity: 0.4 }]}
          >
            <Text variant="body" style={styles.saveBtnText}>{busy ? '…' : 'Save'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: { fontSize: 26 },
  sub: { paddingHorizontal: spacing.xl, marginTop: 6, color: colors.inkFaint, marginBottom: spacing.md },
  list: { padding: spacing.xl, paddingTop: 0, gap: 12 },
  empty: { alignItems: 'center', padding: spacing['3xl'], gap: 8 },
  emptyTitle: { color: colors.ink, marginBottom: 4 },
  captureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg2,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.sans,
    fontSize: 15,
    minHeight: 44,
    maxHeight: 140,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  saveBtn: {
    minHeight: 44,
    paddingHorizontal: 18,
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: colors.bg, fontFamily: fonts.sansMd },
});

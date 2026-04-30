import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/theme/text';
import { colors, spacing } from '@/theme/tokens';
import { useMemory } from '@/hooks/useUpdateMemory';
import { MemoryEditor } from '@components/MemoryEditor';

export default function MemoryEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memory, save, remove, error } = useMemory(id ?? '');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Close"
          onPress={() => router.back()}
          style={styles.closeBtn}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.6}>
            <Path d="M6 6l12 12M18 6L6 18" />
          </Svg>
        </Pressable>
        <Text variant="title">Edit memory</Text>
      </View>

      {error ? (
        <View style={styles.empty}>
          <Text variant="bodyDim">Couldn’t load this memory: {error.message}</Text>
        </View>
      ) : memory ? (
        <MemoryEditor
          initialText={memory.text}
          createdAt={memory.createdAt}
          onSave={async (text) => {
            await save(text);
            router.back();
          }}
          onDelete={async () => {
            await remove();
            router.back();
          }}
          onCancel={() => router.back()}
        />
      ) : (
        <View style={styles.empty}>
          <Text variant="bodyDim">Decrypting…</Text>
        </View>
      )}
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
    paddingBottom: spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  empty: { padding: spacing.xl, alignItems: 'center' },
});

import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/theme/text';
import { colors, radius, spacing } from '@/theme/tokens';

interface Props {
  id: string;
  text: string;
  createdAt: Date;
  kind: 'text' | 'voice' | 'image';
}

export function MemoryRow({ id, text, createdAt, kind }: Props) {
  const dateLabel = createdAt.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: createdAt.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Memory from ${dateLabel}. Tap to edit.`}
      onPress={() => router.push({ pathname: '/memory/[id]', params: { id } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text variant="mono" style={styles.date}>{dateLabel.toUpperCase()}</Text>
      <Text variant="body" numberOfLines={4} style={styles.body}>{text}</Text>
      {kind !== 'text' && <Text variant="meta" style={styles.kind}>{kind}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: spacing.lg,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    gap: 8,
  },
  pressed: { borderColor: colors.accent },
  date: { color: colors.inkFaint, letterSpacing: 1.4 },
  body: { lineHeight: 22 },
  kind: { color: colors.glow, textTransform: 'uppercase', letterSpacing: 1 },
});

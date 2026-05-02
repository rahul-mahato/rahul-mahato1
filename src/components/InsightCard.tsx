import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/theme/text';
import { colors, radius, spacing } from '@/theme/tokens';

export type InsightKind = 'theme' | 'mood' | 'thread';

interface Props {
  kind: InsightKind;
  body: string;
  emphasis?: string;
  meta: string;
  onPress?: () => void;
}

const KIND_LABEL: Record<InsightKind, string> = {
  theme: 'RECURRING THEME',
  mood: 'MOOD SHIFT',
  thread: 'OPEN THREAD',
};

export function InsightCard({ kind, body, emphasis, meta, onPress }: Props) {
  const parts = emphasis ? body.split(emphasis) : [body];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text variant="mono" style={styles.kind}>{KIND_LABEL[kind]}</Text>
      <Text variant="serifBody" style={styles.body}>
        {parts.length === 2 && emphasis ? (
          <>
            {parts[0]}
            <Text variant="serifBody" italic>
              {emphasis}
            </Text>
            {parts[1]}
          </>
        ) : (
          body
        )}
      </Text>
      <Text variant="meta" style={styles.meta}>{meta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
    padding: 18,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pressed: { borderColor: colors.accent, transform: [{ translateY: -2 }] },
  kind: { letterSpacing: 1.8 },
  body: { fontSize: 16, lineHeight: 22 },
  meta: { color: colors.inkFaint },
});

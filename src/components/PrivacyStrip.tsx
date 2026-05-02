import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/theme/text';
import { colors, radius, spacing } from '@/theme/tokens';
import { useTodayAuditCount } from '@/hooks/useTodayAuditCount';

/**
 * Bottom-of-home dashed-border strip — UX_RATIONALE §5 "on demand" privacy
 * proof. Dashed border is intentional: it signals a transparent boundary,
 * not a wall.
 */
export function PrivacyStrip() {
  const count = useTodayAuditCount();
  const message =
    count === 0
      ? '0 outbound requests today.'
      : `${count} outbound ${count === 1 ? 'request' : 'requests'} today.`;

  return (
    <View style={styles.strip}>
      <Text variant="bodyDim" style={styles.body}>
        Every embedding, search and synthesis ran on this device.{' '}
        <Text variant="bodyDim" style={styles.emph}>{message}</Text>
      </Text>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="See full privacy audit log"
        onPress={() => router.push('/(drawer)/settings')}
        style={styles.link}
      >
        <Text variant="body" style={styles.linkText}>See audit log →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    marginTop: spacing['2xl'],
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  body: { flex: 1, minWidth: 240, fontSize: 13 },
  emph: { color: colors.ink },
  link: {
    minHeight: 48,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  linkText: { color: colors.ink, textDecorationLine: 'underline', fontSize: 13 },
});

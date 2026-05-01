import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/theme/text';
import { colors, spacing } from '@/theme/tokens';
import { InsightCard } from '@components/InsightCard';
import { INSIGHTS } from '@/data/insightsFixture';

export default function InsightsScreen() {
  const nav = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable
            onPress={() => nav.dispatch(DrawerActions.openDrawer())}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
            style={styles.menuBtn}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.6}>
              <Path d="M4 7h16M4 12h16M4 17h16" />
            </Svg>
          </Pressable>
          <Text variant="display" accessibilityRole="header" style={styles.title}>This week</Text>
        </View>

        <View style={styles.sectionLabel}>
          <Text variant="title" accessibilityRole="header">Synthesis</Text>
          <Text variant="mono">{INSIGHTS.length} PATTERNS NOTICED</Text>
        </View>

        <View style={styles.cards}>
          {INSIGHTS.map((s, i) => (
            <InsightCard
              key={i}
              kind={s.kind}
              body={s.body}
              emphasis={s.emphasis}
              meta={s.meta}
            />
          ))}
        </View>

        <View style={styles.note}>
          <Text variant="meta">
            Synthesis runs locally on Sundays. Themes are derived — you can wipe them
            without losing memories.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl, paddingBottom: 80 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  menuBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: { fontSize: 26 },
  sectionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cards: { gap: 12 },
  note: { marginTop: spacing.xl },
});

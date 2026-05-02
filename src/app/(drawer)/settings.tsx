import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/theme/text';
import { colors, fonts, radius, spacing } from '@/theme/tokens';
import { TTL_OPTIONS, type TtlId, getTtl, setTtl } from '@/settings/ttl';
import { runTtlSweep } from '@/settings/sweeper';
import { privacyLog } from '@/audit/privacyLog';
import type { PrivacyLogEntry } from '@db/index';

export default function SettingsScreen() {
  const nav = useNavigation();
  const [ttl, setTtlState] = useState<TtlId>('forever');
  const [entries, setEntries] = useState<PrivacyLogEntry[]>([]);
  const [lastSwept, setLastSwept] = useState<number | null>(null);

  useEffect(() => {
    void getTtl().then(setTtlState);
    void privacyLog.list(50).then(setEntries);
  }, []);

  const onPickTtl = async (id: TtlId) => {
    if (id === ttl) return;
    if (id !== 'forever') {
      const opt = TTL_OPTIONS.find((o) => o.id === id);
      Alert.alert(
        `Auto-delete after ${opt?.label}?`,
        'Memories older than this will be removed on next launch and cannot be recovered.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Set',
            style: 'destructive',
            onPress: async () => {
              await setTtl(id);
              setTtlState(id);
              const swept = await runTtlSweep();
              setLastSwept(swept);
            },
          },
        ],
      );
    } else {
      await setTtl(id);
      setTtlState(id);
    }
  };

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
          <Text variant="display" accessibilityRole="header" style={styles.title}>Privacy &amp; settings</Text>
        </View>

        <Text variant="bodyDim" style={styles.intro}>
          Everything happens on this device. Below are the controls and the audit
          trail.
        </Text>

        {/* TTL section */}
        <Text variant="mono" style={styles.sectionMono}>MEMORY TTL</Text>
        <Text variant="title" accessibilityRole="header" style={styles.sectionTitle}>
          Auto-delete old memories
        </Text>
        <Text variant="bodyDim" style={styles.sectionSub}>
          When a memory passes this age, it is deleted from the database and the
          vector index. The deletion is irreversible.
        </Text>

        <View style={styles.ttlList}>
          {TTL_OPTIONS.map((opt) => {
            const selected = opt.id === ttl;
            return (
              <Pressable
                key={opt.id}
                onPress={() => onPickTtl(opt.id)}
                style={[styles.ttlRow, selected && styles.ttlSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View style={[styles.radio, selected && styles.radioSelected]} />
                <Text variant="body" style={[styles.ttlLabel, selected && styles.ttlLabelSelected]}>
                  {opt.label}
                </Text>
                {opt.id === 'forever' && (
                  <Text variant="meta" style={styles.ttlHint}>default</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {lastSwept !== null && (
          <View style={styles.sweepNote}>
            <Text variant="meta">
              Last sweep removed {lastSwept} {lastSwept === 1 ? 'memory' : 'memories'}.
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Privacy log */}
        <Text variant="mono" style={styles.sectionMono}>OUTBOUND CALLS</Text>
        <Text variant="title" accessibilityRole="header" style={styles.sectionTitle}>
          {entries.length === 0 ? '0 outbound requests recorded' : `${entries.length} recorded`}
        </Text>
        <Text variant="bodyDim" style={styles.sectionSub}>
          Every network call this app makes is logged. Payloads are described
          structurally; never quoted.
        </Text>

        <View style={{ gap: 8, marginTop: spacing.md }}>
          {entries.length === 0 ? (
            <View style={styles.zero}>
              <Text variant="serifBody" italic style={{ color: colors.safe }}>
                Nothing has left this device.
              </Text>
            </View>
          ) : (
            entries.map((e) => (
              <View key={e.id} style={styles.logEntry}>
                <Text variant="meta">
                  {new Date(e.occurredAt).toLocaleString()} · {e.kind}
                </Text>
                <Text style={styles.logUrl}>{e.url}</Text>
                <Text variant="meta">{e.reason} · payload: {e.payloadShape}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl, paddingBottom: 80 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
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
  title: { fontSize: 24 },
  intro: { color: colors.inkFaint, marginBottom: spacing.xl },
  sectionMono: { letterSpacing: 1.8, marginBottom: 6 },
  sectionTitle: { marginBottom: 6 },
  sectionSub: { color: colors.inkFaint, marginBottom: spacing.md },
  ttlList: { gap: 8 },
  ttlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  ttlSelected: { borderColor: colors.glow },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.inkFaint,
  },
  radioSelected: {
    borderColor: colors.glow,
    backgroundColor: colors.glow,
  },
  ttlLabel: { flex: 1, color: colors.inkDim },
  ttlLabelSelected: { color: colors.ink, fontFamily: fonts.sansMd },
  ttlHint: { color: colors.inkFaint, fontFamily: fonts.mono, letterSpacing: 1.2 },
  sweepNote: {
    marginTop: spacing.md,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    borderWidth: 1,
    borderColor: colors.glow,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: spacing['2xl'],
  },
  zero: {
    padding: spacing.lg,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  logEntry: {
    padding: 12,
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
  },
  logUrl: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink,
  },
});

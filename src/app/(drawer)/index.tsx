import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { Text } from '@/theme/text';
import { colors, fonts, radius, spacing } from '@/theme/tokens';
import { Orb, type OrbState } from '@components/Orb';
import { PrivacyPill } from '@components/PrivacyPill';
import { Chip } from '@components/Chip';
import { AnswerSurface } from '@components/AnswerSurface';
import { askPastSelf } from '@ai/rag';
import { memoryService } from '@db/memory.service';
import type { RagContext } from '@ai/prompts';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Up late.';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  return 'Good evening.';
}

export default function AskScreen() {
  const nav = useNavigation();
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState<{ q: string; a: string; ctx: RagContext[] } | null>(null);

  const submitQuestion = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setOrbState('thinking');
    try {
      const r = await askPastSelf(q.trim());
      setAnswer({ q: q.trim(), a: r.answer, ctx: r.contexts });
      setOrbState('answered');
    } catch (err) {
      setAnswer({ q: q.trim(), a: `Couldn't reach your memories: ${(err as Error).message}`, ctx: [] });
      setOrbState('idle');
    }
  }, []);

  const submitInput = useCallback(async () => {
    if (!input.trim()) return;
    const isQuestion = /\?$/.test(input.trim()) || /^(what|why|when|how|where|did|do|was|is|am)\b/i.test(input.trim());
    if (isQuestion) {
      await submitQuestion(input);
    } else {
      await memoryService.create({ text: input.trim(), kind: 'text' });
    }
    setInput('');
  }, [input, submitQuestion]);

  const onOrbPress = useCallback(() => {
    if (orbState === 'listening') {
      setOrbState('thinking');
      // Demo: when real Whisper lands, this turns into transcribed text
      setTimeout(() => submitQuestion('What did I decide last week?'), 900);
    } else if (orbState === 'idle' || orbState === 'answered') {
      setOrbState('listening');
      setTimeout(() => {
        setOrbState((s) => (s === 'listening' ? 'thinking' : s));
        setTimeout(() => submitQuestion('What did I decide last week?'), 800);
      }, 2200);
    }
  }, [orbState, submitQuestion]);

  const orbHelpText =
    orbState === 'listening' ? 'Listening… tap to stop.' :
    orbState === 'thinking' ? 'Thinking on‑device…' :
    orbState === 'answered' ? 'Tap to ask another.' :
    'Tap the orb to speak.';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.topbar}>
          <Pressable
            onPress={() => nav.dispatch(DrawerActions.openDrawer())}
            accessibilityLabel="Open menu"
            style={styles.menuBtn}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.6}>
              <Path d="M4 7h16M4 12h16M4 17h16" />
            </Svg>
          </Pressable>
          <PrivacyPill />
        </View>

        <Text variant="displayLg" style={styles.greeting}>
          {greeting()}{'\n'}
          <Text variant="displayLg" italic>What do you want to remember?</Text>
        </Text>
        <Text variant="bodyDim" style={styles.sub}>Speak, type, or ask your past self anything.</Text>

        <View style={styles.orbStage}>
          <Orb state={orbState} onPress={onOrbPress} />
          <Text variant="bodyDim" style={styles.orbHelp} accessibilityLiveRegion="polite">{orbHelpText}</Text>
        </View>

        <View style={styles.actions}>
          <Chip
            label="Ask your past self"
            icon={
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.inkDim} strokeWidth={1.6}>
                <Circle cx={11} cy={11} r={7} />
                <Path d="M20 20l-3.5-3.5" />
              </Svg>
            }
            onPress={() => submitQuestion('What did I decide about the new job?')}
          />
          <Chip
            label="Quick capture"
            icon={
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.inkDim} strokeWidth={1.6}>
                <Path d="M12 5v14M5 12h14" />
              </Svg>
            }
            onPress={() => router.push('/(drawer)/memories')}
          />
          <Chip
            label="Timeline"
            icon={
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.inkDim} strokeWidth={1.6}>
                <Path d="M4 6h16M4 12h10M4 18h16" />
              </Svg>
            }
            onPress={() => router.push('/(drawer)/memories')}
          />
        </View>

        <View style={styles.typeRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Or just type… ‘what was that book Priya recommended?’"
            placeholderTextColor={colors.inkFaint}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={submitInput}
          />
          <Pressable
            accessibilityLabel="Submit"
            onPress={submitInput}
            disabled={!input.trim()}
            style={[styles.send, !input.trim() && { opacity: 0.4 }]}
          >
            <Text variant="body" style={styles.sendText}>Send</Text>
          </Pressable>
        </View>

        {answer && <AnswerSurface question={answer.q} answer={answer.a} contexts={answer.ctx} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl, paddingBottom: 140 },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  greeting: { marginBottom: 6 },
  sub: { marginBottom: spacing.xl, color: colors.inkFaint },
  orbStage: { alignItems: 'center', marginVertical: spacing.lg },
  orbHelp: { marginTop: spacing.lg, color: colors.inkDim, textAlign: 'center' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  typeRow: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingLeft: 18,
    paddingRight: 8,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.sans,
    fontSize: 15,
    minHeight: 48,
  },
  send: {
    minHeight: 48,
    paddingHorizontal: 18,
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: colors.bg, fontFamily: fonts.sansMd },
});

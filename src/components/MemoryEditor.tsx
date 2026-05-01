import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/theme/text';
import { colors, radius, spacing, fonts } from '@/theme/tokens';

interface Props {
  initialText: string;
  createdAt?: Date;
  onSave: (text: string) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onCancel: () => void;
}

export function MemoryEditor({ initialText, createdAt, onSave, onDelete, onCancel }: Props) {
  const [text, setText] = useState(initialText);
  const [busy, setBusy] = useState(false);
  const dirty = text.trim() !== initialText.trim();

  const submit = async () => {
    if (busy || !dirty || !text.trim()) return;
    setBusy(true);
    try {
      await onSave(text.trim());
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      {createdAt && (
        <Text variant="mono" style={styles.date}>
          {createdAt.toLocaleString(undefined, {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).toUpperCase()}
        </Text>
      )}

      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        autoFocus
        textAlignVertical="top"
        style={styles.input}
        placeholderTextColor={colors.inkFaint}
        placeholder="What did you mean to say?"
      />

      <View style={styles.actions}>
        <Pressable onPress={onCancel} style={styles.btnGhost}>
          <Text variant="bodyDim">Cancel</Text>
        </Pressable>
        {onDelete && (
          <Pressable
            onPress={async () => {
              setBusy(true);
              try { await onDelete(); } finally { setBusy(false); }
            }}
            style={styles.btnDanger}
          >
            <Text variant="body" style={styles.btnDangerText}>Delete</Text>
          </Pressable>
        )}
        <Pressable
          onPress={submit}
          disabled={!dirty || busy || !text.trim()}
          style={[styles.btnPrimary, (!dirty || busy || !text.trim()) && styles.btnDisabled]}
        >
          <Text variant="body" style={styles.btnPrimaryText}>{busy ? 'Saving…' : 'Save'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.xl, gap: spacing.md, flex: 1 },
  date: { color: colors.inkFaint, letterSpacing: 1.4 },
  input: {
    flex: 1,
    minHeight: 220,
    fontFamily: fonts.serif,
    fontSize: 19,
    lineHeight: 28,
    color: colors.ink,
    backgroundColor: 'transparent',
    paddingTop: 0,
  },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  btnGhost: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  btnDanger: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  btnDangerText: { color: colors.danger },
  btnPrimary: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 22,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
  },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: colors.bg, fontFamily: fonts.sansMd },
});

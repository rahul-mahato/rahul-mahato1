import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/theme/text';
import { colors, radius } from '@/theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
}

export function Chip({ label, onPress, icon, accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text variant="bodyDim" style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 18,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  pressed: { borderColor: colors.accent, backgroundColor: colors.bgRaised },
  icon: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14, color: colors.inkDim },
});

import { View, Text, StyleSheet } from 'react-native';

/**
 * Weekly synthesis lives here. Phase 3 wires the synthesis worker; for now
 * this is a placeholder so the route is reachable.
 */
export default function InsightsScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Weekly synthesis</Text>
      <Text style={styles.body}>
        Recurring themes and mood shifts will appear here once you've logged a
        week of memories. (Phase 3.)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, gap: 12 },
  h1: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22, color: '#495057' },
});

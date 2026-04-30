import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ChatInput } from '@components/ChatInput';
import { MemoryList } from '@components/MemoryList';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link href="/ask">Ask</Link>
        <Link href="/timeline">Timeline</Link>
        <Link href="/insights">Insights</Link>
        <Link href="/settings">Privacy</Link>
      </View>
      <View style={styles.list}>
        <MemoryList />
      </View>
      <ChatInput />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e9ecef',
  },
  list: { flex: 1 },
});

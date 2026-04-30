import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'MemoryOS' }} />
        <Stack.Screen name="ask" options={{ title: 'Ask your past self' }} />
        <Stack.Screen name="timeline" options={{ title: 'Timeline' }} />
        <Stack.Screen name="insights" options={{ title: 'Insights' }} />
        <Stack.Screen name="settings" options={{ title: 'Privacy & Settings' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

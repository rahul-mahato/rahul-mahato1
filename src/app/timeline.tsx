import { View } from 'react-native';
import { MemoryList } from '@components/MemoryList';

export default function TimelineScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MemoryList />
    </View>
  );
}

import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/theme/text';
import { colors, fonts, spacing } from '@/theme/tokens';

function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <View style={styles.drawer}>
      <View style={styles.brand}>
        <View style={styles.brandDot} />
        <Text variant="title" style={styles.brandText}>MemoryOS</Text>
      </View>
      <Text variant="meta" style={styles.tagline}>Private memory, on-device.</Text>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.itemsWrap}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Text variant="meta">Zero‑knowledge. AES‑256‑GCM at rest.</Text>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: { backgroundColor: colors.bg, width: 280 },
        drawerActiveTintColor: colors.ink,
        drawerInactiveTintColor: colors.inkDim,
        drawerActiveBackgroundColor: colors.bgRaised,
        drawerLabelStyle: { fontFamily: fonts.sansMd, fontSize: 15, marginLeft: -8 },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 8 },
      }}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: 'Ask', title: 'Ask' }} />
      <Drawer.Screen name="memories" options={{ drawerLabel: 'Memories', title: 'Memories' }} />
      <Drawer.Screen name="insights" options={{ drawerLabel: 'Insights', title: 'Insights' }} />
      <Drawer.Screen name="settings" options={{ drawerLabel: 'Settings', title: 'Settings' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawer: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: spacing.xl },
  brandDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.glow,
    shadowColor: colors.glow,
    shadowRadius: 12,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
  },
  brandText: { fontSize: 20 },
  tagline: { paddingHorizontal: spacing.xl, marginTop: 4, marginBottom: spacing.lg },
  itemsWrap: { paddingTop: spacing.sm },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});

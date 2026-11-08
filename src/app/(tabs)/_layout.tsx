import { Tabs } from 'expo-router';

import { ScreenTargetProvider } from '@/components/effects/Glass';
import { TabBar } from '@/components/navigation/TabBar';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

export default function TabsLayout() {
  const { s } = useI18n();
  return (
    <ScreenTargetProvider>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, animation: 'shift', sceneStyle: { backgroundColor: colors.bg } }}
      >
        <Tabs.Screen name="index" options={{ title: s.tabs.home }} />
        <Tabs.Screen name="bookings" options={{ title: s.tabs.bookings }} />
        <Tabs.Screen name="favorites" options={{ title: s.tabs.favorites }} />
        <Tabs.Screen name="account" options={{ title: s.tabs.account }} />
      </Tabs>
    </ScreenTargetProvider>
  );
}

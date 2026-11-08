import '../../global.css';

import { ReadexPro_400Regular } from '@expo-google-fonts/readex-pro/400Regular';
import { ReadexPro_500Medium } from '@expo-google-fonts/readex-pro/500Medium';
import { ReadexPro_600SemiBold } from '@expo-google-fonts/readex-pro/600SemiBold';
import { ReadexPro_700Bold } from '@expo-google-fonts/readex-pro/700Bold';
import { SpaceMono_700Bold } from '@expo-google-fonts/space-mono/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useHeaderPinCenter } from '@/features/clubs/HomeHeader';
import { OpeningAnimation } from '@/features/splash/OpeningAnimation';
import { BookingsProvider } from '@/state/bookings';
import { FavoritesProvider } from '@/state/favorites';
import { OpeningContext } from '@/state/opening';
import { colors } from '@/theme';

// Keep the native splash (brand background) up until fonts are ready, so the
// opening animation starts on the same color with no flash.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ReadexPro_400Regular,
    ReadexPro_500Medium,
    ReadexPro_600SemiBold,
    ReadexPro_700Bold,
    SpaceMono_700Bold,
  });
  const ready = fontsLoaded || !!fontError;
  const [opening, setOpening] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [homeReady, setHomeReady] = useState(false);
  const markReady = useCallback(() => setHomeReady(true), []);
  const openingState = useMemo(() => ({ revealed, markReady }), [revealed, markReady]);
  const pin = useHeaderPinCenter();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <OpeningContext.Provider value={openingState}>
      <BookingsProvider>
        <FavoritesProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
          {opening && (
            <OpeningAnimation exitTo={pin} canStart={homeReady} onReveal={() => setRevealed(true)} onFinish={() => setOpening(false)} />
          )}
        </FavoritesProvider>
      </BookingsProvider>
    </OpeningContext.Provider>
  );
}

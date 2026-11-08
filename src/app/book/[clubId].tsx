import { useLocalSearchParams } from 'expo-router';

import { BookScreen } from '@/features/booking/BookScreen';

export default function BookRoute() {
  const { clubId, court } = useLocalSearchParams<{ clubId: string; court?: string }>();
  return <BookScreen clubId={clubId} courtId={court} />;
}

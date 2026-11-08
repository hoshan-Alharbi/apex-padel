import { useLocalSearchParams } from 'expo-router';

import { SplitScreen } from '@/features/bookings/SplitScreen';

export default function SplitRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SplitScreen bookingId={id} />;
}

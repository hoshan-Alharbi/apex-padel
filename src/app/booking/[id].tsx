import { useLocalSearchParams } from 'expo-router';

import { PassScreen } from '@/features/bookings/PassScreen';

/** Booking details. `fresh=1` when arriving straight from checkout (celebration + Done). */
export default function BookingRoute() {
  const { id, fresh } = useLocalSearchParams<{ id: string; fresh?: string }>();
  return <PassScreen bookingId={id} fresh={fresh === '1'} />;
}

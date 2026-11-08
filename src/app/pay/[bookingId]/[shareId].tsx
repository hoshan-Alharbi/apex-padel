import { useLocalSearchParams } from 'expo-router';

import { PayLinkScreen } from '@/features/bookings/PayLinkScreen';

/** Target of a partner's payment link (apexpadel://pay/<booking>/<share>). */
export default function PayRoute() {
  const { bookingId, shareId } = useLocalSearchParams<{ bookingId: string; shareId: string }>();
  return <PayLinkScreen bookingId={bookingId} shareId={shareId} />;
}

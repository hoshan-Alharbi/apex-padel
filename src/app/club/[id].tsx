import { useLocalSearchParams } from 'expo-router';

import { ClubDetailsScreen } from '@/features/clubs/details/ClubDetailsScreen';

export default function ClubRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ClubDetailsScreen clubId={id} />;
}

import { StyleSheet, Text, View } from 'react-native';

// Temporary placeholder screen (part 0.1). Replaced by the real Home in Phase 2.
export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apex Padel</Text>
      <Text style={styles.subtitle}>أبكس بادل</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E131D',
  },
  title: {
    color: '#D4FF00',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#DEE2F1',
    fontSize: 18,
    marginTop: 8,
  },
});

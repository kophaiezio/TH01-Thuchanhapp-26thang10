import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export function SyncBadge({
  pending = true,
  label = 'Chưa đồng bộ',
}: {
  pending?: boolean;
  label?: string;
}): React.JSX.Element | null {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>↻</Text>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderColor: '#FFE082',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 11,
    color: '#B78103',
    fontWeight: '800',
    marginRight: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B78103',
  },
});

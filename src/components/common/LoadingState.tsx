import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme';

export function LoadingState({
  message = 'Đang tải dữ liệu...',
}: {
  message?: string;
}): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    minHeight: 220,
  },
  text: {
    marginTop: 12,
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
});


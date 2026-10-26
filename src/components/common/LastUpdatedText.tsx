import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme';

export function LastUpdatedText({
  timestamp,
  style,
}: {
  timestamp: string | null;
  style?: object;
}): React.JSX.Element | null {
  if (!timestamp) {
    return null;
  }

  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.text}>Cập nhật lần cuối: {timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  text: {
    fontSize: 11,
    color: colors.muted,
    fontStyle: 'italic',
  },
});


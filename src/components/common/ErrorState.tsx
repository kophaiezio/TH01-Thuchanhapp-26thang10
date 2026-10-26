import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme';

export function ErrorState({
  title = 'Đã có lỗi xảy ra',
  message,
  onRetry,
}: {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
}): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>
        {message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.'}
      </Text>
      {onRetry ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.retryBtn}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      ) : null}
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
  icon: {
    fontSize: 34,
    color: colors.orange,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});


import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSync} from '../../context/SyncContext';
import {colors} from '../../theme';

export function SyncNotificationBanner(): React.JSX.Element | null {
  const {
    syncMessage,
    syncError,
    clearSyncMessage,
    triggerSync,
    pendingCount,
  } = useSync();

  if (!syncMessage) {
    return null;
  }

  return (
    <View style={[styles.banner, syncError ? styles.errorBanner : undefined]}>
      <Text style={[styles.icon, syncError ? styles.errorIcon : undefined]}>
        {syncError ? '!' : '✓'}
      </Text>
      <Text style={[styles.text, syncError ? styles.errorText : undefined]}>
        {syncMessage}
      </Text>
      {syncError && pendingCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            triggerSync();
          }}
          style={styles.retryButton}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={clearSyncMessage}
        hitSlop={8}
        style={styles.closeBtn}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorBanner: {backgroundColor: '#FFF4E5', borderColor: '#FFE0B2'},
  icon: {
    fontSize: 14,
    color: colors.green,
    fontWeight: '800',
    marginRight: 8,
  },
  errorIcon: {color: colors.orange},
  errorText: {color: '#8C5B00'},
  text: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '700',
  },
  retryButton: {paddingHorizontal: 8, paddingVertical: 3},
  retryText: {fontSize: 11, fontWeight: '800', color: colors.orange},
});

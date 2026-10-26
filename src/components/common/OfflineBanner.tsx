import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSync} from '../../context/SyncContext';
import {colors} from '../../theme';

export function OfflineBanner(): React.JSX.Element | null {
  const {isOnline, isSimulatedOffline, toggleSimulatedOffline, pendingCount} =
    useSync();

  if (isOnline && !isSimulatedOffline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.icon}>⚡</Text>
        <View style={styles.textWrap}>
          <Text style={styles.title}>Bạn đang offline</Text>
          <Text style={styles.subtitle}>
            {pendingCount > 0
              ? `${pendingCount} thay đổi đang chờ đồng bộ.`
              : 'Dữ liệu được lưu trong bộ nhớ máy.'}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={toggleSimulatedOffline}
        style={styles.toggleBtn}>
        <Text style={styles.toggleText}>
          {isSimulatedOffline ? 'Bật mạng' : 'Giả lập'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FFE0B2',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {flexDirection: 'row', alignItems: 'center', flex: 1},
  icon: {fontSize: 18, marginRight: 10, color: colors.orange},
  textWrap: {flex: 1},
  title: {fontSize: 12, fontWeight: '800', color: colors.orange},
  subtitle: {fontSize: 11, color: '#8C5B00', marginTop: 1},
  toggleBtn: {
    backgroundColor: colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 8,
  },
  toggleText: {color: '#FFFFFF', fontSize: 11, fontWeight: '700'},
});


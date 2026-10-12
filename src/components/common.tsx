import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme';

export function Screen({children}: React.PropsWithChildren): React.JSX.Element {
  return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}): React.JSX.Element {
  return (
    <View style={styles.pageTitle}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}): React.JSX.Element {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          hitSlop={8}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({
  children,
  style,
}: React.PropsWithChildren<{style?: object}>): React.JSX.Element {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function StatusBadge({
  completed,
}: {
  completed: boolean;
}): React.JSX.Element {
  return (
    <View
      style={[
        styles.badge,
        completed ? styles.completedBadge : styles.pendingBadge,
      ]}>
      <Text
        style={[
          styles.badgeText,
          completed ? styles.completedText : styles.pendingText,
        ]}>
        {completed ? '✓ Đã hoàn thành' : '◷ Chưa hoàn thành'}
      </Text>
    </View>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}): React.JSX.Element {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>✦</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  pageTitle: {paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14},
  title: {fontSize: 27, fontWeight: '800', color: colors.text},
  subtitle: {marginTop: 5, color: colors.muted, fontSize: 14},
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {fontSize: 17, fontWeight: '700', color: colors.text},
  actionLabel: {fontSize: 13, fontWeight: '700', color: colors.primary},
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  completedBadge: {backgroundColor: colors.greenLight},
  pendingBadge: {backgroundColor: colors.orangeLight},
  badgeText: {fontSize: 11, fontWeight: '700'},
  completedText: {color: colors.green},
  pendingText: {color: colors.orange},
  empty: {alignItems: 'center', padding: 30},
  emptyIcon: {fontSize: 30, color: colors.primary, marginBottom: 8},
  emptyTitle: {fontSize: 16, fontWeight: '700', color: colors.text},
  emptyMessage: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  infoRow: {
    paddingVertical: 13,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {fontSize: 12, color: colors.muted, marginBottom: 5},
  infoValue: {fontSize: 15, color: colors.text, fontWeight: '600'},
});

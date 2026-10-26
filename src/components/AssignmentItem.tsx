import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {Assignment, Subject} from '../types';
import {colors} from '../theme';
import {Card, StatusBadge, SyncBadge} from './common';

export function formatDueDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  } catch {
    return value;
  }
}

export function AssignmentItem({
  assignment,
  subject,
  isPendingSync = false,
  onPress,
  onToggle,
}: {
  assignment: Assignment;
  subject?: Subject;
  isPendingSync?: boolean;
  onPress: () => void;
  onToggle: () => void;
}): React.JSX.Element {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Chi tiết bài tập ${assignment.title}`}
          onPress={onPress}
          style={styles.details}>
          <Text style={styles.title}>{assignment.title}</Text>
          {subject ? <Text style={styles.meta}>{subject.name}</Text> : null}
          <Text style={styles.due}>
            Hạn nộp · {formatDueDate(assignment.dueAt)}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{checked: assignment.completed}}
          accessibilityLabel={
            assignment.completed
              ? 'Đánh dấu chưa hoàn thành'
              : 'Đánh dấu đã hoàn thành'
          }
          onPress={onToggle}
          style={[
            styles.check,
            assignment.completed ? styles.checked : styles.unchecked,
          ]}>
          {assignment.completed ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : null}
        </Pressable>
      </View>
      <View style={styles.footer}>
        <StatusBadge completed={assignment.completed} />
        {isPendingSync ? <SyncBadge label="Chưa đồng bộ" /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: 10},
  row: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10},
  details: {flex: 1, paddingRight: 12},
  title: {fontSize: 14, color: colors.text, fontWeight: '700'},
  meta: {fontSize: 12, color: colors.primary, marginTop: 4},
  due: {fontSize: 11, color: colors.muted, marginTop: 4},
  check: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {backgroundColor: colors.green},
  unchecked: {borderColor: colors.border, borderWidth: 1.5},
  checkmark: {color: '#FFFFFF', fontSize: 17, fontWeight: '800'},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

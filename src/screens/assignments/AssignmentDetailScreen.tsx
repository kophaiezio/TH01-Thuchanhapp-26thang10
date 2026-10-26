import React from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {
  AssignmentsStackParamList,
  HomeStackParamList,
} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {useSync} from '../../context/SyncContext';
import {useCachedAssignment} from '../../hooks/useCachedAssignment';
import {formatDueDate} from '../../components/AssignmentItem';
import {
  Card,
  EmptyState,
  ErrorState,
  InfoRow,
  LastUpdatedText,
  LoadingState,
  OfflineBanner,
  Screen,
  StatusBadge,
  SyncBadge,
} from '../../components/common';
import {colors} from '../../theme';

type Props =
  | NativeStackScreenProps<AssignmentsStackParamList, 'AssignmentDetail'>
  | NativeStackScreenProps<HomeStackParamList, 'AssignmentDetail'>;

export function AssignmentDetailScreen({route}: Props): React.JSX.Element {
  const {id: assignmentId} = route.params;

  const {assignments, subjects, toggleAssignment} = useAppContext();
  const {hasPendingSync} = useSync();

  const isPending = hasPendingSync(assignmentId);
  const contextAssignment = assignments.find(item => item.id === assignmentId);

  const {
    data: fetchedAssignment,
    isLoading,
    isRefreshing,
    isError,
    error,
    lastUpdated,
    refetch,
  } = useCachedAssignment(assignmentId, contextAssignment);

  const contextIsNewer =
    contextAssignment &&
    fetchedAssignment &&
    Date.parse(contextAssignment.updatedAt) >=
      Date.parse(fetchedAssignment.updatedAt);
  const assignment = contextIsNewer
    ? contextAssignment
    : fetchedAssignment || contextAssignment;
  const subject = subjects.find(item => item.id === assignment?.subjectId);

  if (isLoading && !assignment) {
    return (
      <Screen>
        <OfflineBanner />
        <LoadingState message="Đang tải chi tiết bài tập..." />
      </Screen>
    );
  }

  if (isError && !assignment) {
    return (
      <Screen>
        <OfflineBanner />
        <ErrorState
          title="Không thể tải bài tập"
          message={error}
          onRetry={refetch}
        />
      </Screen>
    );
  }

  if (!assignment) {
    return (
      <Screen>
        <OfflineBanner />
        <EmptyState
          title="Không tìm thấy bài tập"
          message="Bài tập này có thể đã được xóa hoặc không tồn tại."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            colors={[colors.primary]}
          />
        }>
        <LastUpdatedText timestamp={lastUpdated} />
        <Card>
          <Text style={styles.title}>{assignment.title}</Text>
          {subject ? (
            <Text style={styles.subject}>
              {subject.code} · {subject.name}
            </Text>
          ) : null}
          <View style={styles.badgesRow}>
            <StatusBadge completed={assignment.completed} />
            {isPending ? <SyncBadge label="Chưa đồng bộ" /> : null}
          </View>
        </Card>

        <Card>
          <InfoRow label="Môn học" value={subject?.name || 'Không xác định'} />
          <InfoRow label="Hạn nộp" value={formatDueDate(assignment.dueAt)} />
          <Text style={styles.descriptionLabel}>Yêu cầu bài tập</Text>
          <Text style={styles.description}>
            {assignment.description || 'Không có mô tả chi tiết.'}
          </Text>
        </Card>

        <Pressable
          accessibilityRole="button"
          onPress={() => toggleAssignment(assignment.id)}
          style={[
            styles.button,
            assignment.completed ? styles.undoButton : undefined,
          ]}>
          <Text style={styles.buttonText}>
            {assignment.completed
              ? '↺  Đánh dấu chưa hoàn thành'
              : '✓  Đánh dấu đã hoàn thành'}
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {padding: 20},
  title: {fontSize: 19, color: colors.text, fontWeight: '800'},
  subject: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 6,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  descriptionLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 15,
    marginBottom: 6,
  },
  description: {fontSize: 14, lineHeight: 21, color: colors.text},
  button: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  undoButton: {backgroundColor: colors.orange},
  buttonText: {fontSize: 14, color: '#FFFFFF', fontWeight: '800'},
});

export default AssignmentDetailScreen;

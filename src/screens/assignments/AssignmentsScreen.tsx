import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AssignmentsStackParamList, Assignment} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {useSync} from '../../context/SyncContext';
import {AssignmentItem} from '../../components/AssignmentItem';
import {
  Card,
  EmptyState,
  ErrorState,
  LastUpdatedText,
  LoadingState,
  OfflineBanner,
  PageTitle,
  Screen,
  SyncNotificationBanner,
} from '../../components/common';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<
  AssignmentsStackParamList,
  'Assignments'
>;
type Filter = 'all' | 'pending' | 'completed';

const filters: {key: Filter; label: string}[] = [
  {key: 'all', label: 'Tất cả'},
  {key: 'pending', label: 'Cần làm'},
  {key: 'completed', label: 'Hoàn thành'},
];

export function AssignmentsScreen({navigation}: Props): React.JSX.Element {
  const {
    assignments,
    subjects,
    isLoading,
    isRefreshing,
    isError,
    errorMessage,
    lastUpdated,
    refreshAll,
    toggleAssignment,
  } = useAppContext();

  const {hasPendingSync} = useSync();
  const [filter, setFilter] = useState<Filter>('all');

  const subjectById = useMemo(
    () => new Map(subjects.map(subject => [subject.id, subject])),
    [subjects],
  );

  const visibleAssignments = useMemo(
    () =>
      assignments
        .filter(assignment => {
          if (filter === 'pending') {
            return !assignment.completed;
          }
          if (filter === 'completed') {
            return assignment.completed;
          }
          return true;
        })
        .sort(
          (first, second) =>
            new Date(first.dueAt).getTime() - new Date(second.dueAt).getTime(),
        ),
    [assignments, filter],
  );

  if (isLoading && assignments.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <LoadingState message="Đang tải danh sách bài tập..." />
      </Screen>
    );
  }

  if (isError && assignments.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <ErrorState
          title="Không thể tải bài tập"
          message={errorMessage}
          onRetry={refreshAll}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <OfflineBanner />
      <SyncNotificationBanner />
      <PageTitle
        title="Bài tập"
        subtitle={`${assignments.filter(item => !item.completed).length} bài tập đang chờ bạn`}
        rightAction={
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('AddAssignment')}
            style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Thêm mới</Text>
          </Pressable>
        }
      />
      <LastUpdatedText timestamp={lastUpdated} />

      <View style={styles.filters}>
        {filters.map(item => (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{selected: filter === item.key}}
            onPress={() => setFilter(item.key)}
            style={[
              styles.filter,
              filter === item.key ? styles.selectedFilter : undefined,
            ]}>
            <Text
              style={[
                styles.filterLabel,
                filter === item.key ? styles.selectedLabel : undefined,
              ]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={visibleAssignments}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.list,
          visibleAssignments.length === 0 ? styles.emptyList : undefined,
        ]}
        ListEmptyComponent={
          <Card>
            <EmptyState
              title="Không có bài tập ở mục này"
              message="Hãy chọn bộ lọc khác hoặc nhấn '+ Thêm mới' để tạo bài tập."
            />
          </Card>
        }
        renderItem={({item}: {item: Assignment}) => {
          const subject = subjectById.get(item.subjectId);
          return (
            <AssignmentItem
              assignment={item}
              subject={subject}
              isPendingSync={hasPendingSync(item.id)}
              onPress={() =>
                navigation.navigate('AssignmentDetail', {
                  id: item.id,
                })
              }
              onToggle={() => toggleAssignment(item.id)}
            />
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#EBEDF4',
  },
  filter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  selectedFilter: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  filterLabel: {fontSize: 12, color: colors.muted, fontWeight: '600'},
  selectedLabel: {color: colors.primary, fontWeight: '800'},
  list: {paddingHorizontal: 20, paddingBottom: 24},
  emptyList: {flexGrow: 1, justifyContent: 'center'},
});

export default AssignmentsScreen;

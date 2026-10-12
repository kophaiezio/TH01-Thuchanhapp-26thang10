import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AssignmentsStackParamList, Assignment} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {AssignmentItem} from '../../components/AssignmentItem';
import {Card, EmptyState, PageTitle, Screen} from '../../components/common';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<AssignmentsStackParamList, 'Assignments'>;
type Filter = 'all' | 'pending' | 'completed';

const filters: {key: Filter; label: string}[] = [
  {key: 'all', label: 'Tất cả'},
  {key: 'pending', label: 'Cần làm'},
  {key: 'completed', label: 'Hoàn thành'},
];

function AssignmentsScreen({navigation}: Props): React.JSX.Element {
  const {assignments, subjects, toggleAssignment} = useAppContext();
  const [filter, setFilter] = useState<Filter>('all');
  const subjectById = new Map(subjects.map(subject => [subject.id, subject]));
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

  return (
    <Screen>
      <PageTitle
        title="Bài tập"
        subtitle={`${assignments.filter(item => !item.completed).length} bài đang chờ bạn`}
      />
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
        contentContainerStyle={[
          styles.list,
          visibleAssignments.length === 0 ? styles.emptyList : undefined,
        ]}
        ListEmptyComponent={
          <Card>
            <EmptyState
              title="Không có bài tập ở mục này"
              message="Hãy chọn một bộ lọc khác để xem danh sách của bạn."
            />
          </Card>
        }
        renderItem={({item}: {item: Assignment}) => {
          const subject = subjectById.get(item.subjectId);
          if (!subject) {
            return null;
          }
          return (
            <AssignmentItem
              assignment={item}
              subject={subject}
              onPress={() =>
                navigation.navigate('AssignmentDetail', {
                  assignmentId: item.id,
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
  filters: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 4,
    borderRadius: 15,
    backgroundColor: '#EBEDF4',
  },
  filter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 12,
  },
  selectedFilter: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  filterLabel: {fontSize: 11, color: colors.muted, fontWeight: '600'},
  selectedLabel: {color: colors.primary, fontWeight: '800'},
  list: {paddingHorizontal: 20, paddingBottom: 20},
  emptyList: {flexGrow: 1, justifyContent: 'center'},
});

export default AssignmentsScreen;

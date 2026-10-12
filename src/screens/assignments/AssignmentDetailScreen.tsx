import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {
  AssignmentsStackParamList,
  HomeStackParamList,
} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {formatDueDate} from '../../components/AssignmentItem';
import {Card, EmptyState, InfoRow, Screen, StatusBadge} from '../../components/common';
import {colors} from '../../theme';

type Props =
  | NativeStackScreenProps<AssignmentsStackParamList, 'AssignmentDetail'>
  | NativeStackScreenProps<HomeStackParamList, 'AssignmentDetail'>;

function AssignmentDetailScreen({route}: Props): React.JSX.Element {
  const {assignments, subjects, toggleAssignment} = useAppContext();
  const assignment = assignments.find(item => item.id === route.params.assignmentId);
  const subject = subjects.find(item => item.id === assignment?.subjectId);

  if (!assignment || !subject) {
    return (
      <Screen>
        <EmptyState
          title="Không tìm thấy bài tập"
          message="Bài tập này có thể đã được gỡ khỏi danh sách."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.title}>{assignment.title}</Text>
          <Text style={styles.subject}>{subject.code} · {subject.name}</Text>
          <StatusBadge completed={assignment.completed} />
        </Card>
        <Card>
          <InfoRow label="Môn học" value={subject.name} />
          <InfoRow label="Hạn nộp" value={formatDueDate(assignment.dueAt)} />
          <Text style={styles.descriptionLabel}>Yêu cầu bài tập</Text>
          <Text style={styles.description}>{assignment.description}</Text>
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
  subject: {fontSize: 13, color: colors.primary, marginTop: 7, marginBottom: 14},
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
    marginTop: 2,
  },
  undoButton: {backgroundColor: colors.orange},
  buttonText: {fontSize: 14, color: '#FFFFFF', fontWeight: '800'},
});

export default AssignmentDetailScreen;

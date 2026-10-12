import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList, SubjectsStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {Card, EmptyState, InfoRow, Screen} from '../../components/common';
import {colors} from '../../theme';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'SubjectDetail'>
  | NativeStackScreenProps<SubjectsStackParamList, 'SubjectDetail'>;

function SubjectDetailScreen({route}: Props): React.JSX.Element {
  const {subjectId} = route.params;
  const {subjects, schedule, assignments} = useAppContext();
  const subject = subjects.find(item => item.id === subjectId);

  if (!subject) {
    return (
      <Screen>
        <EmptyState
          title="Không tìm thấy môn học"
          message="Môn học này có thể đã được gỡ khỏi danh sách."
        />
      </Screen>
    );
  }

  const classCount = schedule.filter(item => item.subjectId === subject.id).length;
  const assignmentCount = assignments.filter(
    item => item.subjectId === subject.id,
  ).length;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={[styles.codeTile, {backgroundColor: `${subject.color}20`}]}>
            <Text style={[styles.code, {color: subject.color}]}>
              {subject.code}
            </Text>
          </View>
          <Text style={styles.name}>{subject.name}</Text>
          <Text style={styles.description}>{subject.description}</Text>
        </Card>
        <Card>
          <InfoRow label="Mã môn học" value={subject.code} />
          <InfoRow label="Số tín chỉ" value={`${subject.credits} tín chỉ`} />
          <InfoRow label="Phòng học" value={subject.room} />
          <InfoRow label="Số buổi học mỗi tuần" value={`${classCount} buổi`} />
          <InfoRow label="Bài tập" value={`${assignmentCount} bài`} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {padding: 20},
  hero: {alignItems: 'center', paddingVertical: 24},
  codeTile: {
    minWidth: 78,
    height: 58,
    paddingHorizontal: 12,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {fontSize: 17, fontWeight: '800'},
  name: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 16,
  },
  description: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SubjectDetailScreen;

import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList, SubjectsStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {useCachedSubject} from '../../hooks/useCachedSubject';
import {
  Card,
  EmptyState,
  ErrorState,
  InfoRow,
  LastUpdatedText,
  LoadingState,
  OfflineBanner,
  Screen,
} from '../../components/common';
import {colors} from '../../theme';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'SubjectDetail'>
  | NativeStackScreenProps<SubjectsStackParamList, 'SubjectDetail'>;

export function SubjectDetailScreen({route}: Props): React.JSX.Element {
  const {id: subjectId} = route.params;

  const {subjects, schedule, assignments} = useAppContext();

  const contextSubject = subjects.find(s => s.id === subjectId);

  const {
    data: subject,
    isLoading,
    isRefreshing,
    isError,
    error,
    lastUpdated,
    refetch,
  } = useCachedSubject(subjectId, contextSubject);

  if (isLoading && !subject) {
    return (
      <Screen>
        <OfflineBanner />
        <LoadingState message="Đang tải chi tiết môn học..." />
      </Screen>
    );
  }

  if (isError && !subject) {
    return (
      <Screen>
        <OfflineBanner />
        <ErrorState
          title="Không thể tải môn học"
          message={error}
          onRetry={refetch}
        />
      </Screen>
    );
  }

  if (!subject) {
    return (
      <Screen>
        <OfflineBanner />
        <EmptyState
          title="Không tìm thấy môn học"
          message="Môn học này có thể không tồn tại hoặc đã bị xóa."
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
        <Card style={styles.hero}>
          <View
            style={[
              styles.codeTile,
              {backgroundColor: `${subject.color || colors.primary}20`},
            ]}>
            <Text
              style={[
                styles.code,
                {color: subject.color || colors.primary},
              ]}>
              {subject.code}
            </Text>
          </View>
          <Text style={styles.name}>{subject.name}</Text>
          <Text style={styles.description}>{subject.description}</Text>
        </Card>

        <Card>
          <InfoRow label="Mã môn học" value={subject.code} />
          <InfoRow label="Số tín chỉ" value={`${subject.credits} tín chỉ`} />
          <InfoRow label="Phòng học mặc định" value={subject.room} />
          <InfoRow label="Số buổi học trong tuần" value={`${classCount} buổi`} />
          <InfoRow label="Số bài tập được giao" value={`${assignmentCount} bài`} />
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

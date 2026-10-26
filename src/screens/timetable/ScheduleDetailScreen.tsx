import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ScheduleStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {useCachedSession} from '../../hooks/useCachedSession';
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

type Props = NativeStackScreenProps<
  ScheduleStackParamList,
  'ScheduleDetail'
>;

export function ScheduleDetailScreen({route}: Props): React.JSX.Element {
  const {id: sessionId} = route.params;

  const {schedule, subjects} = useAppContext();

  const contextSession = schedule.find(item => item.id === sessionId);

  const {
    data: session,
    isLoading,
    isRefreshing,
    isError,
    error,
    lastUpdated,
    refetch,
  } = useCachedSession(sessionId, contextSession);

  const subject = subjects.find(item => item.id === session?.subjectId);

  if (isLoading && !session) {
    return (
      <Screen>
        <OfflineBanner />
        <LoadingState message="Đang tải chi tiết buổi học..." />
      </Screen>
    );
  }

  if (isError && !session) {
    return (
      <Screen>
        <OfflineBanner />
        <ErrorState
          title="Không thể tải buổi học"
          message={error}
          onRetry={refetch}
        />
      </Screen>
    );
  }

  if (!session) {
    return (
      <Screen>
        <OfflineBanner />
        <EmptyState
          title="Không tìm thấy buổi học"
          message="Buổi học này có thể đã được gỡ khỏi thời khóa biểu."
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
        <Card style={styles.hero}>
          <Text style={styles.day}>{session.day}</Text>
          <Text style={styles.name}>{subject?.name || 'Môn học'}</Text>
          <Text style={styles.code}>{subject?.code || ''}</Text>
        </Card>
        <Card>
          <InfoRow
            label="Thời gian"
            value={`${session.startTime} – ${session.endTime}`}
          />
          <InfoRow label="Phòng học" value={`Phòng ${session.room}`} />
          <InfoRow
            label="Nội dung bài học"
            value={session.topic || 'Theo đề cương chi tiết'}
          />
          <InfoRow
            label="Số tín chỉ"
            value={subject ? `${subject.credits} tín chỉ` : '3 tín chỉ'}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {padding: 20},
  hero: {alignItems: 'center', paddingVertical: 24},
  day: {fontSize: 13, fontWeight: '700', color: colors.primary},
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 10,
  },
  code: {fontSize: 13, color: colors.muted, marginTop: 5},
});

export default ScheduleDetailScreen;

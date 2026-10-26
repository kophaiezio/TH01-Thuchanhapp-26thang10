import React, {useMemo} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ScheduleStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {
  Card,
  EmptyState,
  ErrorState,
  LastUpdatedText,
  LoadingState,
  OfflineBanner,
  PageTitle,
  Screen,
  SectionTitle,
  SyncNotificationBanner,
} from '../../components/common';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'Schedule'>;

const weekDayOrder = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

export function ScheduleScreen({navigation}: Props): React.JSX.Element {
  const {
    schedule,
    subjects,
    isLoading,
    isRefreshing,
    isError,
    errorMessage,
    lastUpdated,
    refreshAll,
  } = useAppContext();

  const subjectById = useMemo(
    () => new Map(subjects.map(subject => [subject.id, subject])),
    [subjects],
  );

  const sortedSchedule = useMemo(
    () =>
      [...schedule].sort(
        (first, second) =>
          weekDayOrder.indexOf(first.day) - weekDayOrder.indexOf(second.day) ||
          first.startTime.localeCompare(second.startTime),
      ),
    [schedule],
  );

  const days = useMemo(
    () =>
      weekDayOrder.filter(day =>
        sortedSchedule.some(session => session.day === day),
      ),
    [sortedSchedule],
  );

  if (isLoading && schedule.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <LoadingState message="Đang tải thời khóa biểu..." />
      </Screen>
    );
  }

  if (isError && schedule.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <ErrorState
          title="Không thể tải lịch học"
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
        title="Thời khóa biểu"
        subtitle="Lịch học trong tuần của bạn"
      />
      <LastUpdatedText timestamp={lastUpdated} />

      <FlatList
        data={days}
        keyExtractor={item => item}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card>
            <EmptyState
              title="Chưa có buổi học"
              message="Thời khóa biểu của bạn sẽ xuất hiện tại đây khi đồng bộ."
            />
          </Card>
        }
        renderItem={({item: day}) => {
          const sessions = sortedSchedule.filter(
            session => session.day === day,
          );
          return (
            <View style={styles.dayGroup}>
              <SectionTitle title={day} />
              {sessions.map(session => {
                const subject = subjectById.get(session.subjectId);
                const color = subject?.color || colors.primary;
                return (
                  <Pressable
                    key={session.id}
                    accessibilityRole="button"
                    onPress={() =>
                      navigation.navigate('ScheduleDetail', {
                        id: session.id,
                      })
                    }>
                    <Card style={styles.session}>
                      <View
                        style={[styles.timeBar, {backgroundColor: color}]}
                      />
                      <View style={styles.time}>
                        <Text style={styles.timeStart}>{session.startTime}</Text>
                        <Text style={styles.timeEnd}>{session.endTime}</Text>
                      </View>
                      <View style={styles.details}>
                        <Text style={styles.name}>
                          {subject?.name || 'Môn học'}
                        </Text>
                        <Text style={styles.meta}>
                          Phòng {session.room} · {subject?.code || ''}
                        </Text>
                      </View>
                      <Text style={styles.arrow}>›</Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {paddingHorizontal: 20, paddingBottom: 24, paddingTop: 4},
  dayGroup: {marginBottom: 10},
  session: {flexDirection: 'row', alignItems: 'center', padding: 13},
  timeBar: {width: 4, height: 46, borderRadius: 3, marginRight: 12},
  time: {width: 56},
  timeStart: {fontSize: 13, fontWeight: '800', color: colors.text},
  timeEnd: {fontSize: 11, color: colors.muted, marginTop: 4},
  details: {flex: 1},
  name: {fontSize: 13, fontWeight: '700', color: colors.text},
  meta: {fontSize: 11, color: colors.muted, marginTop: 5},
  arrow: {fontSize: 22, color: colors.muted, marginLeft: 6},
});

export default ScheduleScreen;

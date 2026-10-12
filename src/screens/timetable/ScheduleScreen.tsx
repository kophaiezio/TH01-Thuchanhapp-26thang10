import React, {useMemo} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ScheduleStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {Card, EmptyState, PageTitle, Screen, SectionTitle} from '../../components/common';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'Schedule'>;

const weekDayOrder = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];

function ScheduleScreen({navigation}: Props): React.JSX.Element {
  const {schedule, subjects} = useAppContext();
  const subjectById = new Map(subjects.map(subject => [subject.id, subject]));
  const sortedSchedule = useMemo(
    () =>
      [...schedule].sort(
        (first, second) =>
          weekDayOrder.indexOf(first.day) - weekDayOrder.indexOf(second.day) ||
          first.startTime.localeCompare(second.startTime),
      ),
    [schedule],
  );
  const days = weekDayOrder.filter(day =>
    sortedSchedule.some(session => session.day === day),
  );

  return (
    <Screen>
      <PageTitle title="Thời khóa biểu" subtitle="Lịch học trong tuần của bạn" />
      <FlatList
        data={days}
        keyExtractor={item => item}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card>
            <EmptyState
              title="Chưa có buổi học"
              message="Thời khóa biểu của bạn sẽ xuất hiện tại đây."
            />
          </Card>
        }
        renderItem={({item: day}) => {
          const sessions = sortedSchedule.filter(session => session.day === day);
          return (
            <View>
              <SectionTitle title={day} />
              {sessions.map(session => {
                const subject = subjectById.get(session.subjectId);
                if (!subject) {
                  return null;
                }
                return (
                  <Pressable
                    key={session.id}
                    accessibilityRole="button"
                    onPress={() =>
                      navigation.navigate('ScheduleDetail', {
                        sessionId: session.id,
                      })
                    }>
                    <Card style={styles.session}>
                      <View style={[styles.timeBar, {backgroundColor: subject.color}]} />
                      <View style={styles.time}>
                        <Text style={styles.timeStart}>{session.startTime}</Text>
                        <Text style={styles.timeEnd}>{session.endTime}</Text>
                      </View>
                      <View style={styles.details}>
                        <Text style={styles.name}>{subject.name}</Text>
                        <Text style={styles.meta}>
                          {session.room} · {subject.code}
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
  list: {paddingHorizontal: 20, paddingBottom: 20, paddingTop: 2},
  session: {flexDirection: 'row', alignItems: 'center', padding: 13},
  timeBar: {width: 4, height: 46, borderRadius: 3, marginRight: 12},
  time: {width: 54},
  timeStart: {fontSize: 13, fontWeight: '800', color: colors.text},
  timeEnd: {fontSize: 11, color: colors.muted, marginTop: 4},
  details: {flex: 1},
  name: {fontSize: 13, fontWeight: '700', color: colors.text},
  meta: {fontSize: 11, color: colors.muted, marginTop: 5},
  arrow: {fontSize: 23, color: colors.muted, marginLeft: 6},
});

export default ScheduleScreen;

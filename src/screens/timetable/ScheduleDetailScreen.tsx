import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ScheduleStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {Card, EmptyState, InfoRow, Screen} from '../../components/common';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'ScheduleDetail'>;

function ScheduleDetailScreen({route}: Props): React.JSX.Element {
  const {schedule, subjects} = useAppContext();
  const session = schedule.find(item => item.id === route.params.sessionId);
  const subject = subjects.find(item => item.id === session?.subjectId);

  if (!session || !subject) {
    return (
      <Screen>
        <EmptyState
          title="Không tìm thấy buổi học"
          message="Buổi học này có thể đã được gỡ khỏi thời khóa biểu."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <Text style={styles.day}>{session.day}</Text>
          <Text style={styles.name}>{subject.name}</Text>
          <Text style={styles.code}>{subject.code}</Text>
        </Card>
        <Card>
          <InfoRow
            label="Thời gian"
            value={`${session.startTime} – ${session.endTime}`}
          />
          <InfoRow label="Phòng học" value={session.room} />
          <InfoRow label="Nội dung buổi học" value={session.topic} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {padding: 20},
  hero: {alignItems: 'center', paddingVertical: 26},
  day: {fontSize: 13, fontWeight: '700', color: colors.primary},
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 10,
  },
  code: {fontSize: 13, color: colors.muted, marginTop: 6},
});

export default ScheduleDetailScreen;

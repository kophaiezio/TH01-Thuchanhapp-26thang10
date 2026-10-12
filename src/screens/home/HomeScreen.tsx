import React, {useMemo} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {AssignmentItem} from '../../components/AssignmentItem';
import {Card, EmptyState, PageTitle, Screen, SectionTitle} from '../../components/common';
import {SubjectCard} from '../../components/SubjectCard';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

function HomeScreen({navigation}: Props): React.JSX.Element {
  const {student, subjects, assignments, toggleAssignment} = useAppContext();
  const upcomingAssignments = useMemo(
    () =>
      assignments
        .filter(assignment => !assignment.completed)
        .sort(
          (first, second) =>
            new Date(first.dueAt).getTime() - new Date(second.dueAt).getTime(),
        )
        .slice(0, 4),
    [assignments],
  );
  const subjectById = new Map(subjects.map(subject => [subject.id, subject]));

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <PageTitle title="Tổng quan" subtitle="Chào buổi học tốt lành ✨" />

        <Card style={styles.welcome}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.welcomeDetails}>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.name}>{student.fullName}</Text>
            <Text style={styles.studentId}>Mã sinh viên · {student.studentId}</Text>
          </View>
          <Text style={styles.sparkle}>✦</Text>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{subjects.length}</Text>
            <Text style={styles.statLabel}>Môn học kỳ này</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, {color: colors.orange}]}>
              {assignments.filter(item => !item.completed).length}
            </Text>
            <Text style={styles.statLabel}>Bài tập cần làm</Text>
          </Card>
        </View>

        <SectionTitle
          title="Môn học của tôi"
          actionLabel="Tất cả →"
          onAction={() => navigation.getParent()?.navigate('SubjectsTab')}
        />
        {subjects.length ? (
          subjects.slice(0, 3).map(item => (
            <SubjectCard
              key={item.id}
              subject={item}
              onPress={() =>
                navigation.navigate('SubjectDetail', {subjectId: item.id})
              }
            />
          ))
        ) : (
          <Card>
            <EmptyState title="Chưa có môn học" message="Môn học của bạn sẽ xuất hiện tại đây." />
          </Card>
        )}

        <SectionTitle title="Bài tập sắp đến hạn" />
        {upcomingAssignments.length ? (
          upcomingAssignments.map(item => {
            const subject = subjectById.get(item.subjectId);
            if (!subject) {
              return null;
            }
            return (
              <AssignmentItem
                key={item.id}
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
          })
        ) : (
          <Card>
            <EmptyState title="Bạn đã hoàn thành hết!" message="Hiện không có bài tập nào sắp đến hạn." />
          </Card>
        )}

        <Pressable
          style={styles.weekCard}
          onPress={() => navigation.getParent()?.navigate('ScheduleTab')}>
          <Text style={styles.weekIcon}>▦</Text>
          <View style={styles.weekDetails}>
            <Text style={styles.weekTitle}>Thời khóa biểu tuần này</Text>
            <Text style={styles.weekSubtitle}>Xem lịch học và phòng học của bạn</Text>
          </View>
          <Text style={styles.weekArrow}>›</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {paddingHorizontal: 20, paddingBottom: 24},
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    paddingVertical: 18,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {fontSize: 21, fontWeight: '800', color: colors.primary},
  welcomeDetails: {flex: 1},
  greeting: {fontSize: 12, color: '#DDE2FF'},
  name: {fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginTop: 2},
  studentId: {fontSize: 11, color: '#E2E5FF', marginTop: 4},
  sparkle: {fontSize: 22, color: '#FFE6A8', marginLeft: 8},
  statsRow: {flexDirection: 'row', gap: 10, marginTop: 2, marginBottom: 12},
  statCard: {flex: 1, alignItems: 'center', paddingVertical: 15},
  statValue: {fontSize: 23, fontWeight: '800', color: colors.primary},
  statLabel: {fontSize: 11, color: colors.muted, marginTop: 4},
  weekCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 18,
    marginTop: 2,
  },
  weekIcon: {fontSize: 24, color: colors.primary, marginRight: 12},
  weekDetails: {flex: 1},
  weekTitle: {fontWeight: '700', color: colors.text, fontSize: 14},
  weekSubtitle: {fontSize: 11, color: colors.muted, marginTop: 4},
  weekArrow: {fontSize: 24, color: colors.primary},
});

export default HomeScreen;

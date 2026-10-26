import React, {useMemo} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {useSync} from '../../context/SyncContext';
import {
  Card,
  InfoRow,
  LastUpdatedText,
  OfflineBanner,
  PageTitle,
  Screen,
  SectionTitle,
  SyncBadge,
  SyncNotificationBanner,
} from '../../components/common';
import {colors} from '../../theme';
import {calculateAcademicSummary, formatGpa} from '../../utils/academic';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export function ProfileScreen({navigation}: Props): React.JSX.Element {
  const {student, grades, subjects, lastUpdated, isRefreshing, refreshAll} =
    useAppContext();
  const {hasPendingSync} = useSync();

  const isProfilePending = hasPendingSync(student.id);

  // Tính GPA và tổng tín chỉ tích lũy (không tính môn điểm F)
  const academicSummary = useMemo(
    () => ({
      ...calculateAcademicSummary(grades, subjects),
      count: grades.length,
    }),
    [grades, subjects],
  );

  return (
    <Screen>
      <OfflineBanner />
      <SyncNotificationBanner />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }>
        <PageTitle title="Cá nhân" subtitle="Thông tin sinh viên & Học tập" />
        <LastUpdatedText timestamp={lastUpdated} />

        <Card style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
            </Text>
          </View>
          <Text style={styles.name}>{student.fullName}</Text>
          <Text style={styles.studentId}>{student.studentId}</Text>
          {isProfilePending ? (
            <View style={styles.pendingBadgeWrap}>
              <SyncBadge label="Hồ sơ chưa đồng bộ" />
            </View>
          ) : null}
        </Card>

        {/* Section Kết quả học tập */}
        <SectionTitle
          title="Kết quả học tập"
          actionLabel="Bảng điểm chi tiết →"
          onAction={() => navigation.navigate('Grades')}
        />
        <Card style={styles.academicCard}>
          <View style={styles.academicRow}>
            <View style={styles.academicCol}>
              <Text style={styles.academicValue}>
                {formatGpa(academicSummary.gpa)}
              </Text>
              <Text style={styles.academicLabel}>GPA Hệ 4</Text>
            </View>
            <View style={styles.academicDivider} />
            <View style={styles.academicCol}>
              <Text style={[styles.academicValue, {color: colors.green}]}>
                {academicSummary.earnedCredits}
              </Text>
              <Text style={styles.academicLabel}>Tín chỉ tích lũy (loại F)</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Grades')}
            style={styles.viewGradesBtn}>
            <Text style={styles.viewGradesText}>
              Xem chi tiết {academicSummary.count} môn đã có điểm ›
            </Text>
          </Pressable>
        </Card>

        <SectionTitle title="Thông tin cá nhân" />
        <Card>
          <InfoRow label="Mã sinh viên" value={student.studentId} />
          <InfoRow label="Họ và tên" value={student.fullName} />
          <InfoRow label="Lớp" value={student.className} />
          <InfoRow label="Ngành học" value={student.major} />
          <InfoRow label="Email" value={student.email} />
          <InfoRow label="Số điện thoại" value={student.phone} />
        </Card>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.button}>
          <Text style={styles.buttonText}>✎  Chỉnh sửa thông tin</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {paddingHorizontal: 20, paddingBottom: 24},
  identity: {alignItems: 'center', paddingVertical: 20},
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 30, color: colors.primary, fontWeight: '800'},
  name: {fontSize: 19, color: colors.text, fontWeight: '800', marginTop: 12},
  studentId: {fontSize: 13, color: colors.muted, marginTop: 4},
  pendingBadgeWrap: {marginTop: 8},
  academicCard: {padding: 14, marginBottom: 16},
  academicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  academicCol: {alignItems: 'center', flex: 1},
  academicValue: {fontSize: 22, fontWeight: '800', color: colors.primary},
  academicLabel: {fontSize: 11, color: colors.muted, marginTop: 3},
  academicDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  viewGradesBtn: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  viewGradesText: {fontSize: 12, fontWeight: '700', color: colors.primary},
  button: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  buttonText: {fontSize: 14, color: '#FFFFFF', fontWeight: '800'},
});

export default ProfileScreen;

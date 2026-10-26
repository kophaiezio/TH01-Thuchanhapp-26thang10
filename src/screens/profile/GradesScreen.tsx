import React, {useMemo} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import type {Grade, Subject} from '../../types';
import {calculateAcademicSummary, formatGpa} from '../../utils/academic';

export function GradesScreen(): React.JSX.Element {
  const {
    grades,
    subjects,
    isLoading,
    isRefreshing,
    isError,
    errorMessage,
    lastUpdated,
    refreshAll,
  } = useAppContext();

  const subjectMap = useMemo(() => {
    return new Map<string, Subject>(subjects.map(s => [s.id, s]));
  }, [subjects]);

  // Nhóm điểm theo từng học kỳ
  const semesterGroups = useMemo(() => {
    const groups: Record<string, Grade[]> = {};
    for (const g of grades) {
      if (!groups[g.semester]) {
        groups[g.semester] = [];
      }
      groups[g.semester].push(g);
    }
    return Object.entries(groups).map(([semester, list]) => ({
      semester,
      grades: list,
    }));
  }, [grades]);

  // Tính GPA toàn khóa và tổng tín chỉ tích lũy (không tính môn điểm F)
  const cumulativeStats = useMemo(
    () => calculateAcademicSummary(grades, subjects),
    [grades, subjects],
  );

  if (isLoading && grades.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <LoadingState message="Đang tải kết quả học tập..." />
      </Screen>
    );
  }

  if (isError && grades.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <ErrorState
          title="Không thể tải bảng điểm"
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
        title="Kết quả học tập"
        subtitle="Bảng điểm theo học kỳ & GPA hệ 4"
      />
      <LastUpdatedText timestamp={lastUpdated} />

      <FlatList
        data={semesterGroups}
        keyExtractor={item => item.semester}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatGpa(cumulativeStats.gpa)}
              </Text>
              <Text style={styles.statLabel}>GPA Hệ 4</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, {color: colors.green}]}>
                {cumulativeStats.earnedCredits}
              </Text>
              <Text style={styles.statLabel}>Tín chỉ tích lũy (không môn F)</Text>
            </Card>
          </View>
        }
        ListEmptyComponent={
          <Card>
            <EmptyState
              title="Chưa có điểm thi"
              message="Điểm các học kỳ của bạn sẽ xuất hiện tại đây khi phòng đào tạo cập nhật."
            />
          </Card>
        }
        renderItem={({item}) => {
          // Tính GPA riêng của học kỳ này
          let semWeighted = 0;
          let semCredits = 0;
          let semEarned = 0;
          for (const g of item.grades) {
            const cr = subjectMap.get(g.courseId)?.credits || 3;
            semWeighted += g.score4 * cr;
            semCredits += cr;
            if (g.score4 > 0 && g.letterGrade !== 'F') {
              semEarned += cr;
            }
          }
          const semGpa = formatGpa(
            semCredits > 0 ? semWeighted / semCredits : 0,
          );

          return (
            <View style={styles.semesterSection}>
              <SectionTitle
                title={item.semester}
                actionLabel={`GPA: ${semGpa} · ${semEarned} TC`}
              />
              <Card style={styles.semesterCard}>
                {item.grades.map((grade, index) => {
                  const subject = subjectMap.get(grade.courseId);
                  const isFail =
                    grade.score4 === 0 || grade.letterGrade === 'F';
                  return (
                    <View
                      key={grade.id}
                      style={[
                        styles.gradeRow,
                        index < item.grades.length - 1 && styles.borderBottom,
                      ]}>
                      <View style={styles.gradeLeft}>
                        <Text style={styles.subjectName}>
                          {subject?.name || grade.courseId}
                        </Text>
                        <Text style={styles.subjectMeta}>
                          {subject?.code || ''} · {subject?.credits || 3} tín chỉ
                        </Text>
                      </View>
                      <View style={styles.gradeRight}>
                        <View
                          style={[
                            styles.scoreBadge,
                            isFail
                              ? styles.scoreBadgeFail
                              : styles.scoreBadgePass,
                          ]}>
                          <Text
                            style={[
                              styles.scoreText,
                              isFail
                                ? styles.scoreTextFail
                                : styles.scoreTextPass,
                            ]}>
                            {grade.letterGrade}
                          </Text>
                        </View>
                        <Text style={styles.score4Text}>
                          {grade.score4.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </Card>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {paddingHorizontal: 20, paddingBottom: 24},
  statsRow: {flexDirection: 'row', gap: 10, marginBottom: 12},
  statCard: {flex: 1, alignItems: 'center', paddingVertical: 14},
  statValue: {fontSize: 24, fontWeight: '800', color: colors.primary},
  statLabel: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  semesterSection: {marginBottom: 14},
  semesterCard: {padding: 12},
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  gradeLeft: {flex: 1, paddingRight: 10},
  subjectName: {fontSize: 13, fontWeight: '700', color: colors.text},
  subjectMeta: {fontSize: 11, color: colors.muted, marginTop: 3},
  gradeRight: {alignItems: 'center', minWidth: 44},
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadgePass: {backgroundColor: colors.greenLight},
  scoreBadgeFail: {backgroundColor: colors.orangeLight},
  scoreText: {fontSize: 12, fontWeight: '800'},
  scoreTextPass: {color: colors.green},
  scoreTextFail: {color: colors.orange},
  score4Text: {fontSize: 11, color: colors.muted, marginTop: 2, fontWeight: '600'},
});

export default GradesScreen;

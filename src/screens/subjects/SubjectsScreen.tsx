import React, {useMemo, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SubjectsStackParamList} from '../../types';
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
  SyncNotificationBanner,
} from '../../components/common';
import {SubjectCard} from '../../components/SubjectCard';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<SubjectsStackParamList, 'Subjects'>;

export function SubjectsScreen({navigation}: Props): React.JSX.Element {
  const {
    subjects,
    isLoading,
    isRefreshing,
    isError,
    errorMessage,
    lastUpdated,
    refreshAll,
  } = useAppContext();

  const [query, setQuery] = useState('');

  const filteredSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) {
      return subjects;
    }
    return subjects.filter(subject =>
      subject.name.toLocaleLowerCase().includes(normalizedQuery) ||
      subject.code.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [query, subjects]);

  if (isLoading && subjects.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <LoadingState message="Đang tải danh sách môn học..." />
      </Screen>
    );
  }

  if (isError && subjects.length === 0) {
    return (
      <Screen>
        <OfflineBanner />
        <ErrorState
          title="Không thể tải danh sách môn học"
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
        title="Môn học"
        subtitle={`${subjects.length} môn trong học kỳ này`}
      />
      <LastUpdatedText timestamp={lastUpdated} />

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm môn học theo tên hoặc mã môn..."
          placeholderTextColor={colors.muted}
          accessibilityLabel="Tìm môn học"
          returnKeyType="search"
          style={styles.search}
        />
      </View>

      <FlatList
        data={filteredSubjects}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.list,
          filteredSubjects.length === 0 ? styles.emptyList : undefined,
        ]}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Card>
            <EmptyState
              title={subjects.length ? 'Không tìm thấy môn học' : 'Chưa có môn học'}
              message={
                subjects.length
                  ? `Không có môn nào khớp với từ khóa "${query}".`
                  : 'Danh sách môn học sẽ xuất hiện tại đây khi đồng bộ.'
              }
            />
          </Card>
        }
        renderItem={({item}) => (
          <SubjectCard
            subject={item}
            onPress={() =>
              navigation.navigate('SubjectDetail', {id: item.id})
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {paddingHorizontal: 20, marginBottom: 10},
  search: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  list: {paddingHorizontal: 20, paddingBottom: 20},
  emptyList: {flexGrow: 1, justifyContent: 'center'},
});

export default SubjectsScreen;

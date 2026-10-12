import React, {useMemo, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SubjectsStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {Card, EmptyState, PageTitle, Screen} from '../../components/common';
import {SubjectCard} from '../../components/SubjectCard';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<SubjectsStackParamList, 'Subjects'>;

function SubjectsScreen({navigation}: Props): React.JSX.Element {
  const {subjects} = useAppContext();
  const [query, setQuery] = useState('');
  const filteredSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return subjects.filter(subject =>
      subject.name.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [query, subjects]);

  return (
    <Screen>
      <PageTitle title="Môn học" subtitle={`${subjects.length} môn trong học kỳ này`} />
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm môn học theo tên..."
          placeholderTextColor={colors.muted}
          accessibilityLabel="Tìm môn học theo tên"
          returnKeyType="search"
          style={styles.search}
        />
      </View>
      <FlatList
        data={filteredSubjects}
        keyExtractor={item => item.id}
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
                  ? 'Thử tìm bằng một tên môn học khác nhé.'
                  : 'Môn học được thêm vào sẽ hiển thị tại đây.'
              }
            />
          </Card>
        }
        renderItem={({item}) => (
          <SubjectCard
            subject={item}
            onPress={() =>
              navigation.navigate('SubjectDetail', {subjectId: item.id})
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {paddingHorizontal: 20, marginBottom: 8},
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

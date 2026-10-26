import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AssignmentsStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {Card, OfflineBanner, Screen, SyncNotificationBanner} from '../../components/common';
import {FormField} from '../../components/FormField';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<
  AssignmentsStackParamList,
  'AddAssignment'
>;

export function AddAssignmentScreen({navigation}: Props): React.JSX.Element {
  const {subjects, addAssignment} = useAppContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || '',
  );
  const [daysDue, setDaysDue] = useState<number>(3);
  const [errors, setErrors] = useState<{title?: string; subject?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOptions = [
    {label: 'Ngày mai (1 ngày)', days: 1},
    {label: '3 ngày nữa', days: 3},
    {label: '1 tuần nữa', days: 7},
    {label: '2 tuần nữa', days: 14},
  ];

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const newErrors: {title?: string; subject?: string} = {};

    if (!trimmedTitle) {
      newErrors.title = 'Vui lòng nhập tên bài tập.';
    }
    if (!selectedSubjectId) {
      newErrors.subject = 'Vui lòng chọn môn học.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysDue);
    dueDate.setHours(23, 59, 0, 0);

    setIsSubmitting(true);
    const success = await addAssignment({
      title: trimmedTitle,
      description: description.trim(),
      subjectId: selectedSubjectId,
      dueAt: dueDate.toISOString(),
      completed: false,
    });
    setIsSubmitting(false);

    if (success) {
      Alert.alert('Thành công', 'Đã thêm bài tập mới vào danh sách.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  };

  return (
    <Screen>
      <OfflineBanner />
      <SyncNotificationBanner />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>
          <Text style={styles.intro}>
            Điền thông tin bài tập mới. Bài tập sẽ được lưu và tự động đồng bộ khi có mạng.
          </Text>

          <Card>
            <FormField
              label="Tên bài tập *"
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (errors.title) {
                  setErrors(prev => ({...prev, title: undefined}));
                }
              }}
              placeholder="VD: Làm bài tập lớn React Native"
              error={errors.title}
            />

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Môn học *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.subjectList}
                contentContainerStyle={styles.subjectListContent}>
                {subjects.map(s => {
                  const isSelected = selectedSubjectId === s.id;
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => setSelectedSubjectId(s.id)}
                      style={[
                        styles.subjectChip,
                        isSelected && {
                          backgroundColor: s.color,
                          borderColor: s.color,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.subjectChipText,
                          isSelected && styles.subjectChipTextActive,
                        ]}>
                        {s.code} · {s.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              {errors.subject ? (
                <Text style={styles.errorText}>{errors.subject}</Text>
              ) : null}
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Hạn nộp</Text>
              <View style={styles.dueChips}>
                {daysOptions.map(opt => {
                  const isSelected = daysDue === opt.days;
                  return (
                    <Pressable
                      key={opt.days}
                      onPress={() => setDaysDue(opt.days)}
                      style={[
                        styles.dueChip,
                        isSelected && styles.dueChipActive,
                      ]}>
                      <Text
                        style={[
                          styles.dueChipText,
                          isSelected && styles.dueChipTextActive,
                        ]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Mô tả / Yêu cầu</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Nhập ghi chú yêu cầu bài tập..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />
            </View>
          </Card>

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleSave}
            style={[styles.saveBtn, isSubmitting && styles.saveBtnDisabled]}>
            <Text style={styles.saveBtnText}>
              {isSubmitting ? 'Đang lưu...' : '+  Thêm bài tập'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  content: {padding: 20, paddingBottom: 35},
  intro: {fontSize: 13, color: colors.muted, marginBottom: 14},
  fieldWrap: {marginBottom: 16},
  label: {fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 8},
  subjectList: {flexDirection: 'row', marginTop: 2},
  subjectListContent: {gap: 8, paddingBottom: 4},
  subjectChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F0F2F6',
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectChipText: {fontSize: 12, fontWeight: '600', color: colors.text},
  subjectChipTextActive: {color: '#FFFFFF', fontWeight: '800'},
  dueChips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  dueChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F0F2F6',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dueChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dueChipText: {fontSize: 12, color: colors.text, fontWeight: '600'},
  dueChipTextActive: {color: '#FFFFFF', fontWeight: '800'},
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {fontSize: 11, color: colors.orange, marginTop: 4},
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnDisabled: {opacity: 0.6},
  saveBtnText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800'},
});

export default AddAssignmentScreen;

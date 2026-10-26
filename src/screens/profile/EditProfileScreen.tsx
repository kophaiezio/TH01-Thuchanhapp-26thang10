import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../types';
import {FormField} from '../../components/FormField';
import {Card, OfflineBanner, Screen} from '../../components/common';
import {useAppContext} from '../../context/AppContext';
import {colors} from '../../theme';
import {
  validateProfile,
  type ProfileFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({navigation}: Props): React.JSX.Element {
  const {student, updateProfile} = useAppContext();
  const [fullName, setFullName] = useState(student.fullName);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFullName(student.fullName);
    setEmail(student.email);
    setPhone(student.phone);
  }, [student.email, student.fullName, student.phone]);

  async function handleSave(): Promise<void> {
    const profile = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };
    const validationErrors = validateProfile(profile);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    const success = await updateProfile(profile);
    setIsSaving(false);

    if (success) {
      Alert.alert(
        'Đã lưu',
        'Thông tin cá nhân đã được cập nhật (sẽ tự động đồng bộ khi có mạng).',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    }
  }

  return (
    <Screen>
      <OfflineBanner />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>
          <Text style={styles.intro}>
            Cập nhật những thông tin bạn muốn thay đổi bên dưới.
          </Text>
          <Card>
            <FormField
              label="Họ và tên *"
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors(prev => ({...prev, fullName: undefined}));
                }
              }}
              placeholder="Nguyễn Văn A"
              autoCapitalize="words"
              error={errors.fullName}
            />
            <FormField
              label="Email *"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({...prev, email: undefined}));
                }
              }}
              placeholder="ten@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />
            <FormField
              label="Số điện thoại *"
              value={phone}
              onChangeText={text => {
                setPhone(text);
                if (errors.phone) {
                  setErrors(prev => ({...prev, phone: undefined}));
                }
              }}
              placeholder="0912345678"
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </Card>
          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={handleSave}
            style={[styles.button, isSaving && styles.buttonDisabled]}>
            <Text style={styles.buttonText}>
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  content: {paddingHorizontal: 20, paddingBottom: 24},
  intro: {fontSize: 13, color: colors.muted, marginBottom: 12},
  button: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  buttonDisabled: {opacity: 0.6},
  buttonText: {fontSize: 14, color: '#FFFFFF', fontWeight: '800'},
});

export default EditProfileScreen;

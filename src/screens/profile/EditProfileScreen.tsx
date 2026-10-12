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
import {Card, Screen} from '../../components/common';
import {useAppContext} from '../../context/AppContext';
import {colors} from '../../theme';
import {
  validateProfile,
  type ProfileFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

function EditProfileScreen({navigation}: Props): React.JSX.Element {
  const {student, updateProfile} = useAppContext();
  const [fullName, setFullName] = useState(student.fullName);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  useEffect(() => {
    setFullName(student.fullName);
    setEmail(student.email);
    setPhone(student.phone);
  }, [student.email, student.fullName, student.phone]);

  function handleSave(): void {
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

    updateProfile(profile);
    Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật.', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  }

  return (
    <Screen>
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
              label="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nguyễn Văn A"
              autoCapitalize="words"
              error={errors.fullName}
            />
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="ten@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />
            <FormField
              label="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              placeholder="0912345678"
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </Card>
          <Pressable
            accessibilityRole="button"
            onPress={handleSave}
            style={styles.button}>
            <Text style={styles.buttonText}>Lưu thay đổi</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  content: {padding: 20, paddingBottom: 30},
  intro: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 14,
  },
  button: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  buttonText: {fontSize: 14, color: '#FFFFFF', fontWeight: '800'},
});

export default EditProfileScreen;

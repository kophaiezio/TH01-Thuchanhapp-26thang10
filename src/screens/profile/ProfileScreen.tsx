import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../types';
import {useAppContext} from '../../context/AppContext';
import {Card, InfoRow, PageTitle, Screen} from '../../components/common';
import {colors} from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

function ProfileScreen({navigation}: Props): React.JSX.Element {
  const {student} = useAppContext();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <PageTitle title="Cá nhân" subtitle="Thông tin sinh viên" />
        <Card style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{student.fullName}</Text>
          <Text style={styles.studentId}>{student.studentId}</Text>
        </Card>
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
  identity: {alignItems: 'center', paddingVertical: 22},
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 30, color: colors.primary, fontWeight: '800'},
  name: {fontSize: 19, color: colors.text, fontWeight: '800', marginTop: 12},
  studentId: {fontSize: 13, color: colors.muted, marginTop: 4},
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

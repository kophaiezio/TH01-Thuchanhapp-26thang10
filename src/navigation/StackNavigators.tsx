import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {
  AssignmentsStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
  ScheduleStackParamList,
  SubjectsStackParamList,
} from '../types';
import HomeScreen from '../screens/home/HomeScreen';
import SubjectDetailScreen from '../screens/subjects/SubjectDetailScreen';
import SubjectsScreen from '../screens/subjects/SubjectsScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentsScreen from '../screens/assignments/AssignmentsScreen';
import ScheduleDetailScreen from '../screens/timetable/ScheduleDetailScreen';
import ScheduleScreen from '../screens/timetable/ScheduleScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import {colors} from '../theme';

const homeStack = createNativeStackNavigator<HomeStackParamList>();
const subjectsStack = createNativeStackNavigator<SubjectsStackParamList>();
const scheduleStack = createNativeStackNavigator<ScheduleStackParamList>();
const assignmentsStack = createNativeStackNavigator<AssignmentsStackParamList>();
const profileStack = createNativeStackNavigator<ProfileStackParamList>();

const stackScreenOptions = {
  headerStyle: {backgroundColor: colors.background},
  headerTintColor: colors.text,
  headerTitleStyle: {fontWeight: '700' as const},
  headerShadowVisible: false,
  headerBackTitle: 'Quay lại',
  contentStyle: {backgroundColor: colors.background},
};

export function HomeStackNavigator(): React.JSX.Element {
  return (
    <homeStack.Navigator screenOptions={stackScreenOptions}>
      <homeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <homeStack.Screen
        name="SubjectDetail"
        component={SubjectDetailScreen}
        options={{title: 'Chi tiết môn học'}}
      />
      <homeStack.Screen
        name="AssignmentDetail"
        component={AssignmentDetailScreen}
        options={{title: 'Chi tiết bài tập'}}
      />
    </homeStack.Navigator>
  );
}

export function SubjectsStackNavigator(): React.JSX.Element {
  return (
    <subjectsStack.Navigator screenOptions={stackScreenOptions}>
      <subjectsStack.Screen
        name="Subjects"
        component={SubjectsScreen}
        options={{headerShown: false}}
      />
      <subjectsStack.Screen
        name="SubjectDetail"
        component={SubjectDetailScreen}
        options={{title: 'Chi tiết môn học'}}
      />
    </subjectsStack.Navigator>
  );
}

export function ScheduleStackNavigator(): React.JSX.Element {
  return (
    <scheduleStack.Navigator screenOptions={stackScreenOptions}>
      <scheduleStack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{headerShown: false}}
      />
      <scheduleStack.Screen
        name="ScheduleDetail"
        component={ScheduleDetailScreen}
        options={{title: 'Chi tiết buổi học'}}
      />
    </scheduleStack.Navigator>
  );
}

export function AssignmentsStackNavigator(): React.JSX.Element {
  return (
    <assignmentsStack.Navigator screenOptions={stackScreenOptions}>
      <assignmentsStack.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{headerShown: false}}
      />
      <assignmentsStack.Screen
        name="AssignmentDetail"
        component={AssignmentDetailScreen}
        options={{title: 'Chi tiết bài tập'}}
      />
    </assignmentsStack.Navigator>
  );
}

export function ProfileStackNavigator(): React.JSX.Element {
  return (
    <profileStack.Navigator screenOptions={stackScreenOptions}>
      <profileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Chỉnh sửa cá nhân'}}
      />
    </profileStack.Navigator>
  );
}

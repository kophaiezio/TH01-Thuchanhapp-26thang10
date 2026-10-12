import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {BottomTabParamList} from '../types';
import {
  AssignmentsStackNavigator,
  HomeStackNavigator,
  ProfileStackNavigator,
  ScheduleStackNavigator,
  SubjectsStackNavigator,
} from './StackNavigators';
import {colors} from '../theme';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabLabels: Record<keyof BottomTabParamList, string> = {
  HomeTab: 'Tổng quan',
  SubjectsTab: 'Môn học',
  ScheduleTab: 'Thời khóa biểu',
  AssignmentsTab: 'Bài tập',
  ProfileTab: 'Cá nhân',
};

const tabIcons: Record<keyof BottomTabParamList, string> = {
  HomeTab: '⌂',
  SubjectsTab: '▤',
  ScheduleTab: '▦',
  AssignmentsTab: '✓',
  ProfileTab: '●',
};

function getTabIconElement({
  routeName,
  color,
  size,
  focused,
}: {
  routeName: keyof BottomTabParamList;
  color: string;
  size: number;
  focused: boolean;
}): React.ReactNode {
  return React.createElement(
    Text,
    {
      style: {
        color,
        fontSize: focused ? size : size - 1,
        fontWeight: focused ? '800' : '500',
      },
    },
    tabIcons[routeName],
  );
}

function BottomTabNavigator(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabel: tabLabels[route.name],
        tabBarLabelStyle: {fontSize: 9, fontWeight: '600', marginBottom: 3},
        tabBarIcon: ({color, size, focused}) =>
          getTabIconElement({routeName: route.name, color, size, focused}),
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 5,
          paddingBottom: insets.bottom + 4,
          borderTopColor: colors.border,
          backgroundColor: '#FFFFFF',
        },
      })}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="SubjectsTab" component={SubjectsStackNavigator} />
      <Tab.Screen name="ScheduleTab" component={ScheduleStackNavigator} />
      <Tab.Screen name="AssignmentsTab" component={AssignmentsStackNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;

export type Student = {
  studentId: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  credits: number;
  room: string;
  color: string;
  description: string;
};

export type ScheduleSession = {
  id: string;
  subjectId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  topic: string;
};

export type Assignment = {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueAt: string;
  completed: boolean;
};

export type HomeStackParamList = {
  Home: undefined;
  SubjectDetail: {subjectId: string};
  AssignmentDetail: {assignmentId: string};
};

export type SubjectsStackParamList = {
  Subjects: undefined;
  SubjectDetail: {subjectId: string};
};

export type ScheduleStackParamList = {
  Schedule: undefined;
  ScheduleDetail: {sessionId: string};
};

export type AssignmentsStackParamList = {
  Assignments: undefined;
  AssignmentDetail: {assignmentId: string};
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  SubjectsTab: undefined;
  ScheduleTab: undefined;
  AssignmentsTab: undefined;
  ProfileTab: undefined;
};

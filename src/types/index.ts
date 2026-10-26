export type Student = {
  id: string;
  studentId: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  credits: number;
  room: string;
  color: string;
  description: string;
  updatedAt: string;
};

export type ScheduleSession = {
  id: string;
  subjectId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  topic: string;
  updatedAt: string;
};

export type Assignment = {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueAt: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Grade = {
  id: string;
  studentId: string;
  courseId: string;
  semester: string;
  score4: number;
  letterGrade: string;
  updatedAt: string;
};

export type ApiResource =
  | 'students'
  | 'courses'
  | 'sessions'
  | 'assignments'
  | 'grades';

export type OutboxOperation = {
  id: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  resource: ApiResource;
  entityId: string;
  payload: Record<string, unknown>;
  updatedAt: string;
  createdAt?: string;
};

export type HomeStackParamList = {
  Home: undefined;
  SubjectDetail: {id: string};
  AssignmentDetail: {id: string};
};

export type SubjectsStackParamList = {
  Subjects: undefined;
  SubjectDetail: {id: string};
};

export type ScheduleStackParamList = {
  Schedule: undefined;
  ScheduleDetail: {id: string};
};

export type AssignmentsStackParamList = {
  Assignments: undefined;
  AssignmentDetail: {id: string};
  AddAssignment: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Grades: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  SubjectsTab: undefined;
  ScheduleTab: undefined;
  AssignmentsTab: undefined;
  ProfileTab: undefined;
};

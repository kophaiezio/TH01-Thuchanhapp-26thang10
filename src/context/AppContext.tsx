import React, {createContext, useContext, useMemo, useState} from 'react';
import {
  initialAssignments,
  initialSchedule,
  initialStudent,
  initialSubjects,
} from '../data/sampleData';
import type {Assignment, ScheduleSession, Student, Subject} from '../types';
import type {ProfileForm} from '../utils/validation';

type AppContextValue = {
  student: Student;
  subjects: Subject[];
  schedule: ScheduleSession[];
  assignments: Assignment[];
  toggleAssignment: (assignmentId: string) => void;
  updateProfile: (profile: ProfileForm) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({children}: React.PropsWithChildren): React.JSX.Element {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [schedule] = useState<ScheduleSession[]>(initialSchedule);
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);

  const value = useMemo<AppContextValue>(
    () => ({
      student,
      subjects,
      schedule,
      assignments,
      toggleAssignment: assignmentId => {
        setAssignments(current =>
          current.map(assignment =>
            assignment.id === assignmentId
              ? {...assignment, completed: !assignment.completed}
              : assignment,
          ),
        );
      },
      updateProfile: profile => {
        setStudent(current => ({
          ...current,
          fullName: profile.fullName.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
        }));
      },
    }),
    [assignments, schedule, student, subjects],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext phải được dùng bên trong AppProvider.');
  }
  return context;
}

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert} from 'react-native';
import {assignmentService} from '../api/assignmentService';
import {courseService} from '../api/courseService';
import {gradeService} from '../api/gradeService';
import {sessionService} from '../api/sessionService';
import {studentService} from '../api/studentService';
import {formatLastUpdated, readCache, writeCache} from '../storage/cache';
import type {
  Assignment,
  Grade,
  ScheduleSession,
  Student,
  Subject,
} from '../types';
import type {ProfileForm} from '../utils/validation';
import {useSync} from './SyncContext';

export type AppDataContextValue = {
  student: Student;
  subjects: Subject[];
  schedule: ScheduleSession[];
  assignments: Assignment[];
  grades: Grade[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  errorMessage: string | null;
  lastUpdated: string | null;
  refreshAll: () => Promise<void>;
  toggleAssignment: (assignmentId: string) => Promise<boolean>;
  addAssignment: (
    data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<boolean>;
  updateProfile: (profile: ProfileForm) => Promise<boolean>;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const emptyStudent: Student = {
  id: '',
  studentId: '',
  fullName: '',
  className: '',
  major: '',
  email: '',
  phone: '',
  updatedAt: '',
};

export function AppDataProvider({
  children,
}: React.PropsWithChildren): React.JSX.Element {
  const {isOnline, queueOperation, syncRevision} = useSync();

  const [student, setStudent] = useState<Student>(emptyStudent);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedule, setSchedule] = useState<ScheduleSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rawUpdatedAt, setRawUpdatedAt] = useState<string | null>(null);

  const isOnlineRef = useRef(isOnline);
  isOnlineRef.current = isOnline;

  // 1. Tải cache cục bộ trước (Cache-first)
  const loadFromCache = useCallback(async (): Promise<boolean> => {
    const [
      cachedStudent,
      cachedCourses,
      cachedSessions,
      cachedAssignments,
      cachedGrades,
    ] = await Promise.all([
      readCache<Student>('student_current'),
      readCache<Subject[]>('courses'),
      readCache<ScheduleSession[]>('sessions'),
      readCache<Assignment[]>('assignments'),
      readCache<Grade[]>('grades'),
    ]);

    if (cachedStudent) {
      setStudent(cachedStudent.data);
    }

    if (cachedCourses) {
      setSubjects(cachedCourses.data);
    }
    if (cachedSessions) {
      setSchedule(cachedSessions.data);
    }
    if (cachedAssignments) {
      setAssignments(cachedAssignments.data);
    }
    if (cachedGrades) {
      setGrades(cachedGrades.data);
    }

    const newestTimestamp = [
      cachedStudent?.updatedAt,
      cachedCourses?.updatedAt,
      cachedSessions?.updatedAt,
      cachedAssignments?.updatedAt,
      cachedGrades?.updatedAt,
    ]
      .filter((timestamp): timestamp is string => Boolean(timestamp))
      .sort()
      .pop();

    if (newestTimestamp) {
      setRawUpdatedAt(newestTimestamp);
    }

    return Boolean(
      cachedStudent ||
        cachedCourses ||
        cachedSessions ||
        cachedAssignments ||
        cachedGrades,
    );
  }, []);

  // 2. Fetch toàn bộ dữ liệu mới nhất từ REST API
  const fetchFromServer = useCallback(async () => {
    const [
      studentsRes,
      coursesRes,
      sessionsRes,
      assignmentsRes,
      gradesRes,
    ] = await Promise.all([
      studentService.list(),
      courseService.list(),
      sessionService.list(),
      assignmentService.list(),
      gradeService.list(),
    ]);

    const now = new Date().toISOString();
    const current = studentsRes[0];

    if (current) {
      setStudent(current);
      await writeCache(
        'student_current',
        current,
        current.updatedAt || now,
      );
    }

    setSubjects(coursesRes);
    setSchedule(sessionsRes);
    setAssignments(assignmentsRes);
    setGrades(gradesRes);
    await Promise.all([
      writeCache('courses', coursesRes, now),
      writeCache('sessions', sessionsRes, now),
      writeCache('assignments', assignmentsRes, now),
      writeCache('grades', gradesRes, now),
    ]);

    setRawUpdatedAt(now);
    setIsError(false);
    setErrorMessage(null);
  }, []);

  // Khởi chạy ban đầu: đọc cache trước, sau đó gọi mạng
  const initialize = useCallback(async () => {
    setIsLoading(true);
    let hasCache = false;
    try {
      hasCache = await loadFromCache();
    } catch (error) {
      if (!isOnlineRef.current) {
        setIsError(true);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Không thể đọc dữ liệu trong bộ nhớ máy.',
        );
      }
    }

    if (isOnlineRef.current) {
      try {
        await fetchFromServer();
      } catch (error) {
        setIsError(true);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Không thể kết nối đến máy chủ.',
        );
      }
    } else if (!hasCache) {
      setIsError(true);
      setErrorMessage('Đang offline và chưa có dữ liệu trong bộ nhớ đệm.');
    }
    setIsLoading(false);
  }, [fetchFromServer, loadFromCache]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Pull-to-refresh
  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (isOnlineRef.current) {
        await fetchFromServer();
      } else {
        const hasCache = await loadFromCache();
        if (!hasCache) {
          throw new Error(
            'Đang offline và chưa có dữ liệu trong bộ nhớ đệm.',
          );
        }
      }
      setIsError(false);
      setErrorMessage(null);
    } catch (error) {
      setIsError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Không thể tải dữ liệu học tập.',
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFromServer, loadFromCache]);

  const lastSyncRevision = useRef(syncRevision);
  useEffect(() => {
    if (lastSyncRevision.current === syncRevision) {
      return;
    }
    lastSyncRevision.current = syncRevision;
    if (isOnlineRef.current) {
      refreshAll();
    }
  }, [refreshAll, syncRevision]);

  // 3. Cập nhật lạc quan (Optimistic Update) cho Bài tập
  const toggleAssignment = useCallback(
    async (assignmentId: string): Promise<boolean> => {
      const target = assignments.find(item => item.id === assignmentId);
      if (!target) {
        return false;
      }

      const nextCompleted = !target.completed;
      const now = new Date().toISOString();
      const previousAssignments = [...assignments];

      // Optimistic update trên giao diện ngay lập tức
      const updatedAssignments = assignments.map(item =>
        item.id === assignmentId
          ? {...item, completed: nextCompleted, updatedAt: now}
          : item,
      );
      setAssignments(updatedAssignments);
      try {
        await writeCache('assignments', updatedAssignments);
        if (isOnlineRef.current) {
          await assignmentService.patch(assignmentId, {
            completed: nextCompleted,
            updatedAt: now,
          });
        } else {
          await queueOperation({
            id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            method: 'PATCH',
            resource: 'assignments',
            entityId: assignmentId,
            payload: {completed: nextCompleted},
            updatedAt: now,
          });
        }
        return true;
      } catch (error) {
        setAssignments(previousAssignments);
        try {
          await writeCache('assignments', previousAssignments);
        } catch (cacheError) {
          Alert.alert(
            'Không thể lưu thay đổi',
            cacheError instanceof Error
              ? cacheError.message
              : 'Không thể khôi phục dữ liệu trong bộ nhớ máy.',
          );
          return false;
        }
        Alert.alert(
          'Lỗi cập nhật',
          error instanceof Error
            ? `${error.message} Giao diện đã được hoàn tác.`
            : 'Không thể lưu thay đổi. Giao diện đã được hoàn tác.',
        );
        return false;
      }
    },
    [assignments, queueOperation],
  );

  // 4. Cập nhật lạc quan cho Thêm bài tập mới
  const addAssignment = useCallback(
    async (
      data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<boolean> => {
      const now = new Date().toISOString();
      const newId = `assignment-${Date.now()}`;
      const newAssignment: Assignment = {
        ...data,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };

      const previousAssignments = [...assignments];
      const updatedAssignments = [newAssignment, ...assignments];

      setAssignments(updatedAssignments);
      try {
        await writeCache('assignments', updatedAssignments);
        if (isOnlineRef.current) {
          await assignmentService.create(newAssignment);
        } else {
          await queueOperation({
            id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            method: 'POST',
            resource: 'assignments',
            entityId: newId,
            payload: newAssignment,
            updatedAt: now,
          });
        }
        return true;
      } catch (error) {
        setAssignments(previousAssignments);
        try {
          await writeCache('assignments', previousAssignments);
        } catch (cacheError) {
          Alert.alert(
            'Không thể lưu thay đổi',
            cacheError instanceof Error
              ? cacheError.message
              : 'Không thể khôi phục dữ liệu trong bộ nhớ máy.',
          );
          return false;
        }
        Alert.alert(
          'Lỗi thêm bài tập',
          error instanceof Error
            ? error.message
            : 'Không thể thêm bài tập. Dữ liệu đã được hoàn tác.',
        );
        return false;
      }
    },
    [assignments, queueOperation],
  );

  // 5. Cập nhật lạc quan cho Thông tin cá nhân
  const updateProfile = useCallback(
    async (profile: ProfileForm): Promise<boolean> => {
      if (!student.id) {
        Alert.alert('Chưa sẵn sàng', 'Hãy tải thông tin sinh viên trước khi lưu.');
        return false;
      }
      const now = new Date().toISOString();
      const previousStudent = {...student};
      const updatedStudent: Student = {
        ...student,
        fullName: profile.fullName.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        updatedAt: now,
      };

      // Optimistic update
      setStudent(updatedStudent);
      try {
        await writeCache('student_current', updatedStudent);
        if (isOnlineRef.current) {
          await studentService.patch(student.id, {
            fullName: updatedStudent.fullName,
            email: updatedStudent.email,
            phone: updatedStudent.phone,
            updatedAt: now,
          });
        } else {
          await queueOperation({
            id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            method: 'PATCH',
            resource: 'students',
            entityId: student.id,
            payload: {
              fullName: updatedStudent.fullName,
              email: updatedStudent.email,
              phone: updatedStudent.phone,
            },
            updatedAt: now,
          });
        }
        return true;
      } catch (error) {
        setStudent(previousStudent);
        try {
          await writeCache('student_current', previousStudent);
        } catch (cacheError) {
          Alert.alert(
            'Không thể lưu thay đổi',
            cacheError instanceof Error
              ? cacheError.message
              : 'Không thể khôi phục thông tin trong bộ nhớ máy.',
          );
          return false;
        }
        Alert.alert(
          'Lỗi cập nhật',
          error instanceof Error
            ? `${error.message} Giao diện đã được hoàn tác.`
            : 'Không thể lưu thông tin. Giao diện đã được hoàn tác.',
        );
        return false;
      }
    },
    [queueOperation, student],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      student,
      subjects,
      schedule,
      assignments,
      grades,
      isLoading,
      isRefreshing,
      isError,
      errorMessage,
      lastUpdated: formatLastUpdated(rawUpdatedAt),
      refreshAll,
      toggleAssignment,
      addAssignment,
      updateProfile,
    }),
    [
      addAssignment,
      assignments,
      errorMessage,
      grades,
      isError,
      isLoading,
      isRefreshing,
      rawUpdatedAt,
      refreshAll,
      schedule,
      student,
      subjects,
      toggleAssignment,
      updateProfile,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được dùng bên trong AppDataProvider.');
  }
  return context;
}

// Giữ lại useAppContext để hoàn toàn tương thích ngược
export const useAppContext = useAppData;

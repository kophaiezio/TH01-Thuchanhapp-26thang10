import {
  initialAssignments,
  initialSchedule,
  initialSubjects,
} from '../src/data/sampleData';

describe('sample study data', () => {
  test('contains the requested seven subjects in order', () => {
    expect(initialSubjects.map(subject => subject.name)).toEqual([
      'Phân tích nghiệp vụ',
      'Phát triển ứng dụng',
      'Lập trình web nâng cao',
      'Lịch sử Đảng cộng sản Việt Nam',
      'Phát triển phần mềm hướng dịch vụ',
      'Đảm bảo chất lượng phần mềm',
      'Lập trình web',
    ]);
  });

  test('links every assignment and schedule session to an existing subject', () => {
    const subjectIds = new Set(initialSubjects.map(subject => subject.id));

    expect(initialAssignments).toHaveLength(7);
    expect(
      initialAssignments.every(assignment => subjectIds.has(assignment.subjectId)),
    ).toBe(true);
    expect(
      initialSchedule.every(session => subjectIds.has(session.subjectId)),
    ).toBe(true);
  });
});

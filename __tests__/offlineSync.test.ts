import {formatLastUpdated, readCache, writeCache} from '../src/storage/cache';
import {
  clearOutbox,
  enqueueOperation,
  readOutbox,
  removeOutboxOperation,
} from '../src/storage/outbox';
import type {Grade, OutboxOperation, Subject} from '../src/types';
import {calculateAcademicSummary, formatGpa} from '../src/utils/academic';
import {shouldApplyOfflinePatch} from '../src/utils/conflictResolution';
import {request} from '../src/api/client';
import {applyOutboxOperation} from '../src/api/outboxService';

jest.mock('../src/api/client', () => ({
  request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

describe('Storage & Cache logic', () => {
  it('writes and reads from cache correctly', async () => {
    const testData = {foo: 'bar', count: 42};
    await writeCache('test-key', testData, '2026-10-26T10:00:00.000Z');

    const result = await readCache<typeof testData>('test-key');
    expect(result).not.toBeNull();
    expect(result?.data).toEqual(testData);
    expect(result?.updatedAt).toBe('2026-10-26T10:00:00.000Z');
  });

  it('formats last updated date nicely', () => {
    const formatted = formatLastUpdated('2026-10-26T14:30:00.000Z');
    expect(formatted).toMatch(/\d{2}:\d{2}, \d{2}\/\d{2}\/2026/);
  });
});

describe('Outbox Queue logic', () => {
  beforeEach(async () => {
    await clearOutbox();
  });

  it('enqueues and reads operations in FIFO order', async () => {
    const op1: OutboxOperation = {
      id: 'op-1',
      method: 'PATCH',
      resource: 'assignments',
      entityId: 'assign-1',
      payload: {completed: true},
      updatedAt: '2026-10-26T10:00:00.000Z',
    };

    const op2: OutboxOperation = {
      id: 'op-2',
      method: 'POST',
      resource: 'assignments',
      entityId: 'assign-2',
      payload: {title: 'New Assignment'},
      updatedAt: '2026-10-26T10:05:00.000Z',
    };

    await enqueueOperation(op1);
    await enqueueOperation(op2);

    const list = await readOutbox();
    expect(list.length).toBe(2);
    expect(list[0].id).toBe('op-1');
    expect(list[1].id).toBe('op-2');

    await removeOutboxOperation('op-1');
    const remaining = await readOutbox();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe('op-2');
  });
});

describe('Conflict Resolution & GPA Calculation', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it('uses server data only when its updatedAt is later than the queued change', () => {
    expect(
      shouldApplyOfflinePatch(
        '2026-10-26T12:00:00.000Z',
        '2026-10-26T11:00:00.000Z',
      ),
    ).toBe(false);
    expect(
      shouldApplyOfflinePatch(
        '2026-10-26T12:00:00.000Z',
        '2026-10-26T13:00:00.000Z',
      ),
    ).toBe(true);
    expect(shouldApplyOfflinePatch(undefined, 'invalid timestamp')).toBe(true);
  });

  it('keeps a PATCH queued for conflict resolution when server data is newer', async () => {
    mockRequest.mockResolvedValueOnce({
      updatedAt: '2026-10-26T12:00:00.000Z',
    });
    const operation: OutboxOperation = {
      id: 'conflict-op',
      method: 'PATCH',
      resource: 'assignments',
      entityId: 'assignment-1',
      payload: {completed: false},
      updatedAt: '2026-10-26T11:00:00.000Z',
    };

    await applyOutboxOperation(operation);

    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it('PATCHes server with operation timestamp when offline change is newer', async () => {
    mockRequest.mockResolvedValueOnce({
      updatedAt: '2026-10-26T11:00:00.000Z',
    });
    mockRequest.mockResolvedValueOnce({});
    const operation: OutboxOperation = {
      id: 'newer-op',
      method: 'PATCH',
      resource: 'assignments',
      entityId: 'assignment-1',
      payload: {completed: true},
      updatedAt: '2026-10-26T12:00:00.000Z',
    };

    await applyOutboxOperation(operation);

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(mockRequest.mock.calls[1][1]).toMatchObject({
      method: 'PATCH',
      body: JSON.stringify({
        completed: true,
        updatedAt: operation.updatedAt,
      }),
    });
  });

  it('calculates weighted GPA and earned credits excluding F grades', () => {
    const sampleSubjects: Subject[] = [
      {
        id: 'c1',
        code: 'BA201',
        name: 'Môn 1',
        credits: 3,
        room: 'A1',
        color: '#000',
        description: '',
        updatedAt: '',
      },
      {
        id: 'c2',
        code: 'AD202',
        name: 'Môn 2',
        credits: 4,
        room: 'A2',
        color: '#000',
        description: '',
        updatedAt: '',
      },
      {
        id: 'c3',
        code: 'QA301',
        name: 'Môn 3 (rớt F)',
        credits: 3,
        room: 'A3',
        color: '#000',
        description: '',
        updatedAt: '',
      },
    ];

    const sampleGrades: Grade[] = [
      {
        id: 'g1',
        studentId: 's1',
        courseId: 'c1',
        semester: 'HK1',
        score4: 4.0,
        letterGrade: 'A+',
        updatedAt: '',
      },
      {
        id: 'g2',
        studentId: 's1',
        courseId: 'c2',
        semester: 'HK1',
        score4: 3.5,
        letterGrade: 'B+',
        updatedAt: '',
      },
      {
        id: 'g3',
        studentId: 's1',
        courseId: 'c3',
        semester: 'HK1',
        score4: 0.0,
        letterGrade: 'F',
        updatedAt: '',
      },
    ];

    const summary = calculateAcademicSummary(sampleGrades, sampleSubjects);

    // Điểm: (4.0*3 + 3.5*4 + 0.0*3) / (3 + 4 + 3) = (12 + 14 + 0) / 10 = 2.60
    expect(formatGpa(summary.gpa)).toBe('2.60');

    // Tín chỉ tích lũy (loại môn F): 3 + 4 = 7 tín chỉ (môn 3 credits rớt F bị loại)
    expect(summary.earnedCredits).toBe(7);
  });
});

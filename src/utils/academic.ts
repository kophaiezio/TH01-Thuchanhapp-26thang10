import type {Grade, Subject} from '../types';

export type AcademicSummary = {
  gpa: number;
  earnedCredits: number;
};

export function formatGpa(score: number): string {
  return score.toFixed(2);
}

export function calculateAcademicSummary(
  grades: Grade[],
  subjects: Subject[],
): AcademicSummary {
  const creditsByCourse = new Map(
    subjects.map(subject => [subject.id, subject.credits]),
  );
  let weightedScore = 0;
  let totalCredits = 0;
  let earnedCredits = 0;

  for (const grade of grades) {
    const credits = creditsByCourse.get(grade.courseId) ?? 0;
    if (credits <= 0 || !Number.isFinite(grade.score4)) {
      continue;
    }

    weightedScore += grade.score4 * credits;
    totalCredits += credits;
    if (grade.score4 > 0 && grade.letterGrade.toUpperCase() !== 'F') {
      earnedCredits += credits;
    }
  }

  return {
    gpa: totalCredits === 0 ? 0 : weightedScore / totalCredits,
    earnedCredits,
  };
}

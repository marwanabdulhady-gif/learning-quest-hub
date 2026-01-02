import { useState, useEffect, useCallback } from 'react';
import { lessons, Lesson } from '@/data/lessons';
import { badges, Badge } from '@/data/badges';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  COMPLETED_LESSONS: 'mathHub_completedLessons',
  EARNED_BADGES: 'mathHub_earnedBadges',
  TOTAL_POINTS: 'mathHub_totalPoints',
} as const;

export interface GamificationState {
  completedLessons: string[];
  earnedBadges: string[];
  totalPoints: number;
}

export interface GamificationActions {
  completeLesson: (lessonId: string) => { pointsEarned: number; newBadges: Badge[] };
  isLessonCompleted: (lessonId: string) => boolean;
  isBadgeEarned: (badgeId: string) => boolean;
  getCompletedLessonsData: () => Lesson[];
  getEarnedBadgesData: () => Badge[];
  getProgress: () => { completed: number; total: number; percentage: number };
  resetProgress: () => void;
}

function loadFromStorage(): GamificationState {
  try {
    const completedLessons = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS) || '[]'
    ) as string[];
    const earnedBadges = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.EARNED_BADGES) || '[]'
    ) as string[];
    const totalPoints = parseInt(
      localStorage.getItem(STORAGE_KEYS.TOTAL_POINTS) || '0',
      10
    );
    return { completedLessons, earnedBadges, totalPoints };
  } catch {
    return { completedLessons: [], earnedBadges: [], totalPoints: 0 };
  }
}

function saveToStorage(state: GamificationState): void {
  localStorage.setItem(
    STORAGE_KEYS.COMPLETED_LESSONS,
    JSON.stringify(state.completedLessons)
  );
  localStorage.setItem(
    STORAGE_KEYS.EARNED_BADGES,
    JSON.stringify(state.earnedBadges)
  );
  localStorage.setItem(STORAGE_KEYS.TOTAL_POINTS, state.totalPoints.toString());
}

function triggerCelebration(intensity: 'small' | 'medium' | 'large' = 'medium') {
  const configs = {
    small: { particleCount: 30, spread: 40, origin: { y: 0.7 } },
    medium: { particleCount: 80, spread: 70, origin: { y: 0.6 } },
    large: { particleCount: 150, spread: 100, origin: { y: 0.5 } },
  };
  confetti(configs[intensity]);
}

function checkForNewBadges(
  completedLessons: string[],
  earnedBadges: string[],
  totalPoints: number
): Badge[] {
  const newBadges: Badge[] = [];

  for (const badge of badges) {
    if (earnedBadges.includes(badge.id)) continue;

    let earned = false;

    switch (badge.criteria.type) {
      case 'lessons_completed':
        earned = completedLessons.length >= badge.criteria.count;
        break;

      case 'unit_completed': {
        const unitCriteria = badge.criteria;
        const unitLessons = lessons.filter((l) => l.unit === unitCriteria.unit);
        earned = unitLessons.every((l) => completedLessons.includes(l.id));
        break;
      }

      case 'category_completed': {
        const categoryCriteria = badge.criteria;
        const categoryLessons = lessons.filter(
          (l) => l.category === categoryCriteria.category
        );
        const completedInCategory = categoryLessons.filter((l) =>
          completedLessons.includes(l.id)
        );
        earned = completedInCategory.length >= categoryCriteria.count;
        break;
      }

      case 'points_earned':
        earned = totalPoints >= badge.criteria.points;
        break;

      case 'specific_lessons':
        earned = badge.criteria.lessonIds.every((id) =>
          completedLessons.includes(id)
        );
        break;
    }

    if (earned) {
      newBadges.push(badge);
    }
  }

  return newBadges;
}

export function useGamification(): GamificationState & GamificationActions {
  const [state, setState] = useState<GamificationState>(loadFromStorage);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => state.completedLessons.includes(lessonId),
    [state.completedLessons]
  );

  const isBadgeEarned = useCallback(
    (badgeId: string) => state.earnedBadges.includes(badgeId),
    [state.earnedBadges]
  );

  const completeLesson = useCallback(
    (lessonId: string) => {
      if (state.completedLessons.includes(lessonId)) {
        return { pointsEarned: 0, newBadges: [] };
      }

      const lesson = lessons.find((l) => l.id === lessonId);
      if (!lesson) {
        return { pointsEarned: 0, newBadges: [] };
      }

      const pointsEarned = lesson.points;
      const newCompletedLessons = [...state.completedLessons, lessonId];
      const newTotalPoints = state.totalPoints + pointsEarned;

      // Check for new badges
      const newBadges = checkForNewBadges(
        newCompletedLessons,
        state.earnedBadges,
        newTotalPoints
      );
      const newEarnedBadges = [
        ...state.earnedBadges,
        ...newBadges.map((b) => b.id),
      ];

      setState({
        completedLessons: newCompletedLessons,
        earnedBadges: newEarnedBadges,
        totalPoints: newTotalPoints,
      });

      // Trigger celebration
      if (newBadges.length > 0) {
        triggerCelebration('large');
      } else {
        triggerCelebration('small');
      }

      return { pointsEarned, newBadges };
    },
    [state]
  );

  const getCompletedLessonsData = useCallback(
    () => lessons.filter((l) => state.completedLessons.includes(l.id)),
    [state.completedLessons]
  );

  const getEarnedBadgesData = useCallback(
    () => badges.filter((b) => state.earnedBadges.includes(b.id)),
    [state.earnedBadges]
  );

  const getProgress = useCallback(() => {
    const completed = state.completedLessons.length;
    const total = lessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [state.completedLessons]);

  const resetProgress = useCallback(() => {
    setState({ completedLessons: [], earnedBadges: [], totalPoints: 0 });
  }, []);

  return {
    ...state,
    completeLesson,
    isLessonCompleted,
    isBadgeEarned,
    getCompletedLessonsData,
    getEarnedBadgesData,
    getProgress,
    resetProgress,
  };
}

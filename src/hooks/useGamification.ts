import { useState, useEffect, useCallback } from 'react';
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
  completeLesson: (lessonId: string, points?: number) => { pointsEarned: number; newBadges: Badge[] };
  isLessonCompleted: (lessonId: string) => boolean;
  isBadgeEarned: (badgeId: string) => boolean;
  getEarnedBadgesData: () => Badge[];
  getProgress: () => { completed: number; total: number; percentage: number };
  resetProgress: () => void;
  setTotalLessonsCount: (count: number) => void;
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

      case 'points_earned':
        earned = totalPoints >= badge.criteria.points;
        break;

      case 'specific_lessons':
        earned = badge.criteria.lessonIds.every((id) =>
          completedLessons.includes(id)
        );
        break;
        
      // These require content context which we don't have here
      // They'll be handled when content manager provides the lesson data
      case 'unit_completed':
      case 'category_completed':
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
  const [totalLessonsCount, setTotalLessonsCount] = useState(0);

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
    (lessonId: string, points: number = 10) => {
      if (state.completedLessons.includes(lessonId)) {
        return { pointsEarned: 0, newBadges: [] };
      }

      const pointsEarned = points;
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

  const getEarnedBadgesData = useCallback(
    () => badges.filter((b) => state.earnedBadges.includes(b.id)),
    [state.earnedBadges]
  );

  const getProgress = useCallback(() => {
    const completed = state.completedLessons.length;
    const total = totalLessonsCount;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [state.completedLessons, totalLessonsCount]);

  const resetProgress = useCallback(() => {
    setState({ completedLessons: [], earnedBadges: [], totalPoints: 0 });
  }, []);

  return {
    ...state,
    completeLesson,
    isLessonCompleted,
    isBadgeEarned,
    getEarnedBadgesData,
    getProgress,
    resetProgress,
    setTotalLessonsCount,
  };
}

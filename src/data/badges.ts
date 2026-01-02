// Badges & Achievements Data
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'gold' | 'accent' | 'primary' | 'success';
  criteria: BadgeCriteria;
}

export type BadgeCriteria =
  | { type: 'lessons_completed'; count: number }
  | { type: 'unit_completed'; unit: string }
  | { type: 'category_completed'; category: string; count: number }
  | { type: 'points_earned'; points: number }
  | { type: 'specific_lessons'; lessonIds: string[] };

export const badges: Badge[] = [
  // Milestone badges
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first lesson!',
    icon: '👶',
    color: 'primary',
    criteria: { type: 'lessons_completed', count: 1 },
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Complete 5 lessons.',
    icon: '🚀',
    color: 'primary',
    criteria: { type: 'lessons_completed', count: 5 },
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons.',
    icon: '📚',
    color: 'accent',
    criteria: { type: 'lessons_completed', count: 10 },
  },
  {
    id: 'math-champion',
    title: 'Math Champion',
    description: 'Complete 20 lessons.',
    icon: '🏆',
    color: 'gold',
    criteria: { type: 'lessons_completed', count: 20 },
  },

  // Unit completion badges
  {
    id: 'place-value-master',
    title: 'Place Value Master',
    description: 'Complete all Place Value lessons.',
    icon: '🔢',
    color: 'success',
    criteria: { type: 'unit_completed', unit: 'Unit 1: Place Value' },
  },
  {
    id: 'add-sub-expert',
    title: 'Add & Subtract Expert',
    description: 'Complete all Addition & Subtraction lessons.',
    icon: '🧮',
    color: 'success',
    criteria: { type: 'unit_completed', unit: 'Unit 2: Addition & Subtraction' },
  },
  {
    id: 'multiplication-master',
    title: 'Multiplication Master',
    description: 'Complete all Multiplication lessons.',
    icon: '✖️',
    color: 'success',
    criteria: { type: 'unit_completed', unit: 'Unit 3: Multiplication' },
  },
  {
    id: 'division-dynamo',
    title: 'Division Dynamo',
    description: 'Complete all Division lessons.',
    icon: '➗',
    color: 'success',
    criteria: { type: 'unit_completed', unit: 'Unit 4: Division' },
  },
  {
    id: 'fraction-hero',
    title: 'Fraction Hero',
    description: 'Complete all Fraction lessons.',
    icon: '🍕',
    color: 'success',
    criteria: { type: 'unit_completed', unit: 'Unit 5: Fractions' },
  },
  {
    id: 'geometry-genius',
    title: 'Geometry Genius',
    description: 'Complete all Geometry lessons.',
    icon: '📐',
    color: 'success',
    criteria: { type: 'unit_completed', unit: 'Unit 6: Geometry' },
  },

  // Category badges
  {
    id: 'game-enthusiast',
    title: 'Game Enthusiast',
    description: 'Complete 3 math games.',
    icon: '🎮',
    color: 'accent',
    criteria: { type: 'category_completed', category: 'game', count: 3 },
  },
  {
    id: 'practice-pro',
    title: 'Practice Pro',
    description: 'Complete 5 practice activities.',
    icon: '💪',
    color: 'primary',
    criteria: { type: 'category_completed', category: 'practice', count: 5 },
  },
  {
    id: 'project-builder',
    title: 'Project Builder',
    description: 'Complete your first project.',
    icon: '🎨',
    color: 'accent',
    criteria: { type: 'category_completed', category: 'project', count: 1 },
  },

  // Points badges
  {
    id: 'point-collector',
    title: 'Point Collector',
    description: 'Earn 50 points.',
    icon: '⭐',
    color: 'gold',
    criteria: { type: 'points_earned', points: 50 },
  },
  {
    id: 'star-student',
    title: 'Star Student',
    description: 'Earn 150 points.',
    icon: '🌟',
    color: 'gold',
    criteria: { type: 'points_earned', points: 150 },
  },
  {
    id: 'super-star',
    title: 'Super Star',
    description: 'Earn 300 points.',
    icon: '💫',
    color: 'gold',
    criteria: { type: 'points_earned', points: 300 },
  },
];

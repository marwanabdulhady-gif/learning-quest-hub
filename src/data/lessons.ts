// Grade 4 Math Lessons Data
export interface Lesson {
  id: string;
  title: string;
  description: string;
  unit: string;
  category: 'lesson' | 'practice' | 'project' | 'game';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  icon: string;
}

export const lessons: Lesson[] = [
  // Unit 1: Place Value & Number Sense
  {
    id: 'place-value-thousands',
    title: 'Place Value to Thousands',
    description: 'Learn about ones, tens, hundreds, and thousands places.',
    unit: 'Unit 1: Place Value',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '🔢',
  },
  {
    id: 'comparing-numbers',
    title: 'Comparing Large Numbers',
    description: 'Use greater than, less than, and equal to compare numbers.',
    unit: 'Unit 1: Place Value',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '⚖️',
  },
  {
    id: 'rounding-numbers',
    title: 'Rounding to Nearest 10 & 100',
    description: 'Master the art of rounding numbers up and down.',
    unit: 'Unit 1: Place Value',
    category: 'practice',
    difficulty: 'medium',
    points: 15,
    icon: '🎯',
  },
  {
    id: 'number-patterns',
    title: 'Number Patterns Game',
    description: 'Find and continue number patterns in this fun game!',
    unit: 'Unit 1: Place Value',
    category: 'game',
    difficulty: 'easy',
    points: 20,
    icon: '🎮',
  },

  // Unit 2: Addition & Subtraction
  {
    id: 'multi-digit-addition',
    title: 'Multi-Digit Addition',
    description: 'Add numbers with carrying across multiple places.',
    unit: 'Unit 2: Addition & Subtraction',
    category: 'lesson',
    difficulty: 'medium',
    points: 15,
    icon: '➕',
  },
  {
    id: 'multi-digit-subtraction',
    title: 'Multi-Digit Subtraction',
    description: 'Subtract numbers with borrowing across places.',
    unit: 'Unit 2: Addition & Subtraction',
    category: 'lesson',
    difficulty: 'medium',
    points: 15,
    icon: '➖',
  },
  {
    id: 'word-problems-add-sub',
    title: 'Word Problem Challenge',
    description: 'Solve real-world problems using addition and subtraction.',
    unit: 'Unit 2: Addition & Subtraction',
    category: 'practice',
    difficulty: 'hard',
    points: 20,
    icon: '📝',
  },
  {
    id: 'mental-math-race',
    title: 'Mental Math Race',
    description: 'Race against time to solve addition problems!',
    unit: 'Unit 2: Addition & Subtraction',
    category: 'game',
    difficulty: 'medium',
    points: 25,
    icon: '🏎️',
  },

  // Unit 3: Multiplication
  {
    id: 'times-tables-1-5',
    title: 'Times Tables 1-5',
    description: 'Practice multiplication facts for 1 through 5.',
    unit: 'Unit 3: Multiplication',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '✖️',
  },
  {
    id: 'times-tables-6-10',
    title: 'Times Tables 6-10',
    description: 'Master multiplication facts for 6 through 10.',
    unit: 'Unit 3: Multiplication',
    category: 'lesson',
    difficulty: 'medium',
    points: 15,
    icon: '✖️',
  },
  {
    id: 'arrays-multiplication',
    title: 'Arrays & Multiplication',
    description: 'See how arrays help us understand multiplication.',
    unit: 'Unit 3: Multiplication',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '🔲',
  },
  {
    id: 'multiplication-bingo',
    title: 'Multiplication Bingo',
    description: 'Play bingo while practicing your times tables!',
    unit: 'Unit 3: Multiplication',
    category: 'game',
    difficulty: 'medium',
    points: 20,
    icon: '🎲',
  },

  // Unit 4: Division
  {
    id: 'intro-division',
    title: 'Introduction to Division',
    description: 'Learn what division means and how to share equally.',
    unit: 'Unit 4: Division',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '➗',
  },
  {
    id: 'division-facts',
    title: 'Division Facts Practice',
    description: 'Practice division facts and their multiplication connections.',
    unit: 'Unit 4: Division',
    category: 'practice',
    difficulty: 'medium',
    points: 15,
    icon: '📊',
  },
  {
    id: 'remainders',
    title: 'Division with Remainders',
    description: 'Learn what to do when numbers don\'t divide evenly.',
    unit: 'Unit 4: Division',
    category: 'lesson',
    difficulty: 'hard',
    points: 20,
    icon: '🧩',
  },

  // Unit 5: Fractions
  {
    id: 'intro-fractions',
    title: 'Introduction to Fractions',
    description: 'Discover parts of a whole and what fractions mean.',
    unit: 'Unit 5: Fractions',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '🍕',
  },
  {
    id: 'equivalent-fractions',
    title: 'Equivalent Fractions',
    description: 'Find fractions that are equal but look different.',
    unit: 'Unit 5: Fractions',
    category: 'lesson',
    difficulty: 'medium',
    points: 15,
    icon: '🎂',
  },
  {
    id: 'comparing-fractions',
    title: 'Comparing Fractions',
    description: 'Learn which fraction is bigger or smaller.',
    unit: 'Unit 5: Fractions',
    category: 'practice',
    difficulty: 'medium',
    points: 15,
    icon: '📏',
  },
  {
    id: 'fraction-pizza-party',
    title: 'Fraction Pizza Party',
    description: 'Make pizzas and learn fractions at the same time!',
    unit: 'Unit 5: Fractions',
    category: 'game',
    difficulty: 'easy',
    points: 20,
    icon: '🍕',
  },

  // Unit 6: Geometry
  {
    id: 'shapes-properties',
    title: '2D Shapes & Properties',
    description: 'Explore triangles, quadrilaterals, and polygons.',
    unit: 'Unit 6: Geometry',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '📐',
  },
  {
    id: 'perimeter',
    title: 'Perimeter Adventures',
    description: 'Calculate the distance around shapes.',
    unit: 'Unit 6: Geometry',
    category: 'lesson',
    difficulty: 'medium',
    points: 15,
    icon: '🔷',
  },
  {
    id: 'area-rectangles',
    title: 'Area of Rectangles',
    description: 'Find out how much space a shape covers.',
    unit: 'Unit 6: Geometry',
    category: 'lesson',
    difficulty: 'medium',
    points: 15,
    icon: '⬛',
  },
  {
    id: 'geometry-builder',
    title: 'Shape Builder Project',
    description: 'Create your own geometric art project!',
    unit: 'Unit 6: Geometry',
    category: 'project',
    difficulty: 'hard',
    points: 30,
    icon: '🎨',
  },
];

export const units = [...new Set(lessons.map((l) => l.unit))];
export const categories = ['lesson', 'practice', 'project', 'game'] as const;

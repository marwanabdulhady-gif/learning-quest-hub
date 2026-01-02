import { useState, useEffect, useCallback } from 'react';
import { lessons as defaultLessons, type Lesson } from '@/data/lessons';

export interface Unit {
  id: string;
  name: string;
  order: number;
}

export interface ManagedLesson extends Lesson {
  htmlContent?: string;
}

const LESSONS_KEY = 'math-hub-lessons';
const UNITS_KEY = 'math-hub-units';

// Extract default units from lessons
const extractDefaultUnits = (): Unit[] => {
  const unitNames = [...new Set(defaultLessons.map((l) => l.unit))];
  return unitNames.map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name,
    order: index,
  }));
};

export function useContentManager() {
  const [lessons, setLessons] = useState<ManagedLesson[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedLessons = localStorage.getItem(LESSONS_KEY);
    const storedUnits = localStorage.getItem(UNITS_KEY);

    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    } else {
      setLessons(defaultLessons);
    }

    if (storedUnits) {
      setUnits(JSON.parse(storedUnits));
    } else {
      setUnits(extractDefaultUnits());
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
    }
  }, [lessons, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(UNITS_KEY, JSON.stringify(units));
    }
  }, [units, isLoaded]);

  // Unit CRUD
  const addUnit = useCallback((name: string) => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      name,
      order: units.length,
    };
    setUnits((prev) => [...prev, newUnit]);
    return newUnit;
  }, [units.length]);

  const updateUnit = useCallback((id: string, name: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, name } : u))
    );
    // Also update all lessons with this unit
    setLessons((prev) =>
      prev.map((l) => {
        const unit = units.find((u) => u.id === id);
        if (unit && l.unit === unit.name) {
          return { ...l, unit: name };
        }
        return l;
      })
    );
  }, [units]);

  const deleteUnit = useCallback((id: string) => {
    const unit = units.find((u) => u.id === id);
    if (unit) {
      // Remove all lessons in this unit
      setLessons((prev) => prev.filter((l) => l.unit !== unit.name));
    }
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }, [units]);

  const reorderUnits = useCallback((reorderedUnits: Unit[]) => {
    setUnits(reorderedUnits.map((u, i) => ({ ...u, order: i })));
  }, []);

  // Lesson CRUD
  const addLesson = useCallback((lesson: Omit<ManagedLesson, 'id'>) => {
    const newLesson: ManagedLesson = {
      ...lesson,
      id: `lesson-${Date.now()}`,
    };
    setLessons((prev) => [...prev, newLesson]);
    return newLesson;
  }, []);

  const updateLesson = useCallback((id: string, updates: Partial<ManagedLesson>) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  }, []);

  const deleteLesson = useCallback((id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const getLessonsByUnit = useCallback(
    (unitName: string) => lessons.filter((l) => l.unit === unitName),
    [lessons]
  );

  const getUnitNames = useCallback(() => units.map((u) => u.name), [units]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setLessons(defaultLessons);
    setUnits(extractDefaultUnits());
    localStorage.removeItem(LESSONS_KEY);
    localStorage.removeItem(UNITS_KEY);
  }, []);

  return {
    lessons,
    units,
    isLoaded,
    // Unit operations
    addUnit,
    updateUnit,
    deleteUnit,
    reorderUnits,
    getUnitNames,
    // Lesson operations
    addLesson,
    updateLesson,
    deleteLesson,
    getLessonsByUnit,
    // Reset
    resetToDefaults,
  };
}

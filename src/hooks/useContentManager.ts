import { useState, useEffect, useCallback } from 'react';
import { lessons as defaultLessons, type Lesson } from '@/data/lessons';

export interface Year {
  id: string;
  name: string;
  order: number;
}

export interface Unit {
  id: string;
  name: string;
  yearId: string;
  order: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  unitId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  icon: string;
  htmlContent?: string;
  order: number;
}

export interface ManagedLesson extends ContentItem {
  type: 'lesson';
}

export interface Practice extends ContentItem {
  type: 'practice';
}

export interface Project extends ContentItem {
  type: 'project';
}

export interface Game extends ContentItem {
  type: 'game';
}

export type ContentType = ManagedLesson | Practice | Project | Game;

// Storage keys
const YEARS_KEY = 'math-hub-years';
const UNITS_KEY = 'math-hub-units';
const LESSONS_KEY = 'math-hub-lessons';
const PRACTICES_KEY = 'math-hub-practices';
const PROJECTS_KEY = 'math-hub-projects';
const GAMES_KEY = 'math-hub-games';

// For backwards compatibility with old lesson format
interface LegacyLesson extends Lesson {
  htmlContent?: string;
}

// Extract defaults from old lesson data
const createDefaultData = () => {
  const defaultYear: Year = { id: 'year-4', name: 'Grade 4', order: 0 };
  
  const unitMap = new Map<string, Unit>();
  defaultLessons.forEach((lesson, index) => {
    if (!unitMap.has(lesson.unit)) {
      unitMap.set(lesson.unit, {
        id: `unit-${unitMap.size}`,
        name: lesson.unit,
        yearId: defaultYear.id,
        order: unitMap.size,
      });
    }
  });
  
  const defaultUnits = Array.from(unitMap.values());
  
  const defaultLessonItems: ManagedLesson[] = [];
  const defaultPractices: Practice[] = [];
  const defaultProjects: Project[] = [];
  const defaultGames: Game[] = [];
  
  defaultLessons.forEach((lesson, index) => {
    const unit = unitMap.get(lesson.unit)!;
    const baseItem = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      unitId: unit.id,
      difficulty: lesson.difficulty,
      points: lesson.points,
      icon: lesson.icon,
      order: index,
    };
    
    switch (lesson.category) {
      case 'lesson':
        defaultLessonItems.push({ ...baseItem, type: 'lesson' });
        break;
      case 'practice':
        defaultPractices.push({ ...baseItem, type: 'practice' });
        break;
      case 'project':
        defaultProjects.push({ ...baseItem, type: 'project' });
        break;
      case 'game':
        defaultGames.push({ ...baseItem, type: 'game' });
        break;
    }
  });
  
  return {
    years: [defaultYear],
    units: defaultUnits,
    lessons: defaultLessonItems,
    practices: defaultPractices,
    projects: defaultProjects,
    games: defaultGames,
  };
};

export function useContentManager() {
  const [years, setYears] = useState<Year[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<ManagedLesson[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const storedYears = localStorage.getItem(YEARS_KEY);
    const storedUnits = localStorage.getItem(UNITS_KEY);
    const storedLessons = localStorage.getItem(LESSONS_KEY);
    const storedPractices = localStorage.getItem(PRACTICES_KEY);
    const storedProjects = localStorage.getItem(PROJECTS_KEY);
    const storedGames = localStorage.getItem(GAMES_KEY);

    if (storedYears && storedUnits) {
      setYears(JSON.parse(storedYears));
      setUnits(JSON.parse(storedUnits));
      setLessons(storedLessons ? JSON.parse(storedLessons) : []);
      setPractices(storedPractices ? JSON.parse(storedPractices) : []);
      setProjects(storedProjects ? JSON.parse(storedProjects) : []);
      setGames(storedGames ? JSON.parse(storedGames) : []);
      
      const parsedYears = JSON.parse(storedYears) as Year[];
      if (parsedYears.length > 0) {
        setSelectedYearId(parsedYears[0].id);
      }
    } else {
      const defaults = createDefaultData();
      setYears(defaults.years);
      setUnits(defaults.units);
      setLessons(defaults.lessons);
      setPractices(defaults.practices);
      setProjects(defaults.projects);
      setGames(defaults.games);
      setSelectedYearId(defaults.years[0]?.id || null);
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(YEARS_KEY, JSON.stringify(years));
      localStorage.setItem(UNITS_KEY, JSON.stringify(units));
      localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
      localStorage.setItem(PRACTICES_KEY, JSON.stringify(practices));
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    }
  }, [years, units, lessons, practices, projects, games, isLoaded]);

  // Year CRUD
  const addYear = useCallback((name: string) => {
    const newYear: Year = {
      id: `year-${Date.now()}`,
      name,
      order: years.length,
    };
    setYears((prev) => [...prev, newYear]);
    return newYear;
  }, [years.length]);

  const updateYear = useCallback((id: string, name: string) => {
    setYears((prev) => prev.map((y) => (y.id === id ? { ...y, name } : y)));
  }, []);

  const deleteYear = useCallback((id: string) => {
    const unitIds = units.filter((u) => u.yearId === id).map((u) => u.id);
    setLessons((prev) => prev.filter((l) => !unitIds.includes(l.unitId)));
    setPractices((prev) => prev.filter((p) => !unitIds.includes(p.unitId)));
    setProjects((prev) => prev.filter((p) => !unitIds.includes(p.unitId)));
    setGames((prev) => prev.filter((g) => !unitIds.includes(g.unitId)));
    setUnits((prev) => prev.filter((u) => u.yearId !== id));
    setYears((prev) => prev.filter((y) => y.id !== id));
  }, [units]);

  const reorderYears = useCallback((reordered: Year[]) => {
    setYears(reordered.map((y, i) => ({ ...y, order: i })));
  }, []);

  // Unit CRUD
  const addUnit = useCallback((name: string, yearId: string) => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      name,
      yearId,
      order: units.filter((u) => u.yearId === yearId).length,
    };
    setUnits((prev) => [...prev, newUnit]);
    return newUnit;
  }, [units]);

  const updateUnit = useCallback((id: string, updates: Partial<Omit<Unit, 'id'>>) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  }, []);

  const deleteUnit = useCallback((id: string) => {
    setLessons((prev) => prev.filter((l) => l.unitId !== id));
    setPractices((prev) => prev.filter((p) => p.unitId !== id));
    setProjects((prev) => prev.filter((p) => p.unitId !== id));
    setGames((prev) => prev.filter((g) => g.unitId !== id));
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const reorderUnits = useCallback((reordered: Unit[]) => {
    setUnits(reordered.map((u, i) => ({ ...u, order: i })));
  }, []);

  const getUnitsByYear = useCallback((yearId: string) => {
    return units.filter((u) => u.yearId === yearId).sort((a, b) => a.order - b.order);
  }, [units]);

  // Generic content item CRUD
  const createContentItem = <T extends ContentType>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    type: T['type']
  ) => {
    return (item: Omit<T, 'id' | 'type' | 'order'>) => {
      const newItem = {
        ...item,
        id: `${type}-${Date.now()}`,
        type,
        order: 0,
      } as T;
      setter((prev) => {
        const sameUnitItems = prev.filter((i) => i.unitId === item.unitId);
        newItem.order = sameUnitItems.length;
        return [...prev, newItem];
      });
      return newItem;
    };
  };

  const updateContentItem = <T extends ContentType>(
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    return (id: string, updates: Partial<Omit<T, 'id' | 'type'>>) => {
      setter((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };
  };

  const deleteContentItem = <T extends ContentType>(
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    return (id: string) => {
      setter((prev) => prev.filter((item) => item.id !== id));
    };
  };

  const reorderContentItems = <T extends ContentType>(
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    return (reordered: T[]) => {
      setter((prev) => {
        const reorderedIds = new Set(reordered.map((r) => r.id));
        const unchanged = prev.filter((item) => !reorderedIds.has(item.id));
        return [...unchanged, ...reordered.map((r, i) => ({ ...r, order: i }))];
      });
    };
  };

  // Lesson CRUD
  const addLesson = createContentItem(setLessons, 'lesson');
  const updateLesson = updateContentItem(setLessons);
  const deleteLesson = deleteContentItem(setLessons);
  const reorderLessons = reorderContentItems(setLessons);

  // Practice CRUD
  const addPractice = createContentItem(setPractices, 'practice');
  const updatePractice = updateContentItem(setPractices);
  const deletePractice = deleteContentItem(setPractices);
  const reorderPractices = reorderContentItems(setPractices);

  // Project CRUD
  const addProject = createContentItem(setProjects, 'project');
  const updateProject = updateContentItem(setProjects);
  const deleteProject = deleteContentItem(setProjects);
  const reorderProjects = reorderContentItems(setProjects);

  // Game CRUD
  const addGame = createContentItem(setGames, 'game');
  const updateGame = updateContentItem(setGames);
  const deleteGame = deleteContentItem(setGames);
  const reorderGames = reorderContentItems(setGames);

  // Get content by unit
  const getContentByUnit = useCallback((unitId: string) => {
    return {
      lessons: lessons.filter((l) => l.unitId === unitId).sort((a, b) => a.order - b.order),
      practices: practices.filter((p) => p.unitId === unitId).sort((a, b) => a.order - b.order),
      projects: projects.filter((p) => p.unitId === unitId).sort((a, b) => a.order - b.order),
      games: games.filter((g) => g.unitId === unitId).sort((a, b) => a.order - b.order),
    };
  }, [lessons, practices, projects, games]);

  // Get all content for display (combined for backwards compatibility)
  const getAllContent = useCallback(() => {
    const allItems: Array<ContentType & { unit: string; category: ContentType['type'] }> = [];
    
    const addItems = <T extends ContentType>(items: T[]) => {
      items.forEach((item) => {
        const unit = units.find((u) => u.id === item.unitId);
        if (unit) {
          allItems.push({
            ...item,
            unit: unit.name,
            category: item.type,
          });
        }
      });
    };
    
    addItems(lessons);
    addItems(practices);
    addItems(projects);
    addItems(games);
    
    return allItems;
  }, [lessons, practices, projects, games, units]);

  // Import/Export
  const exportToJSON = useCallback(() => {
    return JSON.stringify({
      years,
      units,
      lessons,
      practices,
      projects,
      games,
      exportedAt: new Date().toISOString(),
      version: '2.0',
    }, null, 2);
  }, [years, units, lessons, practices, projects, games]);

  const exportToCSV = useCallback(() => {
    const rows: string[][] = [];
    
    // Header
    rows.push(['Type', 'ID', 'Title', 'Description', 'Year', 'Unit', 'Difficulty', 'Points', 'Icon', 'Order', 'HTML Content']);
    
    const addContentRows = <T extends ContentType>(items: T[], type: string) => {
      items.forEach((item) => {
        const unit = units.find((u) => u.id === item.unitId);
        const year = unit ? years.find((y) => y.id === unit.yearId) : null;
        rows.push([
          type,
          item.id,
          item.title,
          item.description,
          year?.name || '',
          unit?.name || '',
          item.difficulty,
          item.points.toString(),
          item.icon,
          item.order.toString(),
          item.htmlContent || '',
        ]);
      });
    };
    
    addContentRows(lessons, 'lesson');
    addContentRows(practices, 'practice');
    addContentRows(projects, 'project');
    addContentRows(games, 'game');
    
    return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  }, [years, units, lessons, practices, projects, games]);

  const importFromJSON = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.years && data.units) {
        setYears(data.years);
        setUnits(data.units);
        setLessons(data.lessons || []);
        setPractices(data.practices || []);
        setProjects(data.projects || []);
        setGames(data.games || []);
        if (data.years.length > 0) {
          setSelectedYearId(data.years[0].id);
        }
        return { success: true };
      }
      return { success: false, error: 'Invalid JSON structure' };
    } catch (e) {
      return { success: false, error: 'Failed to parse JSON' };
    }
  }, []);

  const importFromCSV = useCallback((csvString: string) => {
    try {
      const lines = csvString.split('\n').filter((line) => line.trim());
      if (lines.length < 2) {
        return { success: false, error: 'CSV must have header and at least one row' };
      }

      // Parse CSV properly handling quoted fields
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };

      const header = parseCSVLine(lines[0]);
      const rows = lines.slice(1).map(parseCSVLine);

      // Create year and unit maps
      const yearMap = new Map<string, Year>();
      const unitMap = new Map<string, Unit>();

      rows.forEach((row) => {
        const yearName = row[4] || 'Grade 4';
        const unitName = row[5] || 'Default Unit';
        
        if (!yearMap.has(yearName)) {
          yearMap.set(yearName, {
            id: `year-${Date.now()}-${yearMap.size}`,
            name: yearName,
            order: yearMap.size,
          });
        }
        
        const yearId = yearMap.get(yearName)!.id;
        const unitKey = `${yearId}-${unitName}`;
        
        if (!unitMap.has(unitKey)) {
          unitMap.set(unitKey, {
            id: `unit-${Date.now()}-${unitMap.size}`,
            name: unitName,
            yearId,
            order: unitMap.size,
          });
        }
      });

      const newYears = Array.from(yearMap.values());
      const newUnits = Array.from(unitMap.values());
      const newLessons: ManagedLesson[] = [];
      const newPractices: Practice[] = [];
      const newProjects: Project[] = [];
      const newGames: Game[] = [];

      rows.forEach((row, index) => {
        const type = row[0]?.toLowerCase() || 'lesson';
        const yearName = row[4] || 'Grade 4';
        const unitName = row[5] || 'Default Unit';
        const yearId = yearMap.get(yearName)!.id;
        const unitKey = `${yearId}-${unitName}`;
        const unitId = unitMap.get(unitKey)!.id;

        const baseItem = {
          id: row[1] || `${type}-${Date.now()}-${index}`,
          title: row[2] || 'Untitled',
          description: row[3] || '',
          unitId,
          difficulty: (row[6] as 'easy' | 'medium' | 'hard') || 'easy',
          points: parseInt(row[7]) || 10,
          icon: row[8] || '📚',
          order: parseInt(row[9]) || index,
          htmlContent: row[10] || undefined,
        };

        switch (type) {
          case 'lesson':
            newLessons.push({ ...baseItem, type: 'lesson' });
            break;
          case 'practice':
            newPractices.push({ ...baseItem, type: 'practice' });
            break;
          case 'project':
            newProjects.push({ ...baseItem, type: 'project' });
            break;
          case 'game':
            newGames.push({ ...baseItem, type: 'game' });
            break;
        }
      });

      setYears(newYears);
      setUnits(newUnits);
      setLessons(newLessons);
      setPractices(newPractices);
      setProjects(newProjects);
      setGames(newGames);
      if (newYears.length > 0) {
        setSelectedYearId(newYears[0].id);
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to parse CSV' };
    }
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const defaults = createDefaultData();
    setYears(defaults.years);
    setUnits(defaults.units);
    setLessons(defaults.lessons);
    setPractices(defaults.practices);
    setProjects(defaults.projects);
    setGames(defaults.games);
    setSelectedYearId(defaults.years[0]?.id || null);
    localStorage.removeItem(YEARS_KEY);
    localStorage.removeItem(UNITS_KEY);
    localStorage.removeItem(LESSONS_KEY);
    localStorage.removeItem(PRACTICES_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(GAMES_KEY);
  }, []);

  return {
    // Data
    years,
    units,
    lessons,
    practices,
    projects,
    games,
    isLoaded,
    selectedYearId,
    setSelectedYearId,
    
    // Year operations
    addYear,
    updateYear,
    deleteYear,
    reorderYears,
    
    // Unit operations
    addUnit,
    updateUnit,
    deleteUnit,
    reorderUnits,
    getUnitsByYear,
    
    // Lesson operations
    addLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    
    // Practice operations
    addPractice,
    updatePractice,
    deletePractice,
    reorderPractices,
    
    // Project operations
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    
    // Game operations
    addGame,
    updateGame,
    deleteGame,
    reorderGames,
    
    // Queries
    getContentByUnit,
    getAllContent,
    
    // Import/Export
    exportToJSON,
    exportToCSV,
    importFromJSON,
    importFromCSV,
    
    // Reset
    resetToDefaults,
  };
}

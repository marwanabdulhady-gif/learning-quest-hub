import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { LessonCard } from '@/components/LessonCard';
import { FilterBar } from '@/components/FilterBar';
import { ProgressBar } from '@/components/ProgressBar';
import { LessonDialog } from '@/components/LessonDialog';
import { useGamification } from '@/hooks/useGamification';
import { useContentManager, type ManagedLesson } from '@/hooks/useContentManager';
import type { Badge } from '@/data/badges';

const Index = () => {
  const gamification = useGamification();
  const content = useContentManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ManagedLesson | null>(null);
  const [recentlyEarnedBadges, setRecentlyEarnedBadges] = useState<Badge[]>([]);

  const filteredLessons = useMemo(() => {
    return content.lessons.filter((lesson) => {
      const matchesSearch =
        !searchQuery ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUnit = !selectedUnit || lesson.unit === selectedUnit;
      const matchesCategory = !selectedCategory || lesson.category === selectedCategory;
      return matchesSearch && matchesUnit && matchesCategory;
    });
  }, [searchQuery, selectedUnit, selectedCategory, content.lessons]);

  const progress = gamification.getProgress();

  const handleCompleteLesson = () => {
    if (!selectedLesson) return;
    const result = gamification.completeLesson(selectedLesson.id);
    setRecentlyEarnedBadges(result.newBadges);
  };

  const handleCloseDialog = () => {
    setSelectedLesson(null);
    setRecentlyEarnedBadges([]);
  };

  if (!content.isLoaded) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Header totalPoints={gamification.totalPoints} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Welcome to <span className="text-gradient-primary">Math Adventures!</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Complete lessons, earn points, and unlock awesome badges. Let's make math fun! 🎉
          </p>
        </section>

        {/* Progress Section */}
        <section className="mb-8 rounded-2xl bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Progress</h2>
              <p className="text-sm text-muted-foreground">Keep going, you're doing great!</p>
            </div>
            <div className="flex-1 max-w-md">
              <ProgressBar
                completed={progress.completed}
                total={progress.total}
                color="primary"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedUnit={selectedUnit}
            onUnitChange={setSelectedUnit}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            units={content.getUnitNames()}
          />
        </section>

        {/* Lessons Grid */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              {filteredLessons.length === content.lessons.length
                ? 'All Lessons'
                : `${filteredLessons.length} Lesson${filteredLessons.length !== 1 ? 's' : ''} Found`}
            </h2>
          </div>

          {filteredLessons.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredLessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={gamification.isLessonCompleted(lesson.id)}
                  onClick={() => setSelectedLesson(lesson)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-card p-12 text-center shadow-card">
              <div className="mb-4 text-5xl">🔍</div>
              <h3 className="text-xl font-bold text-foreground">No lessons found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Lesson Dialog */}
      <LessonDialog
        lesson={selectedLesson}
        isOpen={!!selectedLesson}
        onClose={handleCloseDialog}
        isCompleted={selectedLesson ? gamification.isLessonCompleted(selectedLesson.id) : false}
        onComplete={handleCompleteLesson}
        recentlyEarnedBadges={recentlyEarnedBadges}
      />
    </div>
  );
};

export default Index;

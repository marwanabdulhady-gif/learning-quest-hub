import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManagedLesson } from '@/hooks/useContentManager';

interface LessonCardProps {
  lesson: ManagedLesson;
  isCompleted: boolean;
  onClick: () => void;
  index: number;
}

const categoryColors = {
  lesson: 'bg-primary/10 text-primary border-primary/20',
  practice: 'bg-accent/10 text-accent border-accent/20',
  project: 'bg-success/10 text-success border-success/20',
  game: 'bg-gold/10 text-gold-foreground border-gold/20',
};

const difficultyIcons = {
  easy: '⭐',
  medium: '⭐⭐',
  hard: '⭐⭐⭐',
};

export function LessonCard({ lesson, isCompleted, onClick, index }: LessonCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all duration-300',
        'hover:shadow-card-hover hover:-translate-y-1',
        'shadow-card border-2',
        isCompleted ? 'border-success/40 bg-success-light/30' : 'border-transparent',
        'animate-slide-up'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Completed checkmark overlay */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <div className="rounded-full bg-success p-1 shadow-md animate-pop-in">
            <CheckCircle2 className="h-5 w-5 text-success-foreground" />
          </div>
        </div>
      )}

      <CardContent className="p-5">
        {/* Icon */}
        <div
          className={cn(
            'mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl',
            'transition-transform duration-300 group-hover:scale-110',
            isCompleted ? 'bg-success/20' : 'bg-muted'
          )}
        >
          {lesson.icon}
        </div>

        {/* Category & Difficulty */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn('text-xs font-semibold capitalize', categoryColors[lesson.category])}
          >
            {lesson.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {difficultyIcons[lesson.difficulty]}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {lesson.description}
        </p>

        {/* Points */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{lesson.unit}</span>
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold',
              isCompleted
                ? 'bg-success/20 text-success'
                : 'bg-gold/20 text-gold-foreground'
            )}
          >
            <span>+{lesson.points}</span>
            <span className="text-xs">pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

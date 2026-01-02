import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import type { ManagedLesson } from '@/hooks/useContentManager';
import type { Badge } from '@/data/badges';
import { cn } from '@/lib/utils';

interface LessonDialogProps {
  lesson: ManagedLesson | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onComplete: () => void;
  recentlyEarnedBadges: Badge[];
}

export function LessonDialog({
  lesson,
  isOpen,
  onClose,
  isCompleted,
  onComplete,
  recentlyEarnedBadges,
}: LessonDialogProps) {
  if (!lesson) return null;

  const hasHtmlContent = lesson.htmlContent && lesson.htmlContent.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-lg", hasHtmlContent && "sm:max-w-3xl max-h-[90vh] overflow-y-auto")}>
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-4xl">
              {lesson.icon}
            </div>
            <div>
              <DialogTitle className="text-xl">{lesson.title}</DialogTitle>
              <DialogDescription className="mt-1">{lesson.unit}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-foreground">{lesson.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
              {lesson.category}
            </span>
            <span className="rounded-full bg-gold/20 px-3 py-1 text-sm font-bold text-gold-foreground">
              +{lesson.points} points
            </span>
          </div>

          {/* HTML Content Section */}
          {hasHtmlContent && (
            <div className="mt-6 rounded-xl border bg-background p-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.htmlContent || '' }}
              />
            </div>
          )}

          {/* Show recently earned badges */}
          {recentlyEarnedBadges.length > 0 && (
            <div className="mt-6 rounded-xl border-2 border-gold/40 bg-gold/10 p-4">
              <div className="mb-3 flex items-center gap-2 text-gold-foreground">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">New Badge{recentlyEarnedBadges.length > 1 ? 's' : ''} Earned!</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {recentlyEarnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-sm animate-pop-in"
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="font-semibold text-sm">{badge.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isCompleted ? (
            <Button disabled className="gap-2 bg-success text-success-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Button>
          ) : (
            <Button onClick={onComplete} className="gap-2 gradient-primary shadow-button">
              <Trophy className="h-4 w-4" />
              Mark as Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
